'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DIMENSION_COLORS } from '@/types/game'
import { fetchTopScores } from '@/lib/scoring'
import type { LeaderboardEntry } from '@/types/game'

export default function HomePage() {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    fetchTopScores(5).then(setTopScores)
  }, [])

  return (
    <div className="min-h-screen bg-[#050510] overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 text-center px-4">
          <h1
            className="text-7xl sm:text-9xl font-black tracking-[0.2em] text-white mb-2"
            style={{
              textShadow: '0 0 60px #22ddff33, 0 0 120px #22ddff11',
            }}
          >
            VOID
          </h1>
          <h1
            className="text-6xl sm:text-8xl font-black tracking-[0.35em] mb-8"
            style={{
              background: 'linear-gradient(135deg, #ff2244, #22ddff, #aa44ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DRIFT
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl mb-12 max-w-lg mx-auto tracking-wide">
            Phase through dimensions. Drift through the void.
          </p>

          <Link
            href="/play"
            className="group relative inline-block px-16 py-5 text-xl font-bold text-white tracking-[0.2em]
              bg-white/5 border border-white/20 rounded-xl
              hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_50px_#22ddff33]
              transition-all duration-500"
          >
            <span className="relative z-10">PLAY NOW</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          <div className="mt-6 text-zinc-600 text-xs tracking-widest">
            FREE TO PLAY &middot; NO INSTALL &middot; BROWSER-BASED 3D
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border border-zinc-700 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-zinc-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4 tracking-wider">
            THREE DIMENSIONS. ONE VOID.
          </h2>
          <p className="text-zinc-500 text-center mb-16 max-w-2xl mx-auto">
            The world exists across three overlapping color dimensions. Phase-shift between them
            in real-time to dodge obstacles and find your path through the infinite void.
          </p>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                dim: 'crimson' as const,
                title: 'CRIMSON',
                desc: 'Red-hot obstacles glow with crimson energy. Phase in to interact, phase out to pass through.',
                key: '1',
              },
              {
                dim: 'cyan' as const,
                title: 'CYAN',
                desc: 'Cool blue structures fill the void. Your starting dimension — the one you know best.',
                key: '2',
              },
              {
                dim: 'violet' as const,
                title: 'VIOLET',
                desc: 'Purple geometries shift at the edge of perception. Master all three to survive.',
                key: '3',
              },
            ].map(({ dim, title, desc, key }) => (
              <div
                key={dim}
                className="relative p-6 rounded-xl bg-white/[0.02] border border-white/5
                  hover:border-white/10 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{
                    backgroundColor: `${DIMENSION_COLORS[dim]}15`,
                    border: `1px solid ${DIMENSION_COLORS[dim]}30`,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: DIMENSION_COLORS[dim],
                      boxShadow: `0 0 15px ${DIMENSION_COLORS[dim]}`,
                    }}
                  />
                </div>
                <h3 className="text-white font-bold tracking-widest mb-2">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
                <div className="mt-3 text-zinc-700 text-xs font-mono">Press {key} to shift</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'Procedurally Generated', desc: 'Every run is unique. Infinite obstacles, infinite possibilities.' },
              { title: 'Global Leaderboard', desc: 'Compete with players worldwide. Submit your score and climb the ranks.' },
              { title: 'Drift Bonus System', desc: 'Near-miss obstacles for bonus points. Risk equals reward.' },
              { title: 'Progressive Difficulty', desc: 'Speed increases over time. How long can you survive?' },
              { title: 'Zero Install', desc: 'Runs entirely in your browser. WebGL-powered 3D graphics.' },
              { title: 'Built by AI', desc: 'Designed, coded, and shipped by AI agents at Veridux Labs.' },
            ].map(({ title, desc }) => (
              <div key={title} className="p-5 rounded-lg bg-white/[0.02] border border-white/5">
                <h3 className="text-white font-medium text-sm mb-1">{title}</h3>
                <p className="text-zinc-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Leaderboard */}
      {topScores.length > 0 && (
        <section className="py-24 px-4 border-t border-white/5">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-8 tracking-wider">TOP DRIFTERS</h2>
            <div className="space-y-2 mb-8">
              {topScores.map((entry, i) => (
                <div key={entry.id}
                  className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-lg border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 text-sm font-mono w-6">{i + 1}</span>
                    <span className="text-white text-sm">{entry.player_name}</span>
                  </div>
                  <span className="text-white text-sm font-mono font-bold">
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/leaderboard"
              className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
            >
              View full leaderboard &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-wider">READY TO DRIFT?</h2>
          <p className="text-zinc-500 mb-8">No sign-up. No download. Just play.</p>
          <Link
            href="/play"
            className="inline-block px-12 py-4 text-lg font-bold text-white tracking-widest
              bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-white/20 rounded-xl
              hover:from-cyan-500/30 hover:to-violet-500/30 hover:border-cyan-400/50
              transition-all duration-300"
          >
            PLAY VOID DRIFT
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5 text-center">
        <div className="text-[10px] text-zinc-700 tracking-widest space-y-2">
          <div>
            <a href="https://veridux.ai" target="_blank" rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors">
              A VERIDUX LABS PRODUCT
            </a>
          </div>
          <div>&copy; {new Date().getFullYear()} Veridux Labs. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
