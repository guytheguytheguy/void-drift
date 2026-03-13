'use client'

import { DIMENSION_COLORS } from '@/types/game'

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative z-10 bg-zinc-900 border border-zinc-700 rounded-xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors text-xl cursor-pointer"
        >
          &#10005;
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 tracking-wider">HOW TO PLAY</h2>

        {/* Core Concept */}
        <div className="mb-6">
          <h3 className="text-sm text-cyan-400 uppercase tracking-widest mb-2">The Concept</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            You pilot a craft through an infinite void filled with obstacles across three
            color dimensions. You can only collide with obstacles in your current dimension.
            Phase-shift between dimensions to dodge obstacles and collect energy.
          </p>
        </div>

        {/* Dimensions */}
        <div className="mb-6">
          <h3 className="text-sm text-cyan-400 uppercase tracking-widest mb-3">Dimensions</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Crimson', key: '1', dim: 'crimson' as const },
              { name: 'Cyan', key: '2', dim: 'cyan' as const },
              { name: 'Violet', key: '3', dim: 'violet' as const },
            ].map(({ name, key, dim }) => (
              <div key={dim} className="text-center p-3 rounded-lg bg-white/5 border border-zinc-800">
                <div
                  className="w-6 h-6 rounded-full mx-auto mb-2"
                  style={{
                    backgroundColor: DIMENSION_COLORS[dim],
                    boxShadow: `0 0 15px ${DIMENSION_COLORS[dim]}`,
                  }}
                />
                <div className="text-white text-xs font-medium">{name}</div>
                <div className="text-zinc-500 text-[10px] font-mono mt-1">Key: {key}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <h3 className="text-sm text-cyan-400 uppercase tracking-widest mb-3">Controls</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-300">
              <span>Move</span>
              <span className="text-zinc-500 font-mono">WASD / Arrow Keys</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Dimension 1/2/3</span>
              <span className="text-zinc-500 font-mono">1 / 2 / 3</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Cycle Dimension</span>
              <span className="text-zinc-500 font-mono">Q / E</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Pause</span>
              <span className="text-zinc-500 font-mono">ESC</span>
            </div>
          </div>
        </div>

        {/* Scoring */}
        <div className="mb-6">
          <h3 className="text-sm text-cyan-400 uppercase tracking-widest mb-2">Scoring</h3>
          <div className="space-y-1 text-sm text-zinc-400">
            <p>&#9670; Speed generates passive score</p>
            <p>&#9670; Near-miss obstacles for <span className="text-cyan-400">DRIFT BONUS</span> points</p>
            <p>&#9670; Collect <span className="text-yellow-400">energy fragments</span> to increase score multiplier</p>
            <p>&#9670; Speed increases over time — survive as long as you can!</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-sm font-bold text-white tracking-widest
            bg-white/5 border border-zinc-700 rounded-lg
            hover:bg-white/10 hover:border-zinc-500 transition-all cursor-pointer"
        >
          GOT IT
        </button>
      </div>
    </div>
  )
}
