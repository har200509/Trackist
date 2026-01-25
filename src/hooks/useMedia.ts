import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { searchAllMedia, getAllTrendingMedia, getTrendingMovies, getTrendingTVShows, getTrendingBooks, getTrendingGames, type MediaItem } from '@/services/apiServices'

export function useMediaSearch(query: string, type?: string) {
  return useQuery({
    queryKey: ['media', 'search', query, type],
    queryFn: async (): Promise<MediaItem[]> => {
      // Use external APIs for search instead of local database
      return await searchAllMedia(query, type)
    },
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  })
}

export function useTrendingMedia() {
  return useQuery({
    queryKey: ['trending', 'all'],
    queryFn: getAllTrendingMedia,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  })
}

export function useTrendingMovies() {
  return useQuery({
    queryKey: ['trending', 'movies'],
    queryFn: getTrendingMovies,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  })
}

export function useTrendingTVShows() {
  return useQuery({
    queryKey: ['trending', 'tv'],
    queryFn: getTrendingTVShows,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  })
}

export function useTrendingBooks() {
  return useQuery({
    queryKey: ['trending', 'books'],
    queryFn: getTrendingBooks,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  })
}

export function useTrendingGames() {
  return useQuery({
    queryKey: ['trending', 'games'],
    queryFn: getTrendingGames,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  })
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useUserPublicMedia(userId: string) {
  return useQuery({
    queryKey: ['userPublicMedia', userId],
    queryFn: async () => {
      // First check if the user's profile is private
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('is_private')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      // If profile is private, return empty array
      if (user?.is_private) {
        return []
      }

      const { data, error } = await supabase
        .from('user_media')
        .select(`
          *,
          media (*)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20) // Limit for public view

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useUserPublicStats(userId: string) {
  return useQuery({
    queryKey: ['userPublicStats', userId],
    queryFn: async () => {
      // First check if the user's profile is private
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('is_private')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      // If profile is private, return empty stats
      if (user?.is_private) {
        return {
          total: 0,
          completed: 0,
          watching: 0,
          planned: 0,
          dropped: 0,
          averageRating: 0,
          movies: 0,
          tv: 0,
          books: 0,
          games: 0,
          streak: 0,
          lastCompleted: null
        }
      }

      const { data, error } = await supabase
        .from('user_media')
        .select('status, rating, media(type), updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      // Calculate stats
      const total = data.length
      const completed = data.filter(item => item.status === 'completed').length
      const watching = data.filter(item => item.status === 'watching').length
      const planned = data.filter(item => item.status === 'plan_to_watch').length
      const dropped = data.filter(item => item.status === 'dropped').length

      const ratings = data.filter(item => item.rating && item.rating > 0)
      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
        : 0

      // Count by media type
      const movies = data.filter(item => (item.media as any)?.type === 'movie').length
      const tv = data.filter(item => (item.media as any)?.type === 'tv').length
      const books = data.filter(item => (item.media as any)?.type === 'book').length
      const games = data.filter(item => (item.media as any)?.type === 'game').length

      // Calculate streak
      const streak = calculateStreak(data)

      return {
        total,
        completed,
        watching,
        planned,
        dropped,
        averageRating,
        movies,
        tv,
        books,
        games,
        streak
      }
    },
    enabled: !!userId,
  })
}

// Helper function to calculate streak
function calculateStreak(userMedia: any[]): number {
  if (!userMedia || userMedia.length === 0) return 0

  // Get unique dates when user updated media
  const updateDates = userMedia
    .map(item => new Date(item.updated_at).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  if (updateDates.length === 0) return 0

  let streak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

  // Check if user was active today or yesterday
  if (updateDates[0] === today || updateDates[0] === yesterday) {
    streak = 1

    // Count consecutive days
    for (let i = 1; i < updateDates.length; i++) {
      const currentDate = new Date(updateDates[i - 1])
      const previousDate = new Date(updateDates[i])
      const diffTime = currentDate.getTime() - previousDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }
  }

  return streak
}

export function useUserMedia(userId: string) {
  return useQuery({
    queryKey: ['userMedia', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_media')
        .select(`
          *,
          media (*)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useUserMediaByStatus(userId: string, status: string) {
  return useQuery({
    queryKey: ['userMedia', userId, status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_media')
        .select(`
          *,
          media (*)
        `)
        .eq('user_id', userId)
        .eq('status', status)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useMediaDetail(id: string) {
  return useQuery({
    queryKey: ['media', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useAddToList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, mediaItem, status }: {
      userId: string
      mediaItem: MediaItem
      status: string
    }) => {
      // First, ensure the media item exists in our database
      const { data: existingMedia, error: fetchError } = await supabase
        .from('media')
        .select('id')
        .eq('api_id', mediaItem.api_id)
        .eq('type', mediaItem.type)
        .single()

      let mediaId: string

      if (fetchError || !existingMedia) {
        // Media doesn't exist, create it
        const { data: newMedia, error: insertError } = await supabase
          .from('media')
          .insert({
            api_id: mediaItem.api_id,
            type: mediaItem.type,
            title: mediaItem.title,
            description: mediaItem.description,
            poster_url: mediaItem.poster_url,
            release_date: mediaItem.release_date,
            genres: mediaItem.genres,
          })
          .select('id')
          .single()

        if (insertError) throw insertError
        mediaId = newMedia.id
      } else {
        mediaId = existingMedia.id
      }

      // Now create the user_media relationship
      const { data, error } = await supabase
        .from('user_media')
        .upsert({
          user_id: userId,
          media_id: mediaId,
          status,
          progress: 0,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] })
    },
  })
}

export function useUpdateProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, progress, status }: {
      id: string
      progress: number
      status?: string
    }) => {
      const updates: any = {
        progress,
        updated_at: new Date().toISOString()
      }

      // Auto-update status based on progress
      if (progress >= 100 && status !== 'dropped') {
        updates.status = 'completed'
      } else if (progress > 0 && status === 'plan_to_watch') {
        updates.status = 'watching'
      } else if (status) {
        updates.status = status
      }

      const { data, error } = await supabase
        .from('user_media')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] })
    },
  })
}

export function useUpdateEpisodes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      watchedEpisodes,
      totalEpisodes,
      status
    }: {
      id: string;
      watchedEpisodes: number;
      totalEpisodes: number;
      status?: string
    }) => {
      // Calculate progress percentage
      const progress = totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0

      const updates: any = {
        watched_episodes: watchedEpisodes,
        total_episodes: totalEpisodes,
        progress,
        updated_at: new Date().toISOString()
      }

      // Auto-update status based on progress
      if (progress >= 100 && status !== 'dropped') {
        updates.status = 'completed'
      } else if (progress > 0 && status === 'plan_to_watch') {
        updates.status = 'watching'
      } else if (status) {
        updates.status = status
      }

      const { data, error } = await supabase
        .from('user_media')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] })
    },
    onError: () => {
      // Episode update failed - error will be handled by UI
    }
  })
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: {
      id: string
      status: 'plan_to_watch' | 'watching' | 'completed' | 'dropped'
    }) => {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      }

      // Reset progress if dropping or planning to watch
      if (status === 'dropped' || status === 'plan_to_watch') {
        updates.progress = 0
      }

      const { data, error } = await supabase
        .from('user_media')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] })
    },
  })
}

export function useUpdateRating() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, rating }: {
      id: string
      rating: number
    }) => {
      const { data, error } = await supabase
        .from('user_media')
        .update({
          rating,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] })
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, updates }: {
      userId: string
      updates: { username?: string; bio?: string; is_private?: boolean }
    }) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Database update error:', error)
        throw error
      }

      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({ newPassword }: {
      currentPassword: string
      newPassword: string
    }) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
    },
  })
}

export function useChangeEmail() {
  return useMutation({
    mutationFn: async ({ newEmail }: {
      newEmail: string
    }) => {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      })
      if (error) throw error
    },
  })
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, name, description, isPublic }: {
      userId: string
      name: string
      description?: string
      isPublic?: boolean
    }) => {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: userId,
          name,
          description,
          is_public: isPublic ?? true
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
    },
  })
}

export function useUserPlaylists(userId: string) {
  return useQuery({
    queryKey: ['playlists', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_items (
            *,
            media (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useAddToPlaylist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ playlistId, mediaId }: {
      playlistId: string
      mediaId: string
    }) => {
      const { data, error } = await supabase
        .from('playlist_items')
        .insert({
          playlist_id: playlistId,
          media_id: mediaId
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
    },
  })
}

export function useRemoveFromPlaylist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ playlistItemId }: {
      playlistItemId: string
    }) => {
      const { error } = await supabase
        .from('playlist_items')
        .delete()
        .eq('id', playlistItemId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
    },
  })
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, bio, avatar_url, created_at, is_private')
        .eq('is_private', false) // Only show public profiles
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useFollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ followerId, followingId }: {
      followerId: string
      followingId: string
    }) => {
      const { data, error } = await supabase
        .from('follows')
        .insert({
          follower_id: followerId,
          following_id: followingId
        })
        .select()
        .single()

      if (error) {
        console.error('Error following user:', error)
        throw error
      }
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['follows'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
      queryClient.invalidateQueries({ queryKey: ['followers', variables.followingId] })
      queryClient.invalidateQueries({ queryKey: ['following', variables.followerId] })
      queryClient.invalidateQueries({ queryKey: ['isFollowing', variables.followerId, variables.followingId] })
    },
  })
}

export function useUnfollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ followerId, followingId }: {
      followerId: string
      followingId: string
    }) => {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId)

      if (error) {
        console.error('Error unfollowing user:', error)
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['follows'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
      queryClient.invalidateQueries({ queryKey: ['followers', variables.followingId] })
      queryClient.invalidateQueries({ queryKey: ['following', variables.followerId] })
      queryClient.invalidateQueries({ queryKey: ['isFollowing', variables.followerId, variables.followingId] })
    },
  })
}

export function useUserFollowers(userId: string) {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {

      // First get the follow records
      const { data: follows, error: followsError } = await supabase
        .from('follows')
        .select('*')
        .eq('following_id', userId)

      if (followsError) {
        console.error('Error fetching follows:', followsError)
        throw followsError
      }

      if (!follows || follows.length === 0) {
        return []
      }

      // Then get the user details for each follower
      const followerIds = follows.map(follow => follow.follower_id)
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, username, avatar_url, bio')
        .in('id', followerIds)

      if (usersError) {
        console.error('Error fetching users:', usersError)
        throw usersError
      }

      // Combine the data
      const result = follows.map(follow => ({
        ...follow,
        follower: users?.find(user => user.id === follow.follower_id)
      }))

      return result
    },
    enabled: !!userId,
  })
}

export function useUserFollowing(userId: string) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {

      // First get the follow records
      const { data: follows, error: followsError } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', userId)

      if (followsError) {
        console.error('Error fetching follows:', followsError)
        throw followsError
      }

      if (!follows || follows.length === 0) {
        return []
      }

      // Then get the user details for each person being followed
      const followingIds = follows.map(follow => follow.following_id)
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, username, avatar_url, bio')
        .in('id', followingIds)

      if (usersError) {
        console.error('Error fetching users:', usersError)
        throw usersError
      }

      // Combine the data
      const result = follows.map(follow => ({
        ...follow,
        following: users?.find(user => user.id === follow.following_id)
      }))

      return result
    },
    enabled: !!userId,
  })
}

export function useIsFollowing(followerId: string, followingId: string) {
  return useQuery({
    queryKey: ['isFollowing', followerId, followingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    },
    enabled: !!followerId && !!followingId,
  })
}

export function useRemoveFromList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from('user_media')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] })
    },
  })
}

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_media')
        .select('status, rating, media(type)')
        .eq('user_id', userId)

      if (error) throw error

      const stats = {
        total: data.length,
        completed: data.filter(item => item.status === 'completed').length,
        watching: data.filter(item => item.status === 'watching').length,
        planned: data.filter(item => item.status === 'plan_to_watch').length,
        dropped: data.filter(item => item.status === 'dropped').length,
        averageRating: 0,
        byType: {
          movie: 0,
          tv: 0,
          book: 0,
          game: 0
        }
      }

      // Calculate average rating
      const ratedItems = data.filter(item => item.rating && item.rating > 0)
      if (ratedItems.length > 0) {
        stats.averageRating = ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) / ratedItems.length
      }

      // Count by type
      data.forEach(item => {
        if (item.media && typeof item.media === 'object' && 'type' in item.media) {
          const type = item.media.type as keyof typeof stats.byType
          if (type in stats.byType) {
            stats.byType[type]++
          }
        }
      })

      return stats
    },
    enabled: !!userId,
  })
}