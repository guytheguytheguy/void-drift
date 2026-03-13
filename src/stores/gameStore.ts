import { create } from 'zustand'
import type { Dimension, GamePhase } from '@/types/game'

interface GameState {
  phase: GamePhase
  score: number
  speed: number
  baseSpeed: number
  maxSpeed: number
  speedIncrement: number
  currentDimension: Dimension
  scoreMultiplier: number
  driftBonusActive: boolean
  energyFragments: number
  distanceTraveled: number
  nearMisses: number
  personalBest: number
  playerPosition: [number, number, number]
  gameTime: number
  speedTier: number
  muted: boolean
  invulnerable: boolean

  startGame: () => void
  endGame: () => void
  shiftDimension: (dim: Dimension) => void
  cycleDimension: (direction: 1 | -1) => void
  addScore: (points: number) => void
  addDriftBonus: () => void
  collectEnergy: () => void
  tick: (delta: number) => void
  reset: () => void
  setPlayerPosition: (pos: [number, number, number]) => void
  toggleMute: () => void
  pause: () => void
  resume: () => void
}

const DIMENSIONS: Dimension[] = ['crimson', 'cyan', 'violet']

function getPersonalBest(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem('voiddrift_pb') || '0', 10)
}

function savePersonalBest(score: number) {
  if (typeof window === 'undefined') return
  localStorage.setItem('voiddrift_pb', String(score))
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  score: 0,
  speed: 0,
  baseSpeed: 15,
  maxSpeed: 80,
  speedIncrement: 0.8,
  currentDimension: 'cyan',
  scoreMultiplier: 1,
  driftBonusActive: false,
  energyFragments: 0,
  distanceTraveled: 0,
  nearMisses: 0,
  personalBest: getPersonalBest(),
  playerPosition: [0, 0, 0],
  gameTime: 0,
  speedTier: 1,
  muted: typeof window !== 'undefined' ? localStorage.getItem('voiddrift_muted') === 'true' : false,
  invulnerable: false,

  startGame: () =>
    set({
      phase: 'playing',
      score: 0,
      speed: 15,
      currentDimension: 'cyan',
      scoreMultiplier: 1,
      driftBonusActive: false,
      energyFragments: 0,
      distanceTraveled: 0,
      nearMisses: 0,
      playerPosition: [0, 0, 0],
      gameTime: 0,
      speedTier: 1,
      invulnerable: false,
    }),

  endGame: () => {
    const { score, personalBest } = get()
    const newBest = Math.max(score, personalBest)
    if (newBest > personalBest) {
      savePersonalBest(newBest)
    }
    set({ phase: 'dead', personalBest: newBest, speed: 0 })
  },

  shiftDimension: (dim: Dimension) => {
    if (get().currentDimension === dim) return
    set({ currentDimension: dim, invulnerable: true })
    setTimeout(() => set({ invulnerable: false }), 100)
  },

  cycleDimension: (direction: 1 | -1) => {
    const { currentDimension } = get()
    const idx = DIMENSIONS.indexOf(currentDimension)
    const next = DIMENSIONS[(idx + direction + 3) % 3]
    get().shiftDimension(next)
  },

  addScore: (points: number) =>
    set((s) => ({ score: s.score + Math.round(points * s.scoreMultiplier) })),

  addDriftBonus: () => {
    set((s) => ({
      driftBonusActive: true,
      nearMisses: s.nearMisses + 1,
      score: s.score + Math.round(50 * s.scoreMultiplier),
    }))
    setTimeout(() => set({ driftBonusActive: false }), 500)
  },

  collectEnergy: () =>
    set((s) => ({
      energyFragments: s.energyFragments + 1,
      scoreMultiplier: Math.min(s.scoreMultiplier + 0.1, 5),
      score: s.score + Math.round(25 * s.scoreMultiplier),
    })),

  tick: (delta: number) => {
    const s = get()
    if (s.phase !== 'playing') return

    const newSpeed = Math.min(s.speed + s.speedIncrement * delta, s.maxSpeed)
    const newDistance = s.distanceTraveled + newSpeed * delta
    const newTime = s.gameTime + delta
    const newTier = Math.floor(newTime / 30) + 1
    const scoreGain = newSpeed * delta * 0.5

    set({
      speed: newSpeed,
      distanceTraveled: newDistance,
      gameTime: newTime,
      speedTier: newTier,
      score: s.score + Math.round(scoreGain * s.scoreMultiplier),
    })
  },

  reset: () =>
    set({
      phase: 'menu',
      score: 0,
      speed: 0,
      currentDimension: 'cyan',
      scoreMultiplier: 1,
      driftBonusActive: false,
      energyFragments: 0,
      distanceTraveled: 0,
      nearMisses: 0,
      playerPosition: [0, 0, 0],
      gameTime: 0,
      speedTier: 1,
      invulnerable: false,
    }),

  setPlayerPosition: (pos: [number, number, number]) =>
    set({ playerPosition: pos }),

  toggleMute: () => {
    const muted = !get().muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('voiddrift_muted', String(muted))
    }
    set({ muted })
  },

  pause: () => set({ phase: 'paused' }),
  resume: () => set({ phase: 'playing' }),
}))
