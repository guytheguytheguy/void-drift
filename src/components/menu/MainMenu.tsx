'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import HowToPlay from './HowToPlay'

export default function MainMenu() {
  const phase = useGameStore((s) => s.phase)
  const startGame = useGameStore((s) => s.startGame)
  const personalBest = useGameStore((s) => s.personalBest)
  const muted = useGameStore((s) => s.muted)
  const toggleMute = useGameStore((s) => s.toggleMute)
  const [showHowTo, setShowHowTo] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window)
  }, [])

  if (phase !== 'menu') return null

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />

      <div className="relative z-10 text-center px-4">
        {/* Title */}
        <h1
          className="text-6xl sm:text-8xl font-black tracking-[0.2em] text-white mb-2"
          style={{
            textShadow:
              '0 0 40px #22ddff, 0 0 80px #22ddff44, 0 0 120px #aa44ff22',
          }}
        >
          VOID
        </h1>
        <h1
          className="text-5xl sm:text-7xl font-black tracking-[0.3em] mb-6"
          style={{
            background: 'linear-gradient(135deg, #ff2244, #22ddff, #aa44ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
          }}
        >
          DRIFT
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base mb-8 max-w-md mx-auto tracking-wide">
          Phase through dimensions. Drift through the void.
        </p>

        {/* Personal Best */}
        {personalBest > 0 && (
          <div className="text-zinc-500 text-xs mb-6 font-mono">
            PERSONAL BEST: {personalBest.toLocaleString()}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={startGame}
            className="group relative px-12 py-4 text-lg font-bold text-white tracking-widest
              bg-white/5 border border-white/20 rounded-lg
              hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_30px_#22ddff44]
              transition-all duration-300 cursor-pointer"
          >
            <span className="relative z-10">PLAY</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setShowHowTo(true)}
              className="px-6 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-lg
                hover:text-white hover:border-zinc-500 transition-all cursor-pointer"
            >
              HOW TO PLAY
            </button>
            <a
              href="/leaderboard"
              className="px-6 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-lg
                hover:text-white hover:border-zinc-500 transition-all"
            >
              LEADERBOARD
            </a>
          </div>

          <button
            onClick={toggleMute}
            className="mt-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
          >
            {muted ? 'UNMUTE' : 'MUTE'} AUDIO
          </button>
        </div>

        {/* Credits */}
        <div className="mt-12 text-[10px] text-zinc-700 tracking-widest">
          BUILT BY{' '}
          <a
            href="https://veridux.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-cyan-400 transition-colors"
          >
            VERIDUX LABS
          </a>
        </div>

        {/* Start hint */}
        <div className="mt-4 text-[10px] text-zinc-700">
          {isTouchDevice ? 'TAP TO START' : 'Press SPACE or ENTER to start'}
        </div>
      </div>

      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
    </div>
  )
}
