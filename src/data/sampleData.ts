export const sampleMedia = [
  {
    id: 'movie-1',
    type: 'movie',
    api_id: 'tt0848228',
    title: 'The Avengers',
    description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the trickster Loki and his alien army from enslaving humanity.',
    poster_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    release_date: '2012-05-04',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'movie-2',
    type: 'movie',
    api_id: 'tt1375666',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_url: 'https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    release_date: '2010-07-16',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'tv-1',
    type: 'tv',
    api_id: 'tt0944947',
    title: 'Game of Thrones',
    description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    poster_url: 'https://images.pexels.com/photos/7991581/pexels-photo-7991581.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    release_date: '2011-04-17',
    genres: ['Drama', 'Fantasy', 'Action'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'tv-2',
    type: 'tv',
    api_id: 'tt0903747',
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    poster_url: 'https://images.pexels.com/photos/7991582/pexels-photo-7991582.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    release_date: '2008-01-20',
    genres: ['Crime', 'Drama', 'Thriller'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'book-1',
    type: 'book',
    api_id: 'book-1',
    title: 'The Lord of the Rings',
    description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    poster_url: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    release_date: '1954-07-29',
    genres: ['Fantasy', 'Adventure'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'book-2',
    type: 'book',
    api_id: 'book-2',
    title: 'Dune',
    description: 'Set in the distant future amidst a feudal interstellar society in which various noble houses control planetary fiefs.',
    poster_url: 'https://images.pexels.com/photos/1029142/pexels-photo-1029142.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    release_date: '1965-08-01',
    genres: ['Science Fiction', 'Adventure'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'game-1',
    type: 'game',
    api_id: 'game-1',
    title: 'The Witcher 3: Wild Hunt',
    description: 'As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.',
    poster_url: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    release_date: '2015-05-19',
    genres: ['RPG', 'Adventure', 'Open World'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'game-2',
    type: 'game',
    api_id: 'game-2',
    title: 'Red Dead Redemption 2',
    description: 'America, 1899. The end of the Wild West era has begun as lawmen hunt down the last remaining outlaw gangs.',
    poster_url: 'https://images.pexels.com/photos/442577/pexels-photo-442577.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    release_date: '2018-10-26',
    genres: ['Action', 'Adventure', 'Open World'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const sampleUserMedia = [
  {
    id: 'user-media-1',
    user_id: 'demo-user',
    media_id: 'movie-1',
    status: 'completed',
    progress: 100,
    rating: 5,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user-media-2',
    user_id: 'demo-user',
    media_id: 'tv-1',
    status: 'watching',
    progress: 60,
    rating: 4,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 'user-media-3',
    user_id: 'demo-user',
    media_id: 'book-1',
    status: 'plan_to_watch',
    progress: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-media-4',
    user_id: 'demo-user',
    media_id: 'game-1',
    status: 'completed',
    progress: 100,
    rating: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z'
  }
]