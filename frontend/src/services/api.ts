import { supabase } from '../config/supabase'
import type { Database } from '../config/supabase'

// Base URL for backend API (used for non-Supabase endpoints)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

type Tables = Database['public']['Tables']

// API service for basketball data
export class BasketballAPI {
  // Users
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Players
  static async getPlayers(teamId?: string) {
    let query = supabase
      .from('players')
      .select(`
        *,
        teams:team_id(name, color_primary, color_secondary)
      `)
      .order('name')

    if (teamId) {
      query = query.eq('team_id', teamId)
    }

    const { data, error } = await query
    return { data, error }
  }

  static async createPlayer(player: Tables['players']['Insert']) {
    const { data, error } = await supabase
      .from('players')
      .insert(player)
      .select()
    return { data, error }
  }

  static async updatePlayer(id: string, updates: Tables['players']['Update']) {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  }

  static async deletePlayer(id: string) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)
    return { error }
  }

  // Teams
  static async getTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')
    return { data, error }
  }

  static async createTeam(team: Tables['teams']['Insert']) {
    const { data, error } = await supabase
      .from('teams')
      .insert(team)
      .select()
    return { data, error }
  }

  // Sessions
  static async getSessions(userId?: string) {
    let query = supabase
      .from('sessions')
      .select(`
        *,
        users:user_id(full_name, email),
        teams:team_id(name, color_primary)
      `)
      .order('started_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    return { data, error }
  }

  static async createSession(session: Tables['sessions']['Insert']) {
    const { data, error } = await supabase
      .from('sessions')
      .insert(session)
      .select()
    return { data, error }
  }

  static async updateSession(id: string, updates: Tables['sessions']['Update']) {
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  }

  // Player Stats
  static async getPlayerStats(playerId: string, sessionId?: string) {
    let query = supabase
      .from('player_stats')
      .select('*')
      .eq('player_id', playerId)
      .order('timestamp', { ascending: false })

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data, error } = await query
    return { data, error }
  }

  static async createPlayerStats(stats: Tables['player_stats']['Insert']) {
    const { data, error } = await supabase
      .from('player_stats')
      .insert(stats)
      .select()
    return { data, error }
  }

  // Penalties
  static async getPenalties(sessionId: string) {
    const { data, error } = await supabase
      .from('penalties')
      .select(`
        *,
        players:player_id(name, jersey_number),
        sessions:session_id(name)
      `)
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false })
    return { data, error }
  }

  static async createPenalty(penalty: Tables['penalties']['Insert']) {
    const { data, error } = await supabase
      .from('penalties')
      .insert(penalty)
      .select()
    return { data, error }
  }

  // Video Upload
  static async uploadVideo(file: File, sessionId: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${sessionId}.${fileExt}`
    const filePath = `videos/${fileName}`

    const { error } = await supabase.storage
      .from('basketball-videos')
      .upload(filePath, file)

    if (error) {
      return { data: null, error }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('basketball-videos')
      .getPublicUrl(filePath)

    return { data: urlData, error: null }
  }

  // Real-time subscriptions
  static subscribeToPlayerStats(playerId: string, callback: (payload: any) => void) {
    return supabase
      .channel('player_stats')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'player_stats',
          filter: `player_id=eq.${playerId}`
        }, 
        callback
      )
      .subscribe()
  }

  static subscribeToPenalties(sessionId: string, callback: (payload: any) => void) {
    return supabase
      .channel('penalties')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'penalties',
          filter: `session_id=eq.${sessionId}`
        }, 
        callback
      )
      .subscribe()
  }
}
