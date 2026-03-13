'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'

export default function Environment() {
  return (
    <>
      <StarField />
      <ambientLight intensity={0.08} color="#4466aa" />
      <fog attach="fog" args={['#050510', 60, 200]} />
    </>
  )
}

function StarField() {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const count = 2000
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Distribute stars in a large cylinder around the player path
      const angle = Math.random() * Math.PI * 2
      const radius = 30 + Math.random() * 70
      pos[i3] = Math.cos(angle) * radius
      pos[i3 + 1] = (Math.random() - 0.5) * 60
      pos[i3 + 2] = Math.random() * 800 - 200

      // Slight color variation
      const brightness = 0.3 + Math.random() * 0.7
      const tint = Math.random()
      if (tint < 0.3) {
        col[i3] = brightness * 0.8
        col[i3 + 1] = brightness * 0.9
        col[i3 + 2] = brightness
      } else if (tint < 0.6) {
        col[i3] = brightness
        col[i3 + 1] = brightness * 0.8
        col[i3 + 2] = brightness * 0.9
      } else {
        col[i3] = brightness * 0.9
        col[i3 + 1] = brightness
        col[i3 + 2] = brightness * 0.95
      }
    }

    return [pos, col]
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const store = useGameStore.getState()

    // Move stars relative to player for parallax
    pointsRef.current.position.z = store.playerPosition[2] * 0.1

    // Slow rotation for atmosphere
    pointsRef.current.rotation.z += 0.0001
  })

  const positionAttr = useMemo(() => new THREE.Float32BufferAttribute(positions, 3), [positions])
  const colorAttr = useMemo(() => new THREE.Float32BufferAttribute(colors, 3), [colors])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive object={positionAttr} attach="attributes-position" />
        <primitive object={colorAttr} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}
