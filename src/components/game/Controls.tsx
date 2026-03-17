'use client'

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { DIMENSION_COLORS, DIMENSIONS } from '@/types/game'

const keys = new Set<string>()

export function getKeys() {
  return keys
}

const TOUCH_DEAD_ZONE = 22

export default function Controls() {
  const shiftDimension = useGameStore((s) => s.shiftDimension)
  const cycleDimension = useGameStore((s) => s.cycleDimension)
  const phase = useGameStore((s) => s.phase)
  const pause = useGameStore((s) => s.pause)
  const resume = useGameStore((s) => s.resume)
  const startGame = useGameStore((s) => s.startGame)
  const lastCycleRef = useRef(0)
  const touchMoveRef = useRef<{ id: number; startX: number; startY: number } | null>(null)
  const [hasTouchEvents, setHasTouchEvents] = useState(false)

  useEffect(() => {
    setHasTouchEvents('ontouchstart' in window)
  }, [])

  // Keyboard controls
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

  // Touch movement (left 75% of screen → WASD, right 25% reserved for dim buttons)
  useEffect(() => {
    function clearMovementKeys() {
      keys.delete('KeyA')
      keys.delete('KeyD')
      keys.delete('KeyW')
      keys.delete('KeyS')
    }

    function handleTouchStart(e: TouchEvent) {
      if (phase === 'menu') { startGame(); return }
      if (phase !== 'playing') return
      const touch = e.changedTouches[0]
      if (touch.clientX > window.innerWidth * 0.75) return
      touchMoveRef.current = { id: touch.identifier, startX: touch.clientX, startY: touch.clientY }
    }

    function handleTouchMove(e: TouchEvent) {
      if (!touchMoveRef.current || phase !== 'playing') return
      e.preventDefault()
      const touch = Array.from(e.touches).find((t) => t.identifier === touchMoveRef.current!.id)
      if (!touch) return
      const dx = touch.clientX - touchMoveRef.current.startX
      const dy = touch.clientY - touchMoveRef.current.startY
      clearMovementKeys()
      if (Math.abs(dx) > TOUCH_DEAD_ZONE) keys.add(dx < 0 ? 'KeyA' : 'KeyD')
      if (Math.abs(dy) > TOUCH_DEAD_ZONE) keys.add(dy < 0 ? 'KeyW' : 'KeyS')
    }

    function handleTouchEnd(e: TouchEvent) {
      const ended = Array.from(e.changedTouches).find(
        (t) => t.identifier === touchMoveRef.current?.id,
      )
      if (ended) {
        touchMoveRef.current = null
        clearMovementKeys()
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      clearMovementKeys()
    }
  }, [phase, startGame])

  // Dimension shift buttons (mobile only)
  if (!hasTouchEvents || phase !== 'playing') return null

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
      {DIMENSIONS.map((dim, i) => (
        <button
          key={dim}
          onPointerDown={(e) => {
            e.stopPropagation()
            shiftDimension(dim)
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center
            text-white font-bold text-lg active:scale-90 transition-transform"
          style={{
            backgroundColor: `${DIMENSION_COLORS[dim]}30`,
            border: `2px solid ${DIMENSION_COLORS[dim]}`,
            boxShadow: `0 0 16px ${DIMENSION_COLORS[dim]}44`,
          }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}
