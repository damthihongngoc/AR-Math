type SpeechTask = {
  id: string
  execute: () => Promise<void>
}

export class TextToSpeechService {
  private audioContext: AudioContext | null = null
  private currentSource: AudioBufferSourceNode | null = null
  private isSpeaking = false
  private audioCache: Map<string, AudioBuffer> = new Map()
  private basePath: string

  // Queue management
  private speechQueue: SpeechTask[] = []
  private isProcessingQueue = false
  private lastSpokenId = ''
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map()

  constructor(basePath = '/audios/voices') {
    this.basePath = basePath
    this.initAudioContext()
  }

  private initAudioContext(): void {
    this.audioContext = new AudioContext()
  }

  private async loadAudio(filename: string): Promise<AudioBuffer | null> {
    if (this.audioCache.has(filename)) {
      return this.audioCache.get(filename)!
    }

    try {
      const response = await fetch(`${this.basePath}/${filename}`)

      if (!response.ok) {
        console.warn(`File not found: ${filename}`)
        return null
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
      this.audioCache.set(filename, audioBuffer)
      return audioBuffer
    } catch (error) {
      console.error(`Failed to load audio: ${filename}`, error)
      return null
    }
  }

  private playAudioBuffer(buffer: AudioBuffer): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext) {
        resolve()
        return
      }

      const source = this.audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(this.audioContext.destination)

      this.currentSource = source

      source.onended = () => {
        this.currentSource = null
        resolve()
      }

      source.start(0)
    })
  }

  private async playAudioSequence(filenames: string[]): Promise<void> {
    for (const filename of filenames) {
      if (!this.isSpeaking) break

      try {
        const buffer = await this.loadAudio(filename)
        if (buffer) {
          await this.playAudioBuffer(buffer)
        }
      } catch (error) {
        console.error(`Error playing ${filename}:`, error)
      }
    }
  }

  private numberToFiles(num: number): string[] {
    if (num < 0 || num > 99) {
      console.warn('Number must be between 0 and 99')
      return []
    }

    const files: string[] = []

    if (num <= 20) {
      files.push(`${num}.mp3`)
    } else {
      const tens = Math.floor(num / 10) * 10
      const ones = num % 10

      files.push(`${tens}.mp3`)
      if (ones > 0) {
        files.push('pause_short.mp3')
        files.push(`${ones}.mp3`)
      }
    }

    return files
  }

  private operatorToFile(op: string): string {
    const opMap: { [key: string]: string } = {
      '+': 'plus.mp3',
      '-': 'minus.mp3',
      '×': 'mul.mp3',
      '*': 'mul.mp3',
      '÷': 'div.mp3',
      '/': 'div.mp3',
    }
    return opMap[op] || 'pause_short.mp3'
  }

  /**
   * Queue management - Thêm task vào hàng đợi
   */
  private async addToQueue(task: SpeechTask): Promise<void> {
    // Nếu task này vừa được nói gần đây, bỏ qua
    if (this.lastSpokenId === task.id) {
      return
    }

    // Xóa task trùng id trong queue
    this.speechQueue = this.speechQueue.filter((t) => t.id !== task.id)

    // Thêm task mới
    this.speechQueue.push(task)

    // Bắt đầu xử lý queue nếu chưa xử lý
    if (!this.isProcessingQueue) {
      this.processQueue()
    }
  }

  /**
   * Xử lý queue tuần tự
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return

    this.isProcessingQueue = true

    while (this.speechQueue.length > 0) {
      const task = this.speechQueue.shift()
      if (!task) break

      try {
        this.lastSpokenId = task.id
        this.isSpeaking = true
        await task.execute()
        this.isSpeaking = false

        // Delay nhỏ giữa các câu
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error('Error executing speech task:', error)
        this.isSpeaking = false
      }
    }

    this.isProcessingQueue = false
  }

  /**
   * Debounce helper - Chỉ thực thi sau khi không có request mới trong X ms
   */
  private debounce(key: string, fn: () => void, delay = 300): void {
    const existingTimer = this.debounceTimers.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const timer = setTimeout(() => {
      fn()
      this.debounceTimers.delete(key)
    }, delay)

    this.debounceTimers.set(key, timer)
  }

  /**
   * Đọc phép tính: num1 op num2 bằng result
   * Dùng debounce để tránh gọi nhiều lần khi tracking
   */
  async speakEquation(
    num1: number,
    op: string,
    num2: number,
    result: number
  ): Promise<void> {
    const taskId = `eq:${num1}${op}${num2}=${result}`

    this.debounce(
      taskId,
      () => {
        this.addToQueue({
          id: taskId,
          execute: async () => {
            const files: string[] = [
              ...this.numberToFiles(num1),
              'pause_short.mp3',
              this.operatorToFile(op),
              'pause_short.mp3',
              ...this.numberToFiles(num2),
              'pause_short.mp3',
              'equals.mp3',
              'pause_short.mp3',
              ...this.numberToFiles(result),
            ]
            await this.playAudioSequence(files)
          },
        })
      },
      500
    ) // Đợi 500ms không có request mới mới speak
  }

  /**
   * Đọc số chẵn/lẻ: num là số chẵn/số lẻ
   * Dùng debounce để tránh gọi nhiều lần
   */
  async speakEvenOdd(num: number, isEven: boolean): Promise<void> {
    const taskId = `evenodd:${num}:${isEven}`

    this.debounce(
      taskId,
      () => {
        this.addToQueue({
          id: taskId,
          execute: async () => {
            const files: string[] = [
              ...this.numberToFiles(num),
              'pause_short.mp3',
              isEven ? 'is_even.mp3' : 'is_odd.mp3',
            ]
            await this.playAudioSequence(files)
          },
        })
      },
      500
    )
  }

  /**
   * Đọc một số đơn lẻ
   * Thêm vào queue ngay lập tức (không debounce)
   */
  async speakNumber(num: number): Promise<void> {
    const taskId = `num:${num}`

    await this.addToQueue({
      id: taskId,
      execute: async () => {
        const files = this.numberToFiles(num)
        await this.playAudioSequence(files)
      },
    })
  }

  /**
   * Đọc toán tử đơn lẻ
   * Thêm vào queue ngay lập tức
   */
  async speakOperator(op: string): Promise<void> {
    const taskId = `op:${op}`

    await this.addToQueue({
      id: taskId,
      execute: async () => {
        await this.playAudioSequence([this.operatorToFile(op)])
      },
    })
  }

  /**
   * Phát âm thanh phản hồi
   */
  async speakFeedback(isCorrect: boolean): Promise<void> {
    const taskId = `feedback:${isCorrect}`

    await this.addToQueue({
      id: taskId,
      execute: async () => {
        await this.playAudioSequence([
          isCorrect ? 'correct.mp3' : 'incorrect.mp3',
        ])
      },
    })
  }

  /**
   * Đọc kết quả: "kết quả" + số
   */
  async speakResult(result: number): Promise<void> {
    const taskId = `result:${result}`

    await this.addToQueue({
      id: taskId,
      execute: async () => {
        const files: string[] = [
          'result.mp3',
          'pause_short.mp3',
          ...this.numberToFiles(result),
        ]
        await this.playAudioSequence(files)
      },
    })
  }

  /**
   * Dừng tất cả - Clear queue và cancel audio đang phát
   */
  cancel(): void {
    // Clear queue
    this.speechQueue = []
    this.isProcessingQueue = false
    this.isSpeaking = false

    // Clear debounce timers
    this.debounceTimers.forEach((timer) => clearTimeout(timer))
    this.debounceTimers.clear()

    // Stop current audio
    if (this.currentSource) {
      try {
        this.currentSource.stop()
      } catch (error) {
        // Ignore error if already stopped
      }
      this.currentSource = null
    }
  }

  /**
   * Clear last spoken để có thể nói lại
   */
  resetLastSpoken(): void {
    this.lastSpokenId = ''
  }

  /**
   * Kiểm tra trạng thái
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking || this.isProcessingQueue
  }

  /**
   * Preload audio files
   */
  async preloadAudios(): Promise<void> {
    const allFiles = [
      ...Array.from({ length: 21 }, (_, i) => `${i}.mp3`),
      '30.mp3',
      '40.mp3',
      '50.mp3',
      '60.mp3',
      '70.mp3',
      '80.mp3',
      '90.mp3',
      'plus.mp3',
      'minus.mp3',
      'mul.mp3',
      'div.mp3',
      'equals.mp3',
      'correct.mp3',
      'incorrect.mp3',
      'is_even.mp3',
      'is_odd.mp3',
      'pause_short.mp3',
      'pause_long.mp3',
      'result.mp3',
    ]

    const loadPromises = allFiles.map((file) =>
      this.loadAudio(file).catch((err) => {
        console.warn(`Failed to preload ${file}:`, err)
      })
    )

    await Promise.all(loadPromises)
    console.log('Audio files preloaded')
  }
}
