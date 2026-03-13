'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DIMENSION_COLORS } from '@/types/game'
import type { LeaderboardEntry } from '@/types/game'
import { fetchTopScores } from '@/lib/scoring'

export default function LeaderboardPage() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopScores(50).then((data) => {
      setScores(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-wider"
              style={{ textShadow: '0 0 20px #22ddff44' }}
            >
              LEADERBOARD
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Top 50 Void Drifters</p>
          </div>
          <Link
            href="/play"
            className="px-4 py-2 text-sm text-cyan-400 border border-cyan-400/30 rounded-lg
              hover:bg-cyan-400/10 transition-all"
          >
            PLAY
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-zinc-500 py-12 animate-pulse">
            Loading scores...
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-zinc-500 mb-4">No scores yet. Be the first!</div>
            <Link
              href="/play"
              className="inline-block px-6 py-3 text-cyan-400 border border-cyan-400/30 rounded-lg
                hover:bg-cyan-400/10 transition-all"
            >
              START PLAYING
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Table Header */}
            <div className="grid grid-cols-[3rem_1fr_6rem_4rem_4rem] gap-2 px-4 py-2 text-xs text-zinc-600 uppercase tracking-wider">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">Score</span>
              <span className="text-right">Dist</span>
              <span className="text-right">Drifts</span>
            </div>

            {scores.map((entry, i) => {
              const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32']
              const isTop3 = i < 3

              return (
                <div
                  key={entry.id}
                  className="grid grid-cols-[3rem_1fr_6rem_4rem_4rem] gap-2 px-4 py-3
                    bg-white/[0.02] rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                >
                  <span
                    className="font-bold text-sm"
                    style={{ color: isTop3 ? medalColors[i] : '#71717a' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-white text-sm font-medium truncate">
                    {entry.player_name}
                  </span>
                  <span className="text-right text-white text-sm font-mono font-bold">
                    {entry.score.toLocaleString()}
                  </span>
                  <span className="text-right text-zinc-500 text-xs font-mono">
                    {entry.distance.toLocaleString()}
                  </span>
                  <span className="text-right text-zinc-500 text-xs font-mono">
                    {entry.near_misses}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-[10px] text-zinc-700 tracking-widest">
          <Link href="/" className="hover:text-zinc-500 transition-colors">VOID DRIFT</Link>
          {' '}&mdash;{' '}
          <a href="https://veridux.ai" target="_blank" rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors">
            VERIDUX LABS
          </a>
        </div>
      </div>
    </div>
  )
}
