import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { MediaCard } from '@/components/MediaCard'
import { useMediaSearch, useAddToList } from '@/hooks/useMedia'
import { useAuth } from '@/contexts/AuthContext'
import { Search as SearchIcon, Filter } from 'lucide-react'
import { formatMediaType } from '@/lib/utils'

export function Search() {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const { userProfile } = useAuth()

  const { data: searchResults, isLoading } = useMediaSearch(query, selectedType)
  const addToListMutation = useAddToList()

  const handleAddToList = (media: any) => {
    if (userProfile?.id) {
      addToListMutation.mutate({
        userId: userProfile.id,
        mediaItem: media,
        status: 'plan_to_watch'
      })
    }
  }

  const mediaTypes = [
    { id: 'all', label: 'All Media' },
    { id: 'movie', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'book', label: 'Books' },
    { id: 'game', label: 'Games' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Search Media
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                Discover movies, TV shows, books, and games to add to your media collection
              </p>
            </div>
          </div>
        </div>

        {/* Search Controls */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search for movies, shows, books, games..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 px-4 ${showFilters
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="flex items-center space-x-2 mt-4">
              <Filter className="h-5 w-5 text-slate-400" />
              <div className="flex flex-wrap gap-2">
                {mediaTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type.id)}
                    className={`h-10 px-4 ${selectedType === type.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
                      : 'border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {isLoading && query.length > 2 && (
            <div className="flex items-center justify-center h-32">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {query.length <= 2 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Start searching</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Type at least 3 characters to search for media
              </p>
            </div>
          )}

          {searchResults && searchResults.length === 0 && query.length > 2 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No results found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}

          {searchResults && searchResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  Search Results ({searchResults.length})
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.map((media) => (
                  <div key={media.id} className="group hover:scale-105 transition-transform duration-300">
                    <MediaCard
                      media={media}
                      onAddToList={handleAddToList}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}