'use client'

import dynamic from 'next/dynamic'
import HUD from '@/components/game/HUD'
import MainMenu from '@/components/menu/MainMenu'
import GameOver from '@/components/menu/GameOver'

const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#050510] flex items-center justify-center">
      <div className="text-zinc-500 text-sm tracking-widest animate-pulse">
        LOADING VOID...
      </div>
    </div>
  ),
})

export default function PlayPage() {
  return (
    <div className="fixed inset-0 bg-[#050510]">
      <GameCanvas />
      <HUD />
      <MainMenu />
      <GameOver />
    </div>
  )
}
