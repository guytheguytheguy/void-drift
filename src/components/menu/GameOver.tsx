'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { DIMENSION_COLORS } from '@/types/game'

export default function GameOver() {
  const phase = useGameStore((s) => s.phase)
  const score = useGameStore((s) => s.score)
  const personalBest = useGameStore((s) => s.personalBest)
  const distanceTraveled = useGameStore((s) => s.distanceTraveled)
  const nearMisses = useGameStore((s) => s.nearMisses)
  const energyFragments = useGameStore((s) => s.energyFragments)
  const startGame = useGameStore((s) => s.startGame)
  const reset = useGameStore((s) => s.reset)

  const [displayScore, setDisplayScore] = useState(0)
  const [playerName, setPlayerName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isNewBest = score === personalBest && score > 0

  // Animate score counter
  useEffect(() => {
    if (phase !== 'dead') return
    setDisplayScore(0)
    setSubmitted(false)
    setPlayerName('')

    const duration = 1500
    const start = performance.now()
    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(score * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [phase, score])

  if (phase !== 'dead') return null

  async function handleSubmit() {
    if (!playerName.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: playerName.trim().slice(0, 20),
          score,
          distance: Math.round(distanceTraveled),
          near_misses: nearMisses,
        }),
      })
      if (res.ok) setSubmitted(true)
    } catch {
      // Silently fail - game still works without leaderboard
    }
    setSubmitting(false)
  }

  const [copied, setCopied] = useState(false)

  function handleShare() {
    const siteUrl = window.location.origin
    const text = `I scored ${score.toLocaleString()} in Void Drift! Can you beat me?\n${siteUrl}\n#VoidDrift #BrowserGame`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  async function handleCopyLink() {
    const siteUrl = window.location.origin
    const text = `I scored ${score.toLocaleString()} in Void Drift! Can you beat me? ${siteUrl}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 text-center px-4 max-w-sm w-full">
        {/* Game Over Title */}
        <div className="text-2xl font-bold text-red-400 tracking-[0.2em] mb-6"
          style={{ textShadow: '0 0 20px #ff224444' }}
        >
          GAME OVER
        </div>

        {/* Score */}
        <div className="text-6xl font-black text-white mb-2 tabular-nums"
          style={{ textShadow: '0 0 30px #22ddff66' }}
        >
          {displayScore.toLocaleString()}
        </div>

        {isNewBest ? (
          <div className="text-yellow-400 text-sm font-bold tracking-widest animate-pulse mb-4">
            NEW PERSONAL BEST!
          </div>
        ) : personalBest > 0 && (
          <div className="text-zinc-500 text-xs font-mono mb-4">
            BEST: {personalBest.toLocaleString()}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 my-6 text-center">
          <div>
            <div className="text-xs text-zinc-500 uppercase">Distance</div>
            <div className="text-lg text-white font-mono">{Math.round(distanceTraveled)}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase">Drifts</div>
            <div className="text-lg text-white font-mono">{nearMisses}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase">Energy</div>
            <div className="text-lg text-yellow-400 font-mono">{energyFragments}</div>
          </div>
        </div>

        {/* Leaderboard Submit */}
        {!submitted ? (
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                className="flex-1 px-4 py-2 bg-white/5 border border-zinc-700 rounded-lg
                  text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-cyan-500
                  transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                disabled={!playerName.trim() || submitting}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg
                  text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 disabled:opacity-30
                  transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? '...' : 'SUBMIT'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-green-400 text-sm mb-6">Score submitted!</div>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={startGame}
            className="w-full px-8 py-3 text-lg font-bold text-white tracking-widest
              bg-white/5 border border-white/20 rounded-lg
              hover:bg-white/10 hover:border-cyan-400/50 transition-all cursor-pointer"
          >
            PLAY AGAIN
          </button>

          <div className="flex gap-2 w-full">
            <button
              onClick={handleShare}
              className="flex-1 px-3 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-lg
                hover:text-white hover:border-zinc-500 transition-all cursor-pointer"
            >
              SHARE ON X
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 px-3 py-2 text-sm border rounded-lg transition-all cursor-pointer
                text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500"
            >
              {copied ? 'COPIED!' : 'COPY LINK'}
            </button>
            <button
              onClick={reset}
              className="flex-1 px-3 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-lg
                hover:text-white hover:border-zinc-500 transition-all cursor-pointer"
            >
              MENU
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
