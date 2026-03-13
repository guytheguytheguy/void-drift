export type Dimension = 'crimson' | 'cyan' | 'violet'
export type GamePhase = 'menu' | 'playing' | 'paused' | 'dead'

export const DIMENSION_COLORS: Record<Dimension, string> = {
  crimson: '#ff2244',
  cyan: '#22ddff',
  violet: '#aa44ff',
}

export const DIMENSION_EMISSIVE: Record<Dimension, string> = {
  crimson: '#ff4466',
  cyan: '#44eeff',
  violet: '#bb66ff',
}

export const DIMENSIONS: Dimension[] = ['crimson', 'cyan', 'violet']

export type ObstacleGeometry = 'cube' | 'ring' | 'wall' | 'pillar' | 'gate'

export interface ObstacleData {
  id: string
  dimension: Dimension
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  geometry: ObstacleGeometry
}

export interface EnergyFragment {
  id: string
  position: [number, number, number]
  collected: boolean
}

export interface ChunkData {
  id: number
  zStart: number
  obstacles: ObstacleData[]
  energyFragments: EnergyFragment[]
}

export interface LeaderboardEntry {
  id: string
  player_name: string
  score: number
  distance: number
  near_misses: number
  created_at: string
}
