import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserPlaylists, useCreatePlaylist, useAddToPlaylist, useRemoveFromPlaylist, useUserMedia } from '@/hooks/useMedia'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { toast } from '@/components/ui/Toast'
import {
  Plus,
  List,
  Eye,
  EyeOff,
  Save,
  X,
  Film,
  Tv,
  Book,
  Gamepad2,
  Search
} from 'lucide-react'
import { formatMediaType } from '@/lib/utils'

export function MyLists() {
  const { user } = useAuth()
  const { data: playlists, isLoading } = useUserPlaylists(user?.id || '')
  const { data: userMedia } = useUserMedia(user?.id || '')
  const createPlaylistMutation = useCreatePlaylist()
  const addToPlaylistMutation = useAddToPlaylist()
  const removeFromPlaylistMutation = useRemoveFromPlaylist()

  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    isPublic: true
  })

  const handleCreatePlaylist = async () => {
    if (!user?.id || !newPlaylist.name.trim()) return

    try {
      await createPlaylistMutation.mutateAsync({
        userId: user.id,
        name: newPlaylist.name.trim(),
        description: newPlaylist.description.trim() || undefined,
        isPublic: newPlaylist.isPublic
      })
      setNewPlaylist({ name: '', description: '', isPublic: true })
      setIsCreatingPlaylist(false)
    } catch (error) {
      console.error('Failed to create playlist:', error)
      toast.error('Failed to Create Playlist', 'Please try again or contact support if the issue persists.')
    }
  }

  const handleRemoveFromPlaylist = async (playlistItemId: string) => {
    try {
      await removeFromPlaylistMutation.mutateAsync({ playlistItemId })
    } catch (error) {
      console.error('Failed to remove from playlist:', error)
      toast.error('Failed to Remove Item', 'Could not remove item from playlist. Please try again.')
    }
  }

  const handleAddToPlaylist = async (playlistId: string, mediaId: string) => {
    try {
      await addToPlaylistMutation.mutateAsync({ playlistId, mediaId })
      setIsAddingToPlaylist(false)
    } catch (error) {
      console.error('Failed to add to playlist:', error)
      toast.error('Failed to Add Item', 'Could not add item to playlist. Please try again.')
    }
  }

  const filteredUserMedia = userMedia?.filter(item =>
    item.media.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

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
                  My Lists
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                  Create custom playlists to organize your favorite media
                </p>
              </div>
              <Button
                onClick={() => setIsCreatingPlaylist(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create List
              </Button>
            </div>
          </div>
        </div>

        {/* Create Playlist Modal */}
        {isCreatingPlaylist && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <List className="h-5 w-5" />
                  Create New List
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    List Name *
                  </label>
                  <Input
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter List Name"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Description
                  </label>
                  <Input
                    value={newPlaylist.description}
                    onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe Your List (Optional)"
                    className="h-10"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Public List</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Others can see and browse this list</p>
                  </div>
                  <Button
                    onClick={() => setNewPlaylist(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                    className={`${newPlaylist.isPublic
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                      } text-white border-0`}
                  >
                    {newPlaylist.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCreatePlaylist}
                    disabled={createPlaylistMutation.isPending || !newPlaylist.name.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createPlaylistMutation.isPending ? 'Creating...' : 'Create List'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingPlaylist(false)}
                    className="border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Playlists Grid */}
        {playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {playlist.name}
                      </CardTitle>
                      {playlist.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {playlist.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {playlist.is_public ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <Eye className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{playlist.playlist_items?.length || 0} items</span>
                      <span>{new Date(playlist.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Media Items Preview */}
                    {playlist.playlist_items && playlist.playlist_items.length > 0 ? (
                      <div className="space-y-2">
                        {playlist.playlist_items.slice(0, 3).map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              {item.media?.type === 'movie' && <Film className="h-4 w-4 text-white" />}
                              {item.media?.type === 'tv' && <Tv className="h-4 w-4 text-white" />}
                              {item.media?.type === 'book' && <Book className="h-4 w-4 text-white" />}
                              {item.media?.type === 'game' && <Gamepad2 className="h-4 w-4 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                {item.media?.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {formatMediaType(item.media?.type)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromPlaylist(item.id)}
                              className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {playlist.playlist_items.length > 3 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                            +{playlist.playlist_items.length - 3} more items
                          </p>
                        )}
                        <Button
                          onClick={() => {
                            setSelectedPlaylist(playlist.id)
                            setIsAddingToPlaylist(true)
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Items
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <List className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">No items yet</p>
                        <Button
                          onClick={() => {
                            setSelectedPlaylist(playlist.id)
                            setIsAddingToPlaylist(true)
                          }}
                          variant="outline"
                          size="sm"
                          className="border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Items
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <List className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No lists yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first playlist to organize your favorite media
            </p>
            <Button
              onClick={() => setIsCreatingPlaylist(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First List
            </Button>
          </div>
        )}

        {/* Add to Playlist Modal */}
        {isAddingToPlaylist && selectedPlaylist && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Items to {playlists?.find(p => p.id === selectedPlaylist)?.name || 'Playlist'}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setIsAddingToPlaylist(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Your Tracked Media..."
                    className="pl-10 h-10"
                  />
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredUserMedia.length > 0 ? (
                    filteredUserMedia.map((item) => {
                      const isAlreadyInPlaylist = playlists
                        ?.find(p => p.id === selectedPlaylist)
                        ?.playlist_items?.some((pi: any) => pi.media_id === item.media.id)

                      return (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {item.media.type === 'movie' && <Film className="h-5 w-5 text-white" />}
                            {item.media.type === 'tv' && <Tv className="h-5 w-5 text-white" />}
                            {item.media.type === 'book' && <Book className="h-5 w-5 text-white" />}
                            {item.media.type === 'game' && <Gamepad2 className="h-5 w-5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {item.media.title}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {formatMediaType(item.media.type)}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleAddToPlaylist(selectedPlaylist, item.media.id)}
                            disabled={isAlreadyInPlaylist}
                            className={`${isAlreadyInPlaylist
                              ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                              } text-white border-0`}
                          >
                            {isAlreadyInPlaylist ? 'Added' : 'Add'}
                          </Button>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">
                        {searchTerm ? 'No media found matching your search' : 'No tracked media available'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
