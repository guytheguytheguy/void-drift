'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import Player from './Player'
import Obstacles from './Obstacles'
import Environment from './Environment'
import Effects from './Effects'
import Camera from './Camera'
import Controls from './Controls'

export default function GameCanvas() {
  return (
    <>
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#050510' }}
        camera={{ fov: 75, near: 0.1, far: 300, position: [0, 3, -8] }}
      >
        <Suspense fallback={null}>
          <Camera />
          <Player />
          <Obstacles />
          <Environment />
          <Effects />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Suspense>
      </Canvas>
      <Controls />
    </>
  )
}
