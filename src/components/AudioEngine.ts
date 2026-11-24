type SoundKey =
  | 'hover'
  | 'click'
  | 'transition'
  | 'reveal'
  | 'card-hover'
  | 'card-in'
  | 'slide'
  | 'slide-2'
  | 'slide-3'
  | 'drag'
  | 'toggle-on'
  | 'toggle-off'
  | 'tick'
  | 'power-on';

class SoundEngine {
  private enabled = false;
  private bedAudio: HTMLAudioElement | null = null;
  private activeClip: HTMLAudioElement | null = null;
  private listeners = new Set<(enabled: boolean) => void>();

  public isEnabled(): boolean {
    return this.enabled;
  }

  public subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    this.listeners.forEach((fn) => fn(this.enabled));

    if (typeof window === 'undefined') return this.enabled;

    if (this.enabled) {
      this.play('toggle-on', 0.5);
      if (!this.bedAudio) {
        this.bedAudio = new Audio('/audio/bed.m4a');
        this.bedAudio.loop = true;
        this.bedAudio.volume = 0.18;
      }
      this.bedAudio.play().catch(() => {});
    } else {
      try {
        const off = new Audio('/audio/toggle-off.m4a');
        off.volume = 0.4;
        off.play().catch(() => {});
      } catch {}
      if (this.bedAudio) {
        this.bedAudio.pause();
      }
      if (this.activeClip) {
        this.activeClip.pause();
        this.activeClip = null;
      }
    }

    return this.enabled;
  }

  public play(key: SoundKey, volume = 0.35): void {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      const audio = new Audio(`/audio/${key}.m4a`);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.play().catch(() => {});
    } catch {}
  }

  public playOnFieldClip(filename: string): void {
    if (typeof window === 'undefined') return;
    try {
      if (this.activeClip) {
        this.activeClip.pause();
        this.activeClip = null;
      }
      const src = filename.startsWith('/') ? filename : `/audio/onfield/${filename}`;
      const audio = new Audio(src);
      audio.volume = 0.75;
      this.activeClip = audio;
      audio.play().catch(() => {});
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
