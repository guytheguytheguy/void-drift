'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { DIMENSION_COLORS, DIMENSIONS, type Dimension } from '@/types/game'

export default function HUD() {
  const phase = useGameStore((s) => s.phase)
  const score = useGameStore((s) => s.score)
  const speed = useGameStore((s) => s.speed)
  const speedTier = useGameStore((s) => s.speedTier)
  const currentDimension = useGameStore((s) => s.currentDimension)
  const scoreMultiplier = useGameStore((s) => s.scoreMultiplier)
  const driftBonusActive = useGameStore((s) => s.driftBonusActive)
  const energyFragments = useGameStore((s) => s.energyFragments)
  const nearMisses = useGameStore((s) => s.nearMisses)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window)
  }, [])

  if (phase !== 'playing' && phase !== 'paused') return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Score - Top Center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <div className="text-4xl font-bold text-white tabular-nums tracking-wider"
          style={{ textShadow: `0 0 20px ${DIMENSION_COLORS[currentDimension]}` }}
        >
          {score.toLocaleString()}
        </div>
        {scoreMultiplier > 1 && (
          <div className="text-sm text-yellow-400 font-mono mt-1">
            x{scoreMultiplier.toFixed(1)}
          </div>
        )}
      </div>

      {/* Speed Tier - Top Right */}
      <div className="absolute top-6 right-6 text-right">
        <div className="text-xs text-zinc-500 uppercase tracking-widest">Speed</div>
        <div className="text-lg font-bold text-white font-mono">
          TIER {speedTier}
        </div>
        <div className="text-xs text-zinc-400 font-mono">
          {Math.round(speed)} u/s
        </div>
      </div>

      {/* Energy + Near Misses - Top Left */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-2 text-yellow-400">
          <span className="text-sm">&#9670;</span>
          <span className="text-sm font-mono">{energyFragments}</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 mt-1">
          <span className="text-xs text-zinc-500">DRIFTS</span>
          <span className="text-sm font-mono">{nearMisses}</span>
        </div>
      </div>

      {/* Dimension Indicator - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {DIMENSIONS.map((dim) => (
          <DimensionDot key={dim} dimension={dim} active={currentDimension === dim} />
        ))}
      </div>

      {/* Drift Bonus Flash */}
      {driftBonusActive && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
          <div className="text-2xl font-black text-cyan-400 tracking-widest"
            style={{ textShadow: '0 0 30px #22ddff' }}
          >
            DRIFT BONUS!
          </div>
        </div>
      )}

      {/* Dimension shift hint - bottom right */}
      <div className="absolute bottom-8 right-6 text-zinc-600 text-xs text-right">
        {isTouchDevice ? (
          <>
            <div>tap buttons to shift</div>
            <div>swipe to move</div>
          </>
        ) : (
          <>
            <div>1/2/3 or Q/E to shift</div>
            <div>WASD to move</div>
          </>
        )}
      </div>

      {/* Paused overlay */}
      {phase === 'paused' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-4">PAUSED</div>
            <div className="text-zinc-400">Press ESC to resume</div>
          </div>
        </div>
      )}
    </div>
  )
}

function DimensionDot({ dimension, active }: { dimension: Dimension; active: boolean }) {
  const color = DIMENSION_COLORS[dimension]
  const labels: Record<Dimension, string> = {
    crimson: '1',
    cyan: '2',
    violet: '3',
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="rounded-full transition-all duration-200"
        style={{
          width: active ? 20 : 12,
          height: active ? 20 : 12,
          backgroundColor: color,
          boxShadow: active ? `0 0 20px ${color}, 0 0 40px ${color}` : 'none',
          opacity: active ? 1 : 0.4,
        }}
      />
      <span className="text-[10px] text-zinc-500 font-mono">{labels[dimension]}</span>
    </div>
  )
}
