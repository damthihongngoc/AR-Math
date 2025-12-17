// src/services/audio-manager.ts

type AudioType = 'background' | 'effect' | 'tts'

interface AudioConfig {
  src: string
  loop?: boolean
  volume?: number
  type: AudioType
}

class AudioManager {
  private static instance: AudioManager
  private audios: Map<string, HTMLAudioElement> = new Map()
  private isMuted = false
  private volumes: Map<string, number> = new Map()
  private listeners: Set<(muted: boolean) => void> = new Set()

  private constructor() {
    // Load muted state from localStorage
    const savedMuted = localStorage.getItem('audioMuted')
    this.isMuted = savedMuted === 'true'
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  // Create and register an audio
  createAudio(id: string, config: AudioConfig): HTMLAudioElement {
    // If audio already exists, return it
    if (this.audios.has(id)) {
      return this.audios.get(id)!
    }

    const audio = new Audio(config.src)
    audio.loop = config.loop ?? false
    audio.volume = this.isMuted ? 0 : config.volume ?? 1

    this.audios.set(id, audio)
    this.volumes.set(id, config.volume ?? 1)

    return audio
  }

  // Get an existing audio
  getAudio(id: string): HTMLAudioElement | undefined {
    return this.audios.get(id)
  }

  // Play an audio
  async play(id: string): Promise<void> {
    const audio = this.audios.get(id)
    if (!audio) {
      console.warn(`Audio ${id} not found`)
      return
    }

    try {
      await audio.play()
    } catch (err) {
      console.warn(`Failed to play audio ${id}:`, err)
    }
  }

  // Pause an audio
  pause(id: string): void {
    const audio = this.audios.get(id)
    if (audio) {
      audio.pause()
    }
  }

  // Stop an audio (pause and reset)
  stop(id: string): void {
    const audio = this.audios.get(id)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  // Toggle mute for all audios
  toggleMute(): void {
    this.isMuted = !this.isMuted
    this.updateAllVolumes()

    // Save to localStorage
    localStorage.setItem('audioMuted', String(this.isMuted))

    // Notify listeners
    this.listeners.forEach((listener) => listener(this.isMuted))
  }

  // Set mute state
  setMuted(muted: boolean): void {
    if (this.isMuted === muted) return

    this.isMuted = muted
    this.updateAllVolumes()
    localStorage.setItem('audioMuted', String(this.isMuted))
    this.listeners.forEach((listener) => listener(this.isMuted))
  }

  // Get current mute state
  isMutedState(): boolean {
    return this.isMuted
  }

  // Update all audio volumes based on mute state
  private updateAllVolumes(): void {
    this.audios.forEach((audio, id) => {
      const originalVolume = this.volumes.get(id) ?? 1
      audio.volume = this.isMuted ? 0 : originalVolume
    })
  }

  // Set volume for a specific audio
  setVolume(id: string, volume: number): void {
    const audio = this.audios.get(id)
    if (audio) {
      this.volumes.set(id, volume)
      audio.volume = this.isMuted ? 0 : volume
    }
  }

  // Subscribe to mute state changes
  onMuteChange(callback: (muted: boolean) => void): () => void {
    this.listeners.add(callback)
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback)
    }
  }

  // Cleanup an audio
  removeAudio(id: string): void {
    const audio = this.audios.get(id)
    if (audio) {
      audio.pause()
      audio.src = ''
      this.audios.delete(id)
      this.volumes.delete(id)
    }
  }

  // Cleanup all audios
  cleanup(): void {
    this.audios.forEach((audio) => {
      audio.pause()
      audio.src = ''
    })
    this.audios.clear()
    this.volumes.clear()
  }
}

export default AudioManager
