import { useEffect, useRef, useState } from 'react'
import { RESULT_MODELS, TARGET_TYPES } from 'src/constant/target'
import { ExpressionAnalyzer } from 'src/services/expression-analyzer'
import { PositionTracker } from 'src/services/position-tracker'
import { ResultRenderer } from 'src/services/result-renderer'
import { TargetManager } from 'src/services/target-manager'
import { TextToSpeechService } from 'src/services/text-to-speech'
import AudioManager from 'src/services/audio-manager'
import type { Expression, Target } from 'src/types'

interface usePracticeModeReturn {
  activeTargets: Map<number, Target> | undefined
  currentExpression: Expression | null | undefined
  currentResult: number | null | undefined
  hasNegativeResult: boolean
  resetNegativeResult: () => void
}

const usePracticeMode = (): usePracticeModeReturn => {
  const audioManager = useRef<AudioManager>(AudioManager.getInstance())
  const targetManager = useRef<TargetManager | null>(null)
  const resultRenderer = useRef<ResultRenderer | null>(null)
  const tts = useRef<TextToSpeechService | null>(null)
  const expressionAnalyzer = useRef<ExpressionAnalyzer | null>(null)
  const positionTracker = useRef<PositionTracker | null>(null)

  const [hasNegativeResult, setHasNegativeResult] = useState(false)

  useEffect(() => {
    // Create audios using AudioManager
    audioManager.current.createAudio('practice-bg', {
      src: '/audios/background/practice.mp3',
      loop: true,
      volume: 0.1,
      type: 'background',
    })

    audioManager.current.createAudio('wrong-sound', {
      src: '/audios/bgm/wrong.mp3',
      volume: 0.5,
      type: 'effect',
    })

    // Play background music
    audioManager.current.play('practice-bg')

    // Initialize services
    targetManager.current = new TargetManager(TARGET_TYPES)
    resultRenderer.current = new ResultRenderer(RESULT_MODELS)
    tts.current = new TextToSpeechService()
    expressionAnalyzer.current = new ExpressionAnalyzer(
      resultRenderer.current,
      tts.current
    )
    positionTracker.current = new PositionTracker(
      targetManager.current,
      expressionAnalyzer.current
    )

    positionTracker.current?.start()

    const handleTargetFound = async (e: Event): Promise<void> => {
      const target = e.target as HTMLElement
      const index = parseInt(target.id.replace('anchor', ''))

      const isNew = targetManager.current?.addTarget(index, target, () => {
        expressionAnalyzer.current?.analyze(
          targetManager.current?.getTargets() || []
        )

        // Check for negative result
        const result = expressionAnalyzer.current?.getResult()
        if (result !== null && result !== undefined && result < 0) {
          setHasNegativeResult(true)
          audioManager.current.play('wrong-sound')
          audioManager.current.pause('practice-bg')
        }
      })

      if (!isNew || !tts.current) return

      const targetInfo = TARGET_TYPES[index]
      if (!targetInfo) return

      // Announce new target
      try {
        if (targetInfo.type === 'number') {
          await tts.current.speakNumber(Number(targetInfo.value))
        }

        if (targetInfo.type === 'operator') {
          await tts.current.speakOperator(String(targetInfo.value))
        }

        targetManager.current?.markAsAnnounced(index)
      } catch (error) {
        console.error('TTS error:', error)
      }
    }

    const handleTargetLost = (e: Event): void => {
      const target = e.target as HTMLElement
      const index = parseInt(target.id.replace('anchor', ''))
      targetManager.current?.removeTarget(index, () => {
        expressionAnalyzer.current?.reset()
        expressionAnalyzer.current?.analyze(
          targetManager.current?.getTargets() || []
        )

        // Check for negative result after removal
        const result = expressionAnalyzer.current?.getResult()
        if (result !== null && result !== undefined && result < 0) {
          setHasNegativeResult(true)
          audioManager.current.play('wrong-sound')
          audioManager.current.pause('practice-bg')
        }
      })
    }

    // Setup event listeners for all targets
    for (let i = 0; i <= 13; i++) {
      const anchor = document.getElementById(`anchor${i}`)
      if (!anchor) continue
      anchor.addEventListener('targetFound', handleTargetFound)
      anchor.addEventListener('targetLost', handleTargetLost)
    }

    return () => {
      // Cleanup audios
      audioManager.current.stop('practice-bg')
      audioManager.current.stop('wrong-sound')
      audioManager.current.removeAudio('practice-bg')
      audioManager.current.removeAudio('wrong-sound')

      for (let i = 0; i <= 13; i++) {
        const anchor = document.getElementById(`anchor${i}`)
        if (!anchor) continue
        anchor.removeEventListener('targetFound', handleTargetFound)
        anchor.removeEventListener('targetLost', handleTargetLost)
      }

      positionTracker.current?.stop()
      tts.current?.cancel()
    }
  }, [])

  const resetNegativeResult = () => {
    setHasNegativeResult(false)
    // Resume background music
    audioManager.current.play('practice-bg')
  }

  return {
    activeTargets: targetManager.current?.getActiveTargetsMap(),
    currentExpression: expressionAnalyzer.current?.getExpression(),
    currentResult: expressionAnalyzer.current?.getResult(),
    hasNegativeResult,
    resetNegativeResult,
  }
}

export default usePracticeMode
