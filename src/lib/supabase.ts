import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url?: string
          bio?: string
          is_private: boolean
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          avatar_url?: string
          bio?: string
          is_private?: boolean
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string
          bio?: string
          is_private?: boolean
          role?: 'user' | 'admin'
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          type: 'movie' | 'tv' | 'book' | 'game'
          api_id: string
          title: string
          description?: string
          poster_url?: string
          release_date?: string
          genres: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'movie' | 'tv' | 'book' | 'game'
          api_id: string
          title: string
          description?: string
          poster_url?: string
          release_date?: string
          genres?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: 'movie' | 'tv' | 'book' | 'game'
          api_id?: string
          title?: string
          description?: string
          poster_url?: string
          release_date?: string
          genres?: string[]
          updated_at?: string
        }
      }
      user_media: {
        Row: {
          id: string
          user_id: string
          media_id: string
          status: 'plan_to_watch' | 'watching' | 'completed' | 'dropped'
          progress: number
          watched_episodes?: number
          total_episodes?: number
          rating?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          media_id: string
          status: 'plan_to_watch' | 'watching' | 'completed' | 'dropped'
          progress?: number
          watched_episodes?: number
          total_episodes?: number
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'plan_to_watch' | 'watching' | 'completed' | 'dropped'
          progress?: number
          watched_episodes?: number
          total_episodes?: number
          rating?: number
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          media_id: string
          rating: number
          content?: string
          is_flagged: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          media_id: string
          rating: number
          content?: string
          is_flagged?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          rating?: number
          content?: string
          is_flagged?: boolean
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          created_at?: string
        }
      }
      playlists: {
        Row: {
          id: string
          user_id: string
          name: string
          description?: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string
          is_public?: boolean
          updated_at?: string
        }
      }
      playlist_items: {
        Row: {
          id: string
          playlist_id: string
          media_id: string
          created_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          media_id: string
          created_at?: string
        }
        Update: {
          playlist_id?: string
          media_id?: string
        }
      }
    }
  }
}