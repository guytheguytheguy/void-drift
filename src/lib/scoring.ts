import { supabase } from './supabase'
import type { LeaderboardEntry } from '@/types/game'

export async function submitScore(data: {
  player_name: string
  score: number
  distance: number
  near_misses: number
}): Promise<boolean> {
  if (!supabase) return false

  const { error } = await supabase.from('leaderboard').insert({
    player_name: data.player_name.slice(0, 20),
    score: data.score,
    distance: data.distance,
    near_misses: data.near_misses,
  })

  return !error
}

export async function fetchTopScores(limit = 50): Promise<LeaderboardEntry[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data as LeaderboardEntry[]
}
