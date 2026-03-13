'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'
import { DIMENSION_COLORS, DIMENSION_EMISSIVE } from '@/types/game'
import { getKeys } from './Controls'

const MOVE_SPEED = 12
const BOUNDS_X = 9
const BOUNDS_Y = 5.5

export default function Player() {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const trailRef = useRef<THREE.Points>(null)
  const trailPositions = useRef(new Float32Array(300)) // 100 trail points x 3
  const trailIndex = useRef(0)
  const trailTimer = useRef(0)

  useFrame((state, delta) => {
    const store = useGameStore.getState()
    if (!meshRef.current) return

    if (store.phase === 'playing') {
      const keys = getKeys()
      const mesh = meshRef.current
      const pos = mesh.position

      // Lateral movement
      let dx = 0
      let dy = 0
      if (keys.has('KeyA') || keys.has('ArrowLeft')) dx = -1
      if (keys.has('KeyD') || keys.has('ArrowRight')) dx = 1
      if (keys.has('KeyW') || keys.has('ArrowUp')) dy = 1
      if (keys.has('KeyS') || keys.has('ArrowDown')) dy = -1

      // Normalize diagonal
      if (dx !== 0 && dy !== 0) {
        dx *= 0.707
        dy *= 0.707
      }

      pos.x += dx * MOVE_SPEED * delta
      pos.y += dy * MOVE_SPEED * delta

      // Clamp to bounds
      pos.x = THREE.MathUtils.clamp(pos.x, -BOUNDS_X, BOUNDS_X)
      pos.y = THREE.MathUtils.clamp(pos.y, -BOUNDS_Y, BOUNDS_Y)

      // Forward movement
      pos.z += store.speed * delta

      // Slight tilt based on movement
      mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, -dx * 0.3, 0.1)
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, dy * 0.15 + 0.2, 0.1)

      // Spin the craft slowly
      mesh.rotation.y += delta * 1.5

      // Update store position for collision detection
      store.setPlayerPosition([pos.x, pos.y, pos.z])

      // Update light
      if (lightRef.current) {
        lightRef.current.position.copy(pos)
        lightRef.current.color.set(DIMENSION_COLORS[store.currentDimension])
      }

      // Update trail particles
      trailTimer.current += delta
      if (trailTimer.current > 0.02 && trailRef.current) {
        trailTimer.current = 0
        const i = (trailIndex.current % 100) * 3
        trailPositions.current[i] = pos.x
        trailPositions.current[i + 1] = pos.y
        trailPositions.current[i + 2] = pos.z - 1
        trailIndex.current++

        const geom = trailRef.current.geometry
        geom.attributes.position.needsUpdate = true
      }

      // Game tick
      store.tick(delta)
    }

    // Update material color
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      const targetColor = DIMENSION_COLORS[store.currentDimension]
      const targetEmissive = DIMENSION_EMISSIVE[store.currentDimension]
      mat.color.lerp(new THREE.Color(targetColor), 0.15)
      mat.emissive.lerp(new THREE.Color(targetEmissive), 0.15)
    }
  })

  const store = useGameStore.getState()

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={DIMENSION_COLORS[store.currentDimension]}
          emissive={DIMENSION_EMISSIVE[store.currentDimension]}
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        color={DIMENSION_COLORS[store.currentDimension]}
        intensity={3}
        distance={20}
      />
      <TrailPoints trailRef={trailRef} trailPositions={trailPositions} currentDimension={store.currentDimension} />
    </>
  )
}

function TrailPoints({
  trailRef,
  trailPositions,
  currentDimension,
}: {
  trailRef: React.RefObject<THREE.Points | null>
  trailPositions: React.RefObject<Float32Array>
  currentDimension: keyof typeof DIMENSION_COLORS
}) {
  const attr = useMemo(
    () => new THREE.Float32BufferAttribute(trailPositions.current, 3),
    [trailPositions],
  )

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <primitive object={attr} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        color={DIMENSION_COLORS[currentDimension]}
        size={0.15}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}
