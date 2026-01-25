import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserMedia, useUserMediaByStatus, useUserStats } from '@/hooks/useMedia'
import { ProgressTracker } from '@/components/ProgressTracker'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
    Search,
    Filter,
    Grid,
    List,
    TrendingUp,
    Clock,
    Play,
    Check,
    X,
    Star,
    BarChart3
} from 'lucide-react'
import { cn, formatStatusName, formatMediaType } from '@/lib/utils'

export function UserLists() {
    const { userProfile } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [selectedType, setSelectedType] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [sortBy, setSortBy] = useState<'recent' | 'title' | 'rating' | 'progress'>('title')
    const [showFilters, setShowFilters] = useState(false)

    const { data: allUserMedia, isLoading: isLoadingAll } = useUserMedia(userProfile?.id || '')
    const { data: statusFilteredMedia, isLoading: isLoadingStatus } = useUserMediaByStatus(
        userProfile?.id || '',
        selectedStatus !== 'all' ? selectedStatus : ''
    )
    const { data: userStats, isLoading: isLoadingStats } = useUserStats(userProfile?.id || '')

    const mediaData = selectedStatus === 'all' ? allUserMedia : statusFilteredMedia
    const isLoading = selectedStatus === 'all' ? isLoadingAll : isLoadingStatus

    // Filter and sort media
    const filteredMedia = mediaData?.filter(item => {
        const matchesSearch = item.media.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = selectedType === 'all' || item.media.type === selectedType
        return matchesSearch && matchesType
    }).sort((a, b) => {
        switch (sortBy) {
            case 'recent':
                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            case 'rating':
                return (b.rating || 0) - (a.rating || 0)
            case 'progress':
                return b.progress - a.progress
            case 'title':
            default:
                return a.media.title.localeCompare(b.media.title)
        }
    }) || []

    const statusOptions = [
        { id: 'all', label: 'All Items', count: userStats?.total || 0 },
        { id: 'plan_to_watch', label: 'Plan to Consume', count: userStats?.planned || 0 },
        { id: 'watching', label: 'Currently Consuming', count: userStats?.watching || 0 },
        { id: 'completed', label: 'Completed', count: userStats?.completed || 0 },
        { id: 'dropped', label: 'Dropped', count: userStats?.dropped || 0 },
    ]

    const typeOptions = [
        { id: 'all', label: 'All Types' },
        { id: 'movie', label: 'Movies' },
        { id: 'tv', label: 'TV Shows' },
        { id: 'book', label: 'Books' },
        { id: 'game', label: 'Games' },
    ]

    const sortOptions = [
        { id: 'title', label: 'Title A-Z' },
        { id: 'recent', label: 'Recently Updated' },
        { id: 'rating', label: 'Rating' },
        { id: 'progress', label: 'Progress' },
    ]

    if (isLoadingStats) {
        return (
            <div className="p-6 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-muted rounded"></div>
                        ))}
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
                                    My Media
                                </h1>
                                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                                    Manage your tracked media and progress
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className={`h-10 px-4 ${viewMode === 'grid'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                                        : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                        }`}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className={`h-10 px-4 ${viewMode === 'list'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                                        : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                        }`}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                </div>

                {/* Filters and Controls */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    placeholder="Search Your Media..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Filter Toggle Button */}
                            <Button
                                variant={showFilters ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`h-10 px-4 ${showFilters
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                                    : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                    }`}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>

                            {/* View Mode Toggle */}
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {showFilters && (
                            <div className="flex flex-col md:flex-row gap-4 mt-4">
                                {/* Status Filter */}
                                <div className="flex items-center space-x-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-wrap gap-1">
                                        {statusOptions.map((option) => (
                                            <Button
                                                key={option.id}
                                                variant={selectedStatus === option.id ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedStatus(option.id)}
                                            >
                                                {option.label}
                                                {option.count > 0 && (
                                                    <Badge variant="secondary" className="ml-1 text-xs">
                                                        {option.count}
                                                    </Badge>
                                                )}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Type Filter */}
                                <div className="flex items-center space-x-2">
                                    <div className="flex flex-wrap gap-1">
                                        {typeOptions.map((option) => (
                                            <Button
                                                key={option.id}
                                                variant={selectedType === option.id ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedType(option.id)}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort */}
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                </Card>

                {/* Results */}
                <div>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-32 bg-muted rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                                <p className="text-muted-foreground text-center">
                                    {searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
                                        ? 'Try adjusting your filters or search terms'
                                        : 'Start by adding some movies, shows, books, or games to your list'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className={cn(
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                                : 'space-y-4'
                        )}>
                            {filteredMedia.map((item) => (
                                <ProgressTracker
                                    key={item.id}
                                    userMedia={item}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
