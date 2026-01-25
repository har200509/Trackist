import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
    Play,
    Pause,
    Check,
    X,
    Star,
    Trash2,
    Calendar,
    Clock,
    Download,
    Plus,
    Minus
} from 'lucide-react'
import { cn, formatStatusName, formatMediaType } from '@/lib/utils'
import { useUpdateProgress, useUpdateStatus, useUpdateRating, useRemoveFromList, useUpdateEpisodes } from '@/hooks/useMedia'
import { getTVShowDetails } from '@/services/apiServices'
import { PersonalReview } from '@/components/PersonalReview'

interface ProgressTrackerProps {
    userMedia: {
        id: string
        status: 'plan_to_watch' | 'watching' | 'completed' | 'dropped'
        progress: number
        watched_episodes?: number
        total_episodes?: number
        rating?: number
        created_at: string
        updated_at: string
        media: {
            id: string
            title: string
            type: string
            api_id: string
            poster_url?: string
            release_date?: string
            genres: string[]
        }
    }
    onEdit?: () => void
    userId?: string // Optional userId for reviews
    isReadOnly?: boolean // If true, shows in read-only mode
}

export function ProgressTracker({ userMedia, onEdit, userId, isReadOnly }: ProgressTrackerProps) {
    const [progress, setProgress] = useState(userMedia.progress)
    const [watchedEpisodes, setWatchedEpisodes] = useState(userMedia.watched_episodes || 0)
    const [totalEpisodes, setTotalEpisodes] = useState(userMedia.total_episodes || 0)
    const [rating, setRating] = useState(userMedia.rating || 0)
    const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false)

    const updateProgressMutation = useUpdateProgress()
    const updateEpisodesMutation = useUpdateEpisodes()
    const updateStatusMutation = useUpdateStatus()
    const updateRatingMutation = useUpdateRating()
    const removeFromListMutation = useRemoveFromList()

    // Fetch total episodes when component mounts for TV shows
    useEffect(() => {
        if (userMedia.media.type === 'tv' && !userMedia.total_episodes && userMedia.media.api_id) {
            fetchTotalEpisodes()
        }
    }, [userMedia.media.type, userMedia.total_episodes, userMedia.media.api_id])

    const fetchTotalEpisodes = async () => {
        if (!userMedia.media.api_id) return

        setIsLoadingEpisodes(true)
        try {
            const details = await getTVShowDetails(userMedia.media.api_id)
            if (details) {
                setTotalEpisodes(details.totalEpisodes)
                // Update the database with total episodes
                updateEpisodesMutation.mutate({
                    id: userMedia.id,
                    watchedEpisodes: watchedEpisodes,
                    totalEpisodes: details.totalEpisodes,
                    status: userMedia.status
                })
            }
        } catch (error) {
            // Error fetching TV show details - user can manually set episodes
        } finally {
            setIsLoadingEpisodes(false)
        }
    }

    const handleProgressChange = (newProgress: number) => {
        setProgress(newProgress)
        updateProgressMutation.mutate({
            id: userMedia.id,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'watching'
        })
    }

    const handleEpisodeChange = (newWatchedEpisodes: number) => {
        setWatchedEpisodes(newWatchedEpisodes)
        updateEpisodesMutation.mutate({
            id: userMedia.id,
            watchedEpisodes: newWatchedEpisodes,
            totalEpisodes: totalEpisodes,
            status: userMedia.status
        })
    }

    const handleStatusChange = (newStatus: 'plan_to_watch' | 'watching' | 'completed' | 'dropped') => {
        updateStatusMutation.mutate({
            id: userMedia.id,
            status: newStatus
        })
    }

    const handleRatingChange = (newRating: number) => {
        setRating(newRating)
        updateRatingMutation.mutate({
            id: userMedia.id,
            rating: newRating
        })
    }

    const handleRemove = () => {
        if (confirm('Are you sure you want to remove this item from your list?')) {
            removeFromListMutation.mutate({ id: userMedia.id })
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
            case 'completed': return <Check className="h-4 w-4" />
            case 'watching': return <Play className="h-4 w-4" />
            case 'plan_to_watch': return <Clock className="h-4 w-4" />
            case 'dropped': return <X className="h-4 w-4" />
            default: return null
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        {userMedia.media.poster_url ? (
                            <img
                                src={userMedia.media.poster_url}
                                alt={userMedia.media.title}
                                className="w-12 h-16 object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-12 h-16 bg-muted rounded-md flex items-center justify-center">
                                <span className="text-lg">
                                    {userMedia.media.type === 'movie' ? '🎬' :
                                        userMedia.media.type === 'tv' ? '📺' :
                                            userMedia.media.type === 'book' ? '📚' : '🎮'}
                                </span>
                            </div>
                        )}
                        <div>
                            <CardTitle className="text-lg">{userMedia.media.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                    {formatMediaType(userMedia.media.type)}
                                </Badge>
                                <Badge className={cn("text-xs", getStatusColor(userMedia.status))}>
                                    {getStatusIcon(userMedia.status)}
                                    <span className="ml-1">{formatStatusName(userMedia.status, userMedia.media.type)}</span>
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {userMedia.media.type === 'tv' && !isReadOnly && (
                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEpisodeChange(Math.max(0, watchedEpisodes - 1))}
                                    disabled={updateEpisodesMutation.isPending || watchedEpisodes <= 0}
                                    className="text-primary hover:text-primary"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEpisodeChange(watchedEpisodes + 1)}
                                    disabled={updateEpisodesMutation.isPending || (totalEpisodes > 0 && watchedEpisodes >= totalEpisodes)}
                                    className="text-primary hover:text-primary"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        {!isReadOnly && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRemove}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Progress Bar - Only for TV shows */}
                {userMedia.media.type === 'tv' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Episodes</span>
                            <span className="text-sm text-muted-foreground">
                                {watchedEpisodes || 0} / {totalEpisodes || '?'} episodes
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0}%` }}
                            />
                        </div>
                        {!totalEpisodes && !isReadOnly && (
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchTotalEpisodes}
                                    disabled={isLoadingEpisodes}
                                >
                                    <Download className="h-3 w-3 mr-1" />
                                    {isLoadingEpisodes ? 'Loading...' : 'Fetch Total Episodes'}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Status Buttons */}
                {!isReadOnly && (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={userMedia.status === 'plan_to_watch' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusChange('plan_to_watch')}
                            disabled={updateStatusMutation.isPending}
                        >
                            <Clock className="h-3 w-3 mr-1" />
                            {formatStatusName('plan_to_watch', userMedia.media.type)}
                        </Button>
                        <Button
                            variant={userMedia.status === 'watching' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusChange('watching')}
                            disabled={updateStatusMutation.isPending}
                        >
                            <Play className="h-3 w-3 mr-1" />
                            {formatStatusName('watching', userMedia.media.type)}
                        </Button>
                        <Button
                            variant={userMedia.status === 'completed' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusChange('completed')}
                            disabled={updateStatusMutation.isPending}
                        >
                            <Check className="h-3 w-3 mr-1" />
                            Completed
                        </Button>
                        <Button
                            variant={userMedia.status === 'dropped' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusChange('dropped')}
                            disabled={updateStatusMutation.isPending}
                        >
                            <X className="h-3 w-3 mr-1" />
                            Dropped
                        </Button>
                    </div>
                )}

                {/* Rating */}
                <div className="space-y-2">
                    <span className="text-sm font-medium">Rating</span>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={isReadOnly ? undefined : () => handleRatingChange(star)}
                                disabled={updateRatingMutation.isPending || isReadOnly}
                                className={cn(
                                    "transition-colors",
                                    star <= (userMedia.rating || 0)
                                        ? "text-yellow-400"
                                        : "text-muted-foreground hover:text-yellow-300"
                                )}
                            >
                                <Star className="h-5 w-5 fill-current" />
                            </button>
                        ))}
                        {userMedia.rating && (
                            <span className="text-sm text-muted-foreground ml-2">
                                ({userMedia.rating}/5)
                            </span>
                        )}
                    </div>
                </div>

                {/* Personal Review */}
                <PersonalReview
                    mediaId={userMedia.media.id}
                    mediaType={userMedia.media.type}
                    rating={userMedia.rating || 0}
                    onRatingChange={handleRatingChange}
                    userId={userId}
                    isReadOnly={isReadOnly}
                />

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Added {formatDate(userMedia.created_at)}</span>
                        </div>
                        {userMedia.updated_at !== userMedia.created_at && (
                            <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Updated {formatDate(userMedia.updated_at)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
