'use client'

class AudioManager {
  private ctx: AudioContext | null = null
  private muted = false
  private initialized = false

  init() {
    if (this.initialized) return
    this.ctx = new AudioContext()
    this.initialized = true
    if (typeof window !== 'undefined') {
      this.muted = localStorage.getItem('voiddrift_muted') === 'true'
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted
  }

  private ensureCtx(): AudioContext | null {
    if (!this.ctx) this.init()
    if (this.ctx?.state === 'suspended') this.ctx.resume()
    return this.muted ? null : this.ctx
  }

  playPhaseShift() {
    const ctx = this.ensureCtx()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.1)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2)

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  }

  playCollision() {
    const ctx = this.ensureCtx()
    if (!ctx) return

    // White noise burst
    const bufferSize = ctx.sampleRate * 0.3
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05))
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    source.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    source.start(ctx.currentTime)

    // Low thud
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.connect(oscGain)
    oscGain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3)
    oscGain.gain.setValueAtTime(0.3, ctx.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  }

  playNearMiss() {
    const ctx = this.ensureCtx()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  }

  playEnergyPickup() {
    const ctx = this.ensureCtx()
    if (!ctx) return

    const notes = [880, 1108.73, 1318.51] // A5, C#6, E6 (A major)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06)

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.06)
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.06 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.2)

      osc.start(ctx.currentTime + i * 0.06)
      osc.stop(ctx.currentTime + i * 0.06 + 0.2)
    })
  }

  playSpeedTier() {
    const ctx = this.ensureCtx()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'square'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2)

    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  }
}

export const audioManager = new AudioManager()
