'use client'

import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'
import { DIMENSION_COLORS, type Dimension, type ObstacleData, type EnergyFragment, type ChunkData } from '@/types/game'
import { getActiveChunks } from '@/lib/procedural'

const COLLISION_RADIUS_PLAYER = 0.4
const NEAR_MISS_MULT = 2.5
const ENERGY_COLLECT_RADIUS = 1.5

export default function Obstacles() {
  const chunksRef = useRef<Map<number, ChunkData>>(new Map())
  const lastNearMiss = useRef(0)
  const obstacleGroupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const store = useGameStore.getState()
    if (store.phase !== 'playing') return

    const playerZ = store.playerPosition[2]
    const playerX = store.playerPosition[0]
    const playerY = store.playerPosition[1]

    // Update active chunks
    chunksRef.current = getActiveChunks(playerZ, store.speedTier, chunksRef.current)

    // Check collisions with obstacles in current dimension
    if (!store.invulnerable) {
      for (const [, chunk] of chunksRef.current) {
        for (const obs of chunk.obstacles) {
          if (obs.dimension !== store.currentDimension) continue

          const dz = Math.abs(obs.position[2] - playerZ)
          if (dz > 10) continue // skip far obstacles

          const collisionRadius = getObstacleRadius(obs) + COLLISION_RADIUS_PLAYER
          const dx = obs.position[0] - playerX
          const dy = obs.position[1] - playerY
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < collisionRadius) {
            store.endGame()
            return
          }

          // Near-miss detection
          const now = Date.now()
          if (
            dist < collisionRadius * NEAR_MISS_MULT &&
            dist > collisionRadius &&
            now - lastNearMiss.current > 500
          ) {
            store.addDriftBonus()
            lastNearMiss.current = now
          }
        }

        // Energy fragment collection
        for (const frag of chunk.energyFragments) {
          if (frag.collected) continue
          const dz = Math.abs(frag.position[2] - playerZ)
          if (dz > ENERGY_COLLECT_RADIUS) continue
          const dx = frag.position[0] - playerX
          const dy = frag.position[1] - playerY
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < ENERGY_COLLECT_RADIUS) {
            frag.collected = true
            store.collectEnergy()
          }
        }
      }
    }
  })

  return (
    <group ref={obstacleGroupRef}>
      <ChunkRenderer chunksRef={chunksRef} />
    </group>
  )
}

function ChunkRenderer({ chunksRef }: { chunksRef: React.RefObject<Map<number, ChunkData>> }) {
  const meshesRef = useRef<Map<string, boolean>>(new Map())

  useFrame(() => {
    // Force re-render by touching ref - chunks update via the frame loop
  })

  const store = useGameStore.getState()
  const chunks = chunksRef.current
  if (!chunks) return null

  const allObstacles: ObstacleData[] = []
  const allFragments: EnergyFragment[] = []

  for (const [, chunk] of chunks) {
    allObstacles.push(...chunk.obstacles)
    allFragments.push(...chunk.energyFragments.filter((f) => !f.collected))
  }

  return (
    <>
      {allObstacles.map((obs) => (
        <ObstacleMesh key={obs.id} obstacle={obs} currentDimension={store.currentDimension} />
      ))}
      {allFragments.map((frag) => (
        <EnergyMesh key={frag.id} fragment={frag} />
      ))}
    </>
  )
}

function ObstacleMesh({
  obstacle,
  currentDimension,
}: {
  obstacle: ObstacleData
  currentDimension: Dimension
}) {
  const isActive = obstacle.dimension === currentDimension
  const color = DIMENSION_COLORS[obstacle.dimension]

  return (
    <mesh
      position={obstacle.position}
      rotation={obstacle.rotation}
      scale={obstacle.scale}
    >
      <ObstacleGeometry type={obstacle.geometry} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isActive ? 1.5 : 0.3}
        transparent
        opacity={isActive ? 0.85 : 0.12}
        wireframe={!isActive}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  )
}

function ObstacleGeometry({ type }: { type: string }) {
  switch (type) {
    case 'ring':
      return <torusGeometry args={[1, 0.15, 8, 24]} />
    case 'wall':
      return <boxGeometry args={[1, 1, 1]} />
    case 'pillar':
      return <cylinderGeometry args={[0.5, 0.5, 1, 8]} />
    case 'gate':
      return <torusGeometry args={[1, 0.2, 6, 4]} />
    case 'cube':
    default:
      return <boxGeometry args={[1, 1, 1]} />
  }
}

function EnergyMesh({ fragment }: { fragment: EnergyFragment }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 3
      meshRef.current.rotation.x = state.clock.elapsedTime * 2
      meshRef.current.position.y = fragment.position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={fragment.position}>
      <octahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial
        color="#ffdd44"
        emissive="#ffaa00"
        emissiveIntensity={3}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function getObstacleRadius(obs: ObstacleData): number {
  const avgScale = (obs.scale[0] + obs.scale[1] + obs.scale[2]) / 3
  switch (obs.geometry) {
    case 'ring':
    case 'gate':
      return avgScale * 0.3 // Holes in the middle, smaller effective radius
    case 'wall':
      return avgScale * 0.4
    case 'pillar':
      return avgScale * 0.25
    case 'cube':
    default:
      return avgScale * 0.45
  }
}
