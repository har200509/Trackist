import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getMediaTypeIcon, truncateText, formatStatusName, formatMediaType } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useUserMedia, useAddToList, useUpdateStatus } from '@/hooks/useMedia'
import { Plus, Star, Check, Play, Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MediaItem } from '@/services/apiServices'

interface MediaCardProps {
  media: MediaItem
  showAddButton?: boolean
}

export function MediaCard({ media, showAddButton = true }: MediaCardProps) {
  const { userProfile } = useAuth()
  const { data: userMedia } = useUserMedia(userProfile?.id || '')
  const addToListMutation = useAddToList()
  const updateStatusMutation = useUpdateStatus()

  // Find if this media is already tracked by the user
  const trackedMedia = userMedia?.find(item =>
    item.media.api_id === media.api_id && item.media.type === media.type
  )

  const handleAddToList = (status: string) => {
    if (userProfile?.id) {
      addToListMutation.mutate({
        userId: userProfile.id,
        mediaItem: media,
        status
      })
    }
  }

  const handleStatusChange = (newStatus: 'plan_to_watch' | 'watching' | 'completed' | 'dropped') => {
    if (trackedMedia) {
      updateStatusMutation.mutate({
        id: trackedMedia.id,
        status: newStatus
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'watching': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'plan_to_watch': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'dropped': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="h-3 w-3" />
      case 'watching': return <Play className="h-3 w-3" />
      case 'plan_to_watch': return <Clock className="h-3 w-3" />
      case 'dropped': return <X className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden">
      <div className="aspect-[2/3] bg-muted relative overflow-hidden">
        {media.poster_url ? (
          <img
            src={media.poster_url}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {getMediaTypeIcon(media.type)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Status Badge */}
        {trackedMedia && (
          <Badge className={cn(
            "absolute top-3 left-3 text-xs",
            getStatusColor(trackedMedia.status)
          )}>
            {getStatusIcon(trackedMedia.status)}
            <span className="ml-1">{formatStatusName(trackedMedia.status, media.type)}</span>
          </Badge>
        )}

        {/* Rating */}
        {trackedMedia?.rating && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
            <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
            {trackedMedia.rating}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {trackedMedia ? (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={trackedMedia.status === 'plan_to_watch' ? 'default' : 'secondary'}
                onClick={(e) => {
                  e.stopPropagation()
                  handleStatusChange('plan_to_watch')
                }}
                disabled={updateStatusMutation.isPending}
                className="flex-1 text-xs"
              >
                <Clock className="h-3 w-3 mr-1" />
                {formatStatusName('plan_to_watch', media.type)}
              </Button>
              <Button
                size="sm"
                variant={trackedMedia.status === 'watching' ? 'default' : 'secondary'}
                onClick={(e) => {
                  e.stopPropagation()
                  handleStatusChange('watching')
                }}
                disabled={updateStatusMutation.isPending}
                className="flex-1 text-xs"
              >
                <Play className="h-3 w-3 mr-1" />
                {formatStatusName('watching', media.type)}
              </Button>
              <Button
                size="sm"
                variant={trackedMedia.status === 'completed' ? 'default' : 'secondary'}
                onClick={(e) => {
                  e.stopPropagation()
                  handleStatusChange('completed')
                }}
                disabled={updateStatusMutation.isPending}
                className="flex-1 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Done
              </Button>
            </div>
          ) : showAddButton ? (
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToList('plan_to_watch')
                }}
                disabled={addToListMutation.isPending}
                className="flex-1 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add To List
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {media.title}
          </h3>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {formatMediaType(media.type)}
          </Badge>
        </div>

        {media.release_date && (
          <p className="text-sm text-muted-foreground mb-2">
            {new Date(media.release_date).getFullYear()}
          </p>
        )}

        {media.genres && media.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {media.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        )}

        {media.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateText(media.description, 120)}
          </p>
        )}

        {/* Progress Bar for TV shows only */}
        {trackedMedia && trackedMedia.progress > 0 && media.type === 'tv' && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs text-muted-foreground">{trackedMedia.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${trackedMedia.progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}