import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Void Drift — Phase Through Dimensions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #050510 0%, #0a0520 50%, #050510 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dimension glow orbs */}
        <div
          style={{
            position: 'absolute',
            top: 120,
            left: 80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ff224466 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 80,
            right: 120,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #22ddff44 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #aa44ff44 0%, transparent 70%)',
          }}
        />

        {/* Grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(34,221,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,221,255,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.1em',
            textShadow: '0 0 60px #22ddff88',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          VOID DRIFT
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#22ddffcc',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 48,
            display: 'flex',
          }}
        >
          Phase Through Dimensions
        </div>

        {/* Dimension indicators */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            alignItems: 'center',
          }}
        >
          {[
            { color: '#ff2244', label: 'CRIMSON' },
            { color: '#22ddff', label: 'CYAN' },
            { color: '#aa44ff', label: 'VIOLET' },
          ].map(({ color, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${color} 0%, ${color}44 60%, transparent 100%)`,
                  boxShadow: `0 0 30px ${color}88`,
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  color: color,
                  letterSpacing: '0.2em',
                  display: 'flex',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 18,
            color: '#ffffff33',
            letterSpacing: '0.3em',
            display: 'flex',
          }}
        >
          FREE TO PLAY · NO INSTALL · BROWSER GAME
        </div>
      </div>
    ),
    { ...size }
  )
}
