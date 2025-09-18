import { createClient } from '@supabase/supabase-js'

// Your actual Supabase project URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qijavtpkszgpaqeohrwt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sbp_539599b21db43f4644894d6d7d7906f422e00a30'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (we'll generate these from your Supabase schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      players: {
        Row: {
          id: string
          user_id: string
          name: string
          jersey_number: number | null
          team_id: string | null
          position: string | null
          height: number | null
          weight: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          jersey_number?: number | null
          team_id?: string | null
          position?: string | null
          height?: number | null
          weight?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          jersey_number?: number | null
          team_id?: string | null
          position?: string | null
          height?: number | null
          weight?: number | null
          created_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          color_primary: string | null
          color_secondary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color_primary?: string | null
          color_secondary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color_primary?: string | null
          color_secondary?: string | null
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          team_id: string | null
          name: string
          session_type: string
          video_url: string | null
          status: string
          started_at: string
          ended_at: string | null
          duration: number | null
        }
        Insert: {
          id?: string
          user_id: string
          team_id?: string | null
          name: string
          session_type: string
          video_url?: string | null
          status?: string
          started_at?: string
          ended_at?: string | null
          duration?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          team_id?: string | null
          name?: string
          session_type?: string
          video_url?: string | null
          status?: string
          started_at?: string
          ended_at?: string | null
          duration?: number | null
        }
      }
      player_stats: {
        Row: {
          id: string
          player_id: string
          session_id: string
          timestamp: string
          minutes_played: number | null
          distance_covered: number | null
          acceleration_bursts: number | null
          jump_count: number | null
          fatigue_score: number | null
          heart_rate: number | null
          speed_max: number | null
          speed_avg: number | null
        }
        Insert: {
          id?: string
          player_id: string
          session_id: string
          timestamp?: string
          minutes_played?: number | null
          distance_covered?: number | null
          acceleration_bursts?: number | null
          jump_count?: number | null
          fatigue_score?: number | null
          heart_rate?: number | null
          speed_max?: number | null
          speed_avg?: number | null
        }
        Update: {
          id?: string
          player_id?: string
          session_id?: string
          timestamp?: string
          minutes_played?: number | null
          distance_covered?: number | null
          acceleration_bursts?: number | null
          jump_count?: number | null
          fatigue_score?: number | null
          heart_rate?: number | null
          speed_max?: number | null
          speed_avg?: number | null
        }
      }
      penalties: {
        Row: {
          id: string
          session_id: string
          player_id: string
          penalty_type: string
          timestamp: string
          confidence: number
          description: string | null
          video_timestamp: number | null
        }
        Insert: {
          id?: string
          session_id: string
          player_id: string
          penalty_type: string
          timestamp?: string
          confidence: number
          description?: string | null
          video_timestamp?: number | null
        }
        Update: {
          id?: string
          session_id?: string
          player_id?: string
          penalty_type?: string
          timestamp?: string
          confidence?: number
          description?: string | null
          video_timestamp?: number | null
        }
      }
    }
  }
}
