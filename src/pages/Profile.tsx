import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserProfile, useUserPublicMedia, useUserPublicStats, useUserFollowers, useUserFollowing, useFollowUser, useUnfollowUser, useIsFollowing } from '@/hooks/useMedia'
import { ProgressTracker } from '@/components/ProgressTracker'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
    User,
    Calendar,
    Star,
    Film,
    Tv,
    Book,
    Gamepad2,
    BarChart3,
    Check,
    Play,
    Clock,
    X,
    Users,
    Heart,
    Flame,
    UserPlus,
    UserMinus
} from 'lucide-react'
import { formatMediaType, formatStatusName } from '@/lib/utils'

interface ProfileProps {
    userId?: string // If provided, show that user's profile, otherwise show current user's
    onUserClick?: (userId: string) => void // Callback for when a user is clicked
}

export function Profile({ userId, onUserClick }: ProfileProps) {
    const { userProfile: currentUser, user } = useAuth()
    const profileUserId = userId || user?.id || ''

    const { data: profile, isLoading: isLoadingProfile } = useUserProfile(profileUserId)
    const { data: userMedia, isLoading: isLoadingMedia } = useUserPublicMedia(profileUserId)
    const { data: userStats, isLoading: isLoadingStats } = useUserPublicStats(profileUserId)
    const { data: followers } = useUserFollowers(profileUserId)
    const { data: following } = useUserFollowing(profileUserId)

    // Follow functionality
    const followUserMutation = useFollowUser()
    const unfollowUserMutation = useUnfollowUser()
    const { data: isFollowing } = useIsFollowing(user?.id || '', profileUserId)

    const [selectedTab, setSelectedTab] = useState<'overview' | 'media' | 'stats' | 'followers' | 'following'>('overview')
    const [selectedStatus, setSelectedStatus] = useState('all')

    const isOwnProfile = !userId || userId === user?.id
    const isPrivateProfile = !isOwnProfile && profile?.is_private

    const handleFollowToggle = async () => {
        if (!user?.id || !profileUserId) return

        try {
            if (isFollowing) {
                await unfollowUserMutation.mutateAsync({
                    followerId: user.id,
                    followingId: profileUserId
                })
            } else {
                await followUserMutation.mutateAsync({
                    followerId: user.id,
                    followingId: profileUserId
                })
            }
        } catch (error) {
            console.error('Failed to toggle follow:', error)
        }
    }

    const filteredMedia = userMedia?.filter(item => {
        if (selectedStatus === 'all') return true
        return item.status === selectedStatus
    }) || []

    const statusOptions = [
        { id: 'all', label: 'All Media', count: userStats?.total || 0 },
        { id: 'completed', label: 'Completed', count: userStats?.completed || 0 },
        { id: 'watching', label: 'Currently Consuming', count: userStats?.watching || 0 },
        { id: 'plan_to_watch', label: 'Plan to Consume', count: userStats?.planned || 0 },
    ]

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'media', label: 'Media', icon: Film },
        { id: 'stats', label: 'Statistics', icon: BarChart3 },
        { id: 'followers', label: 'Followers', icon: UserPlus },
        { id: 'following', label: 'Following', icon: UserMinus },
    ]

    if (isLoadingProfile || isLoadingStats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="p-6 space-y-8">
                    <div className="animate-pulse">
                        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Show privacy message for private profiles
    if (isPrivateProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="p-6 space-y-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
                        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
                            <div className="flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl flex items-center justify-center">
                                    <User className="h-12 w-12 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                                        {profile?.username || 'User'}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        This profile is private
                                    </p>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 max-w-md">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        This user has set their profile to private. Only they can see their media, statistics, and activity.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="p-6 space-y-8">
                {/* Profile Header */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Profile Picture */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <User className="h-12 w-12 text-white" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                                            {profile?.username || 'Anonymous User'}
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                                            {profile?.bio || 'No Bio Available'}
                                        </p>
                                        <div className="flex items-center gap-6 mt-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {userStats?.total || 0}
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">Media</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {followers?.length || 0}
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">Followers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {following?.length || 0}
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">Following</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        {!isOwnProfile && (
                                            <Button 
                                                onClick={handleFollowToggle}
                                                disabled={followUserMutation.isPending || unfollowUserMutation.isPending}
                                                className={`${isFollowing 
                                                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                                } text-white border-0`}
                                            >
                                                <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                                                {followUserMutation.isPending || unfollowUserMutation.isPending 
                                                    ? 'Loading...' 
                                                    : isFollowing 
                                                        ? 'Unfollow' 
                                                        : 'Follow'
                                                }
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Items</CardTitle>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{userStats?.total || 0}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {userStats?.averageRating ? `Avg rating: ${userStats.averageRating.toFixed(1)}/5` : 'No ratings yet'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Completed</CardTitle>
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Check className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{userStats?.completed || 0}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {userStats?.total ? `${Math.round((userStats.completed / userStats.total) * 100)}% completion rate` : '0% completion rate'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Currently Consuming</CardTitle>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Play className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{userStats?.watching || 0}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Active items
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Plan to Consume</CardTitle>
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Clock className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{userStats?.planned || 0}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                In queue
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Current Streak</CardTitle>
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Flame className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{userStats?.streak || 0}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {userStats?.streak ? 'Days Active' : 'No Streak Yet'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                    <div className="flex flex-wrap gap-3 mb-6">
                        {tabs.map((tab) => (
                            <Button
                                key={tab.id}
                                variant={selectedTab === tab.id ? 'default' : 'outline'}
                                onClick={() => setSelectedTab(tab.id as any)}
                                className={`h-12 px-6 ${selectedTab === tab.id
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                                    : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4 mr-2" />
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {selectedTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Media Type Distribution */}
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">Media Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Film className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm text-slate-600 dark:text-slate-300">Movies</span>
                                            </div>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{userStats?.movies || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Tv className="h-4 w-4 text-purple-500" />
                                                <span className="text-sm text-slate-600 dark:text-slate-300">TV Shows</span>
                                            </div>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{userStats?.tv || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Book className="h-4 w-4 text-green-500" />
                                                <span className="text-sm text-slate-600 dark:text-slate-300">Books</span>
                                            </div>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{userStats?.books || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Gamepad2 className="h-4 w-4 text-orange-500" />
                                                <span className="text-sm text-slate-600 dark:text-slate-300">Games</span>
                                            </div>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{userStats?.games || 0}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Recent Activity */}
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {userMedia && userMedia.length > 0 ? (
                                            <div className="space-y-3">
                                                {userMedia.slice(0, 5).map((item) => (
                                                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
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
                                                                {formatStatusName(item.status, item.media?.type)}
                                                            </p>
                                                        </div>
                                                        {item.rating && (
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                                <span className="text-xs text-slate-600 dark:text-slate-300">{item.rating}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">No recent activity</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'media' && (
                        <div className="space-y-6">
                            {/* Status Filter */}
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((status) => (
                                    <Button
                                        key={status.id}
                                        variant={selectedStatus === status.id ? 'default' : 'outline'}
                                        onClick={() => setSelectedStatus(status.id)}
                                        className={`h-10 px-4 ${selectedStatus === status.id
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                                            : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                            }`}
                                    >
                                        {status.label}
                                        <span className="ml-2 px-2 py-1 bg-white/20 dark:bg-black/20 rounded-full text-xs">
                                            {status.count}
                                        </span>
                                    </Button>
                                ))}
                            </div>

                            {/* Media List */}
                            {isLoadingMedia ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredMedia.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredMedia.map((item) => (
                                        <ProgressTracker
                                            key={item.id}
                                            userMedia={item}
                                            userId={profileUserId}
                                            isReadOnly={!isOwnProfile}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Film className="h-12 w-12 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No media found</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {selectedStatus === 'all' ? 'This user hasn\'t added any media yet' : `No ${statusOptions.find(s => s.id === selectedStatus)?.label.toLowerCase()} items`}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedTab === 'stats' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Rating Distribution */}
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">Rating Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {userStats?.averageRating ? (
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                                                    {userStats.averageRating.toFixed(1)}
                                                </div>
                                                <div className="flex items-center justify-center gap-1 mb-4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-5 w-5 ${i < Math.floor(userStats.averageRating)
                                                                ? 'text-yellow-500 fill-current'
                                                                : 'text-slate-300 dark:text-slate-600'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Average rating across all rated items
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 dark:text-slate-400 text-center">No ratings yet</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Completion Rate */}
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">Completion Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                                                {userStats?.total ? Math.round((userStats.completed / userStats.total) * 100) : 0}%
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${userStats?.total ? (userStats.completed / userStats.total) * 100 : 0}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {userStats?.completed || 0} of {userStats?.total || 0} items completed
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'followers' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {followers && followers.length > 0 ? (
                                    followers.map((follow) => (
                                        <Card key={follow.id} className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm cursor-pointer" onClick={() => onUserClick?.(follow.follower?.id)}>
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                                        <User className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                            {follow.follower?.username}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                                            {follow.follower?.bio || 'No Bio Available'}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            Followed {new Date(follow.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UserPlus className="h-12 w-12 text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No followers yet</h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Share your profile to get followers
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedTab === 'following' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {following && following.length > 0 ? (
                                    following.map((follow) => (
                                        <Card key={follow.id} className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm cursor-pointer" onClick={() => onUserClick?.(follow.following?.id)}>
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                                        <User className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                            {follow.following?.username}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                                            {follow.following?.bio || 'No Bio Available'}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            Following Since {new Date(follow.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UserMinus className="h-12 w-12 text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Not following anyone</h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Discover users to follow and see their activity
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
