import { NextRequest, NextResponse } from 'next/server'
import { submitScore } from '@/lib/scoring'

// Max theoretical score per second (generous upper bound)
const MAX_SCORE_PER_SECOND = 500

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { player_name, score, distance, near_misses } = body

    if (!player_name || typeof player_name !== 'string' || player_name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid player name' }, { status: 400 })
    }

    if (typeof score !== 'number' || score < 0 || score > 10_000_000) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
    }

    if (typeof distance !== 'number' || distance < 0) {
      return NextResponse.json({ error: 'Invalid distance' }, { status: 400 })
    }

    // Basic plausibility check: distance correlates roughly with time
    // At avg speed 40 u/s, 1000 distance = ~25 seconds = ~12500 max score
    const estimatedSeconds = distance / 30
    const maxPlausibleScore = estimatedSeconds * MAX_SCORE_PER_SECOND
    if (score > maxPlausibleScore && maxPlausibleScore > 0) {
      return NextResponse.json({ error: 'Score seems implausible' }, { status: 400 })
    }

    const success = await submitScore({
      player_name: player_name.trim().slice(0, 20),
      score: Math.round(score),
      distance: Math.round(distance),
      near_misses: typeof near_misses === 'number' ? near_misses : 0,
    })

    if (!success) {
      return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
