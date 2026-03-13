'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'

export default function Camera() {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())

  useFrame(() => {
    const store = useGameStore.getState()
    const [px, py, pz] = store.playerPosition

    if (store.phase === 'playing' || store.phase === 'paused') {
      // Camera behind and above player
      targetPos.current.set(px * 0.3, py * 0.3 + 3, pz - 8)
      targetLook.current.set(px * 0.5, py * 0.5, pz + 20)
    } else if (store.phase === 'dead') {
      // Pull back on death
      targetPos.current.set(px, py + 5, pz - 15)
      targetLook.current.set(px, py, pz)
    } else {
      // Menu: slow orbit
      const t = Date.now() * 0.0002
      targetPos.current.set(Math.sin(t) * 8, 3, Math.cos(t) * 8)
      targetLook.current.set(0, 0, 10)
    }

    camera.position.lerp(targetPos.current, 0.05)
    const currentLook = new THREE.Vector3()
    camera.getWorldDirection(currentLook)
    currentLook.add(camera.position)
    currentLook.lerp(targetLook.current, 0.05)
    camera.lookAt(targetLook.current)
  })

  return null
}
