'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/gameStore'

const keys = new Set<string>()

export function getKeys() {
  return keys
}

export default function Controls() {
  const shiftDimension = useGameStore((s) => s.shiftDimension)
  const cycleDimension = useGameStore((s) => s.cycleDimension)
  const phase = useGameStore((s) => s.phase)
  const pause = useGameStore((s) => s.pause)
  const resume = useGameStore((s) => s.resume)
  const startGame = useGameStore((s) => s.startGame)
  const lastCycleRef = useRef(0)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      keys.add(e.code)

      if (phase === 'menu' && (e.code === 'Space' || e.code === 'Enter')) {
        startGame()
        return
      }

      if (phase === 'playing') {
        if (e.code === 'Digit1') shiftDimension('crimson')
        if (e.code === 'Digit2') shiftDimension('cyan')
        if (e.code === 'Digit3') shiftDimension('violet')

        const now = Date.now()
        if (now - lastCycleRef.current > 150) {
          if (e.code === 'KeyQ') {
            cycleDimension(-1)
            lastCycleRef.current = now
          }
          if (e.code === 'KeyE') {
            cycleDimension(1)
            lastCycleRef.current = now
          }
        }

        if (e.code === 'Escape') pause()
      }

      if (phase === 'paused' && e.code === 'Escape') {
        resume()
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      keys.delete(e.code)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      keys.clear()
    }
  }, [phase, shiftDimension, cycleDimension, pause, resume, startGame])

  return null
}
