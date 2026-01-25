// External API services for TMDB, Google Books, and RAWG APIs

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1'
const RAWG_BASE_URL = 'https://api.rawg.io/api'

// Common interface for all media items
export interface MediaItem {
  id: string
  api_id: string
  type: 'movie' | 'tv' | 'book' | 'game'
  title: string
  description?: string
  poster_url?: string
  release_date?: string
  genres: string[]
}

// TMDB Movie Search
export async function searchMovies(query: string): Promise<MediaItem[]> {
  if (!TMDB_API_KEY) {
    return []
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
    )

    if (!response.ok) throw new Error('TMDB API error')

    const data = await response.json()

    return data.results.map((movie: any): MediaItem => ({
      id: `tmdb-movie-${movie.id}`,
      api_id: movie.id.toString(),
      type: 'movie',
      title: movie.title,
      description: movie.overview,
      poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
      release_date: movie.release_date,
      genres: movie.genre_ids?.map((id: number) => getMovieGenreName(id)) || []
    }))
  } catch (error) {
    return []
  }
}

// TMDB TV Show Search
export async function searchTVShows(query: string): Promise<MediaItem[]> {
  if (!TMDB_API_KEY) {
    return []
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
    )

    if (!response.ok) throw new Error('TMDB API error')

    const data = await response.json()

    return data.results.map((show: any): MediaItem => ({
      id: `tmdb-tv-${show.id}`,
      api_id: show.id.toString(),
      type: 'tv',
      title: show.name,
      description: show.overview,
      poster_url: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined,
      release_date: show.first_air_date,
      genres: show.genre_ids?.map((id: number) => getTVGenreName(id)) || []
    }))
  } catch (error) {
    return []
  }
}

// Google Books Search
export async function searchBooks(query: string): Promise<MediaItem[]> {
  if (!GOOGLE_BOOKS_API_KEY) {
    return []
  }

  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_BASE_URL}/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=20`
    )

    if (!response.ok) throw new Error('Google Books API error')

    const data = await response.json()

    return (data.items || []).map((book: any): MediaItem => ({
      id: `books-${book.id}`,
      api_id: book.id,
      type: 'book',
      title: book.volumeInfo.title,
      description: book.volumeInfo.description,
      poster_url: book.volumeInfo.imageLinks?.thumbnail,
      release_date: book.volumeInfo.publishedDate,
      genres: book.volumeInfo.categories || []
    }))
  } catch (error) {
    return []
  }
}

// RAWG Games Search
export async function searchGames(query: string): Promise<MediaItem[]> {
  if (!RAWG_API_KEY) {
    return []
  }

  try {
    const response = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=20`
    )

    if (!response.ok) throw new Error('RAWG API error')

    const data = await response.json()

    return data.results.map((game: any): MediaItem => ({
      id: `rawg-${game.id}`,
      api_id: game.id.toString(),
      type: 'game',
      title: game.name,
      description: game.description_raw,
      poster_url: game.background_image,
      release_date: game.released,
      genres: game.genres?.map((genre: any) => genre.name) || []
    }))
  } catch (error) {
    return []
  }
}

// TMDB TV Show Details - Get total episodes
export async function getTVShowDetails(apiId: string): Promise<{ totalEpisodes: number; totalSeasons: number } | null> {
  if (!TMDB_API_KEY) {
    return null
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${apiId}?api_key=${TMDB_API_KEY}`
    )

    if (!response.ok) throw new Error('TMDB API error')

    const data = await response.json()

    return {
      totalEpisodes: data.number_of_episodes || 0,
      totalSeasons: data.number_of_seasons || 0
    }
  } catch (error) {
    // Error fetching TV show details - return null
    return null
  }
}

// TMDB Trending Movies
export async function getTrendingMovies(): Promise<MediaItem[]> {
  if (!TMDB_API_KEY) {
    return []
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
    )

    if (!response.ok) throw new Error('TMDB API error')

    const data = await response.json()

    return data.results.map((movie: any): MediaItem => ({
      id: `tmdb-movie-${movie.id}`,
      api_id: movie.id.toString(),
      type: 'movie',
      title: movie.title,
      description: movie.overview,
      poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
      release_date: movie.release_date,
      genres: movie.genre_ids?.map((id: number) => getMovieGenreName(id)) || []
    }))
  } catch (error) {
    return []
  }
}

// TMDB Trending TV Shows
export async function getTrendingTVShows(): Promise<MediaItem[]> {
  if (!TMDB_API_KEY) {
    return []
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`
    )

    if (!response.ok) throw new Error('TMDB API error')

    const data = await response.json()

    return data.results.map((show: any): MediaItem => ({
      id: `tmdb-tv-${show.id}`,
      api_id: show.id.toString(),
      type: 'tv',
      title: show.name,
      description: show.overview,
      poster_url: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined,
      release_date: show.first_air_date,
      genres: show.genre_ids?.map((id: number) => getTVGenreName(id)) || []
    }))
  } catch (error) {
    return []
  }
}

// RAWG Trending Games
export async function getTrendingGames(): Promise<MediaItem[]> {
  if (!RAWG_API_KEY) {
    return []
  }

  try {
    const response = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=20`
    )

    if (!response.ok) throw new Error('RAWG API error')

    const data = await response.json()

    return data.results.map((game: any): MediaItem => ({
      id: `rawg-${game.id}`,
      api_id: game.id.toString(),
      type: 'game',
      title: game.name,
      description: game.description_raw,
      poster_url: game.background_image,
      release_date: game.released,
      genres: game.genres?.map((genre: any) => genre.name) || []
    }))
  } catch (error) {
    return []
  }
}

// Google Books Popular Books (using bestsellers)
export async function getTrendingBooks(): Promise<MediaItem[]> {
  if (!GOOGLE_BOOKS_API_KEY) {
    return []
  }

  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_BASE_URL}/volumes?q=bestseller&key=${GOOGLE_BOOKS_API_KEY}&maxResults=20&orderBy=relevance`
    )

    if (!response.ok) throw new Error('Google Books API error')

    const data = await response.json()

    return (data.items || []).map((book: any): MediaItem => ({
      id: `books-${book.id}`,
      api_id: book.id,
      type: 'book',
      title: book.volumeInfo.title,
      description: book.volumeInfo.description,
      poster_url: book.volumeInfo.imageLinks?.thumbnail,
      release_date: book.volumeInfo.publishedDate,
      genres: book.volumeInfo.categories || []
    }))
  } catch (error) {
    return []
  }
}

// Combined trending function
export async function getAllTrendingMedia(): Promise<MediaItem[]> {
  const promises: Promise<MediaItem[]>[] = [
    getTrendingMovies(),
    getTrendingTVShows(),
    getTrendingBooks(),
    getTrendingGames()
  ]

  const results = await Promise.all(promises)
  return results.flat().slice(0, 40) // Limit total results
}

// Combined search function
export async function searchAllMedia(query: string, type?: string): Promise<MediaItem[]> {
  const promises: Promise<MediaItem[]>[] = []

  if (!type || type === 'all' || type === 'movie') {
    promises.push(searchMovies(query))
  }

  if (!type || type === 'all' || type === 'tv') {
    promises.push(searchTVShows(query))
  }

  if (!type || type === 'all' || type === 'book') {
    promises.push(searchBooks(query))
  }

  if (!type || type === 'all' || type === 'game') {
    promises.push(searchGames(query))
  }

  const results = await Promise.all(promises)
  return results.flat().slice(0, 40) // Limit total results
}

// Helper functions for TMDB genre mapping
function getMovieGenreName(id: number): string {
  const genres: Record<number, string> = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
  }
  return genres[id] || 'Unknown'
}

function getTVGenreName(id: number): string {
  const genres: Record<number, string> = {
    10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 10762: 'Kids',
    9648: 'Mystery', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy',
    10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics', 37: 'Western'
  }
  return genres[id] || 'Unknown'
}