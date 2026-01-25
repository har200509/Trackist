import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/Toast'

interface PersonalReviewProps {
    mediaId: string
    mediaType: string
    rating: number
    onRatingChange: (rating: number) => void
    userId?: string // Optional userId - if not provided, uses current user
    isReadOnly?: boolean // If true, shows review in read-only mode
}

export function PersonalReview({ mediaId, mediaType, rating, onRatingChange, userId, isReadOnly = false }: PersonalReviewProps) {
    const { userProfile } = useAuth()
    const [reviewContent, setReviewContent] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Use provided userId or fall back to current user
    const targetUserId = userId || userProfile?.id

    // Load user's review on mount
    useEffect(() => {
        if (targetUserId) {
            loadUserReview()
        }
    }, [mediaId, targetUserId])

    const loadUserReview = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('content')
                .eq('media_id', mediaId)
                .eq('user_id', targetUserId)
                .single()

            if (data && !error) {
                setReviewContent(data.content || '')
            }
        } catch (err) {
            // No existing review found - this is normal
        }
    }

    const handleSaveReview = async () => {
        if (!userProfile?.id || isReadOnly) return

        try {
            setIsLoading(true)

            const reviewData = {
                user_id: userProfile.id,
                media_id: mediaId,
                rating: rating,
                content: reviewContent.trim() || null,
                is_flagged: false,
            }

            // Try to update existing review first
            const { error: updateError } = await supabase
                .from('reviews')
                .upsert(reviewData, {
                    onConflict: 'user_id,media_id',
                    ignoreDuplicates: false
                })

            if (updateError) {
                console.error('Error saving review:', updateError)
                toast.error('Failed to Save Review', 'Could not save your review. Please try again.')
            } else {
                toast.success('Review Saved', 'Your review has been saved successfully!')
            }

            setIsEditing(false)
        } catch (err) {
            console.error('Error in handleSaveReview:', err)
            toast.error('Failed to Save Review', 'An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Show for all media types
    return (
        <div className="mt-4 space-y-3">
            {/* Review Content */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {isReadOnly ? 'Review:' : 'Your Review:'}
                    </span>
                    {!isReadOnly && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-xs"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                    )}
                </div>

                {isEditing && !isReadOnly ? (
                    <div className="space-y-2">
                        <textarea
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder={`Share your thoughts about this ${mediaType === 'tv' ? 'TV show' : mediaType === 'movie' ? 'movie' : mediaType === 'book' ? 'book' : 'game'}...`}
                            className="w-full p-2 border border-input rounded-md bg-background text-sm resize-none"
                            rows={2}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsEditing(false)
                                    loadUserReview() // Reset to original content
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSaveReview}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-[2rem] p-2 bg-muted rounded-md">
                        {reviewContent ? (
                            <p className="text-sm">{reviewContent}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Click "Edit" To Add Your Review
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
