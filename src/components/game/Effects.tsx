'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'

export default function Effects() {
  const chromaRef = useRef<any>(null)
  const chromaOffset = useRef(new THREE.Vector2(0.002, 0.002))

  useFrame(() => {
    if (!chromaRef.current) return
    const store = useGameStore.getState()
    // Increase chromatic aberration with speed
    const intensity = (store.speed / store.maxSpeed) * 0.004
    chromaOffset.current.set(intensity, intensity)
    chromaRef.current.offset = chromaOffset.current
  })

  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        ref={chromaRef}
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.002, 0.002)}
      />
      <Vignette
        darkness={0.5}
        offset={0.3}
      />
    </EffectComposer>
  )
}
