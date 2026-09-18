// Web Audio API Zero-Dependency Chess Sound Synthesizer
// Synthesizes rich, tactile, low-latency chess audio in-browser with zero external asset dependencies

class ChessAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private isMuted: boolean = false;
  private noiseBuffer: AudioBuffer | null = null;

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.75, this.ctx.currentTime);
    }
  }

  getMuted() {
    return this.isMuted;
  }

  resumeAudio() {
    this.unlockMobileAudio();
  }

  public initCtx(): AudioContext | null {
    if (this.isMuted || typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // 1. Create Dynamics Compressor as hardware brickwall limiter
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-3, this.ctx.currentTime); // -3 dB
        this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.08, this.ctx.currentTime);

        // 2. Master Gain Node (0.75 headroom)
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime);

        // Connect graph: Source Nodes -> Compressor -> Master Gain -> Destination
        this.compressor.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public unlockMobileAudio() {
    const ctx = this.initCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // Play a 1-sample silent buffer to firmly unlock WebKit audio hardware
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {}
  }

  private getDestinationNode(): AudioNode | null {
    const ctx = this.initCtx();
    if (!ctx || !this.compressor) return null;
    return this.compressor;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer || this.noiseBuffer.sampleRate !== ctx.sampleRate) {
      const length = Math.floor(ctx.sampleRate * 0.05); // 50ms transient
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  /**
   * Clean tactile wooden move sound ("tock")
   * Combines a micro noise transient with a resonant wooden body tone
   */
  playMove() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const dest = this.getDestinationNode();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      // 1. High transient impact click
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(dest);
      noise.start(now);
      noise.stop(now + 0.022);

      // 2. Resonant wooden board body
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);

      oscGain.gain.setValueAtTime(0.30, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.075);
    } catch {}
  }

  /**
   * Heavy wood-on-wood piece capture ("clack")
   * Punchier transient with deeper lower body resonance
   */
  playCapture() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const dest = this.getDestinationNode();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      // 1. Punchy transient noise
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(dest);
      noise.start(now);
      noise.stop(now + 0.04);

      // 2. Primary lower impact body
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(280, now);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.10);

      gain1.gain.setValueAtTime(0.38, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.10);

      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(now);
      osc1.stop(now + 0.11);

      // 3. Sub-harmonic thud
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(140, now);
      osc2.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      gain2.gain.setValueAtTime(0.25, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(now);
      osc2.stop(now + 0.09);
    } catch {}
  }

  /**
   * King in check alert chime
   * Clear, elegant dual chime indicating king threat
   */
  playCheck() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const dest = this.getDestinationNode();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      // Dual harmonic bell chime (D5: 587Hz & A5: 880Hz)
      const freqs = [587.33, 880.0];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.02);

        gain.gain.setValueAtTime(0.20, now + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.02);
        osc.stop(now + 0.26);
      });
    } catch {}
  }

  /**
   * Opponent refutation / blunder indicator
   * Soft warning tone signaling tactical counter-attack
   */
  playRefutation() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const dest = this.getDestinationNode();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.16);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {}
  }

  playBlunder() {
    this.playRefutation();
  }

  /**
   * Victory / Checkmate celebration chime
   * Ascending arpeggio (C5 -> E5 -> G5 -> C6) with warm decay
   */
  playVictory() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const dest = this.getDestinationNode();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.26);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch {}
  }

  playSuccess() {
    this.playVictory();
  }

  playCheckmate() {
    this.playVictory();
  }
}

export const sounds = new ChessAudio();

// Warm up Web Audio API on first user gesture with active touch unlock
if (typeof window !== 'undefined') {
  const unlock = () => {
    sounds.unlockMobileAudio();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock, { once: true, passive: false });
  window.addEventListener('touchstart', unlock, { once: true, passive: false });
  window.addEventListener('keydown', unlock, { once: true, passive: false });
}
