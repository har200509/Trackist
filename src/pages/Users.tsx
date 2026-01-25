import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAllUsers, useFollowUser, useUnfollowUser, useIsFollowing } from '@/hooks/useMedia'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { toast } from '@/components/ui/Toast'
import {
  Users,
  Search,
  UserPlus,
  UserMinus,
  Calendar,
  User as UserIcon,
  Filter
} from 'lucide-react'

interface UsersPageProps {
  onUserClick: (userId: string) => void
}

export function UsersPage({ onUserClick }: UsersPageProps) {
  const { user } = useAuth()
  const { data: allUsers, isLoading } = useAllUsers()
  const followUserMutation = useFollowUser()
  const unfollowUserMutation = useUnfollowUser()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')

  const filteredUsers = allUsers?.filter(userItem =>
    userItem.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userItem.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.username.localeCompare(b.username)
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const handleFollowToggle = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
    if (!user?.id) return

    try {
      if (isCurrentlyFollowing) {
        await unfollowUserMutation.mutateAsync({
          followerId: user.id,
          followingId: targetUserId
        })
      } else {
        await followUserMutation.mutateAsync({
          followerId: user.id,
          followingId: targetUserId
        })
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      toast.error('Failed to Update Follow Status', 'Could not update follow status. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="p-6 space-y-8">
          <div className="animate-pulse">
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                  Users
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                  Discover and connect with other media enthusiasts
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {allUsers?.length || 0}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Total Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Users By Name Or Bio..."
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'newest' ? 'default' : 'outline'}
                  onClick={() => setSortBy('newest')}
                  className={`h-12 px-4 ${sortBy === 'newest'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                    : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Newest
                </Button>
                <Button
                  variant={sortBy === 'oldest' ? 'default' : 'outline'}
                  onClick={() => setSortBy('oldest')}
                  className={`h-12 px-4 ${sortBy === 'oldest'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                    : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Oldest
                </Button>
                <Button
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  onClick={() => setSortBy('name')}
                  className={`h-12 px-4 ${sortBy === 'name'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                    : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Name
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        {sortedUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUsers.map((userItem) => (
              <UserCard
                key={userItem.id}
                user={userItem}
                currentUserId={user?.id}
                onUserClick={onUserClick}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No users found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No users available at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface UserCardProps {
  user: {
    id: string
    username: string
    bio?: string
    avatar_url?: string
    created_at: string
  }
  currentUserId?: string
  onUserClick: (userId: string) => void
  onFollowToggle: (userId: string, isFollowing: boolean) => void
}

function UserCard({ user, currentUserId, onUserClick, onFollowToggle }: UserCardProps) {
  const { data: isFollowing } = useIsFollowing(currentUserId || '', user.id)
  const isOwnProfile = currentUserId === user.id

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate">
              {user.username}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
              {user.bio || 'No Bio Available'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Joined {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => onUserClick(user.id)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            View Profile
          </Button>
          {!isOwnProfile && (
            <Button
              onClick={() => onFollowToggle(user.id, isFollowing || false)}
              variant="outline"
              className={`border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${isFollowing ? 'text-red-600 hover:text-red-700' : 'text-blue-600 hover:text-blue-700'
                }`}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="h-4 w-4 mr-1" />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
