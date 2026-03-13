import type { Dimension, ObstacleData, EnergyFragment, ChunkData, ObstacleGeometry } from '@/types/game'

const DIMENSIONS: Dimension[] = ['crimson', 'cyan', 'violet']
const GEOMETRIES: ObstacleGeometry[] = ['cube', 'ring', 'wall', 'pillar', 'gate']

// Seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const CHUNK_DEPTH = 200
const LANE_WIDTH = 20 // total x range: -10 to 10
const LANE_HEIGHT = 12 // total y range: -6 to 6

export function generateChunk(chunkId: number, speedTier: number): ChunkData {
  const rng = mulberry32(chunkId * 7919 + 31337)
  const zStart = chunkId * CHUNK_DEPTH

  // Obstacle density increases with chunk distance
  const baseDensity = 3
  const maxDensity = 15
  const density = Math.min(baseDensity + Math.floor(chunkId * 0.3) + (speedTier - 1), maxDensity)

  const obstacles: ObstacleData[] = []
  const energyFragments: EnergyFragment[] = []

  // Generate obstacles spread across the chunk
  for (let i = 0; i < density; i++) {
    const dimension = DIMENSIONS[Math.floor(rng() * 3)]
    const geometry = pickGeometry(rng, speedTier)

    const x = (rng() - 0.5) * LANE_WIDTH
    const y = (rng() - 0.5) * LANE_HEIGHT
    const z = zStart + rng() * CHUNK_DEPTH

    const scale = getScaleForGeometry(geometry, rng, speedTier)
    const rotation: [number, number, number] = [
      rng() * Math.PI * 2,
      rng() * Math.PI * 2,
      rng() * Math.PI * 2,
    ]

    obstacles.push({
      id: `obs_${chunkId}_${i}`,
      dimension,
      position: [x, y, z],
      rotation,
      scale,
      geometry,
    })
  }

  // Energy fragments: 2-5 per chunk, placed in relatively open areas
  const fragmentCount = 2 + Math.floor(rng() * 4)
  for (let i = 0; i < fragmentCount; i++) {
    energyFragments.push({
      id: `energy_${chunkId}_${i}`,
      position: [
        (rng() - 0.5) * LANE_WIDTH * 0.6,
        (rng() - 0.5) * LANE_HEIGHT * 0.4,
        zStart + (i + 1) * (CHUNK_DEPTH / (fragmentCount + 1)),
      ],
      collected: false,
    })
  }

  return { id: chunkId, zStart, obstacles, energyFragments }
}

function pickGeometry(rng: () => number, speedTier: number): ObstacleGeometry {
  const r = rng()
  if (speedTier < 3) {
    // Early game: simpler obstacles
    if (r < 0.35) return 'cube'
    if (r < 0.55) return 'pillar'
    if (r < 0.75) return 'wall'
    if (r < 0.9) return 'ring'
    return 'gate'
  }
  // Later tiers: more variety
  return GEOMETRIES[Math.floor(r * GEOMETRIES.length)]
}

function getScaleForGeometry(
  geometry: ObstacleGeometry,
  rng: () => number,
  speedTier: number,
): [number, number, number] {
  const sizeMult = 1 + speedTier * 0.05
  switch (geometry) {
    case 'cube':
      return [
        (1.5 + rng() * 2) * sizeMult,
        (1.5 + rng() * 2) * sizeMult,
        (1.5 + rng() * 2) * sizeMult,
      ]
    case 'ring':
      return [
        (3 + rng() * 2) * sizeMult,
        (3 + rng() * 2) * sizeMult,
        (0.3 + rng() * 0.3) * sizeMult,
      ]
    case 'wall':
      return [
        (8 + rng() * 6) * sizeMult,
        (6 + rng() * 4) * sizeMult,
        (0.3 + rng() * 0.2),
      ]
    case 'pillar':
      return [
        (0.8 + rng() * 0.8) * sizeMult,
        (8 + rng() * 6) * sizeMult,
        (0.8 + rng() * 0.8) * sizeMult,
      ]
    case 'gate':
      return [
        (5 + rng() * 3) * sizeMult,
        (5 + rng() * 3) * sizeMult,
        (0.4 + rng() * 0.2),
      ]
  }
}

export function getActiveChunks(
  playerZ: number,
  speedTier: number,
  existingChunks: Map<number, ChunkData>,
): Map<number, ChunkData> {
  const currentChunkId = Math.floor(playerZ / CHUNK_DEPTH)
  const renderAhead = 3
  const renderBehind = 1

  const activeChunks = new Map<number, ChunkData>()

  for (let i = currentChunkId - renderBehind; i <= currentChunkId + renderAhead; i++) {
    if (existingChunks.has(i)) {
      activeChunks.set(i, existingChunks.get(i)!)
    } else {
      activeChunks.set(i, generateChunk(i, speedTier))
    }
  }

  return activeChunks
}
