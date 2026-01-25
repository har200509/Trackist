import { useState } from 'react'
import { MediaCard } from '@/components/MediaCard'
import { Button } from '@/components/ui/Button'
import { useTrendingMedia, useTrendingMovies, useTrendingTVShows, useTrendingBooks, useTrendingGames, useAddToList } from '@/hooks/useMedia'
import { useAuth } from '@/contexts/AuthContext'
import {
    TrendingUp,
    Film,
    Tv,
    Book,
    Gamepad2,
    Sparkles,
    Calendar
} from 'lucide-react'
import { formatMediaType } from '@/lib/utils'

export function Trending() {
    const [selectedType, setSelectedType] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const { userProfile } = useAuth()
    const addToListMutation = useAddToList()

    // Fetch trending data based on selected type
    const { data: allTrending, isLoading: isLoadingAll } = useTrendingMedia()
    const { data: trendingMovies, isLoading: isLoadingMovies } = useTrendingMovies()
    const { data: trendingTVShows, isLoading: isLoadingTVShows } = useTrendingTVShows()
    const { data: trendingBooks, isLoading: isLoadingBooks } = useTrendingBooks()
    const { data: trendingGames, isLoading: isLoadingGames } = useTrendingGames()

    const handleAddToList = (media: any) => {
        if (userProfile?.id) {
            addToListMutation.mutate({
                userId: userProfile.id,
                mediaItem: media,
                status: 'plan_to_watch'
            })
        }
    }

    const getTrendingData = () => {
        switch (selectedType) {
            case 'movie':
                return { data: trendingMovies, isLoading: isLoadingMovies }
            case 'tv':
                return { data: trendingTVShows, isLoading: isLoadingTVShows }
            case 'book':
                return { data: trendingBooks, isLoading: isLoadingBooks }
            case 'game':
                return { data: trendingGames, isLoading: isLoadingGames }
            default:
                return { data: allTrending, isLoading: isLoadingAll }
        }
    }

    const { data: trendingData, isLoading } = getTrendingData()

    const mediaTypes = [
        { id: 'all', label: 'All Trending', icon: TrendingUp, count: allTrending?.length || 0 },
        { id: 'movie', label: 'Movies', icon: Film, count: trendingMovies?.length || 0 },
        { id: 'tv', label: 'TV Shows', icon: Tv, count: trendingTVShows?.length || 0 },
        { id: 'book', label: 'Books', icon: Book, count: trendingBooks?.length || 0 },
        { id: 'game', label: 'Games', icon: Gamepad2, count: trendingGames?.length || 0 },
    ]

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
                                    Trending Now
                                </h1>
                                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                                    Discover what's popular across movies, TV shows, books, and games
                                </p>
                            </div>
                            <div className="hidden md:flex items-center space-x-4">
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {allTrending?.length || 0}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">Trending Items</div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media Type Filter */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Filter by Media Type</h3>
                        <Button
                            variant={showFilters ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`h-10 px-4 ${showFilters
                                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0'
                                : 'border-slate-200 dark:border-slate-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                }`}
                        >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {mediaTypes.map((type) => (
                                <Button
                                    key={type.id}
                                    variant={selectedType === type.id ? 'default' : 'outline'}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`h-12 px-6 ${selectedType === type.id
                                        ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0'
                                        : 'border-slate-200 dark:border-slate-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                        }`}
                                >
                                    <type.icon className="h-4 w-4 mr-2" />
                                    {type.label}
                                    <span className="ml-2 px-2 py-1 bg-white/20 dark:bg-black/20 rounded-full text-xs">
                                        {type.count}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trending Content */}
                <div>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50">
                                        <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-t-2xl"></div>
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : trendingData && trendingData.length > 0 ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    {selectedType === 'all' ? 'All Trending' : `Trending ${formatMediaType(selectedType)}`} ({trendingData.length})
                                </h2>
                                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>Updated weekly</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {trendingData.map((media) => (
                                    <div key={media.id} className="group hover:scale-105 transition-transform duration-300">
                                        <MediaCard
                                            media={media}
                                            api_id={media.api_id}
                                            onAddToList={() => handleAddToList(media)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-12 w-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No trending content</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Unable to load trending content. Please check your API keys.
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                How Trending Works
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Trending content is updated weekly based on popularity metrics from TMDB (movies & TV),
                                Google Books (bestsellers), and RAWG (highly-rated games). The data reflects current
                                cultural buzz and audience engagement across all media types.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
