import { useEffect, useRef, useState } from 'react'
import { RESULT_MODELS, TARGET_TYPES } from 'src/constant/target'
import { ExpressionAnalyzer } from 'src/services/expression-analyzer'
import { PositionTracker } from 'src/services/position-tracker'
import { ResultRenderer } from 'src/services/result-renderer'
import { TargetManager } from 'src/services/target-manager'
import { TextToSpeechService } from 'src/services/text-to-speech'
import type { Expression, Target } from 'src/types'

interface usePracticeModeReturn {
  activeTargets: Map<number, Target> | undefined
  currentExpression: Expression | null | undefined
  currentResult: number | null | undefined
  hasNegativeResult: boolean
  resetNegativeResult: () => void
}

const usePracticeMode = (): usePracticeModeReturn => {
  const targetManager = useRef<TargetManager | null>(null)
  const resultRenderer = useRef<ResultRenderer | null>(null)
  const tts = useRef<TextToSpeechService | null>(null)
  const expressionAnalyzer = useRef<ExpressionAnalyzer | null>(null)
  const positionTracker = useRef<PositionTracker | null>(null)

  const [hasNegativeResult, setHasNegativeResult] = useState(false)

  useEffect(() => {
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
