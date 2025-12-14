import { useEffect, useRef, useState } from 'react'
import { RESULT_MODELS, TARGET_TYPES } from 'src/constant/target'
import { ExpressionAnalyzer } from 'src/services/expression-analyzer'
import { PositionTracker } from 'src/services/position-tracker'
import { ResultRenderer } from 'src/services/result-renderer'
import { TargetManager } from 'src/services/target-manager'
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
  const expressionAnalyzer = useRef<ExpressionAnalyzer | null>(null)
  const positionTracker = useRef<PositionTracker | null>(null)

  const [hasNegativeResult, setHasNegativeResult] = useState(false)

  useEffect(() => {
    // Initialize services
    targetManager.current = new TargetManager(TARGET_TYPES)
    resultRenderer.current = new ResultRenderer(RESULT_MODELS)
    expressionAnalyzer.current = new ExpressionAnalyzer(resultRenderer.current)
    positionTracker.current = new PositionTracker(
      targetManager.current,
      expressionAnalyzer.current
    )

    positionTracker.current?.start()

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
      anchor.addEventListener('targetLost', handleTargetLost)
    }

    return () => {
      for (let i = 0; i <= 13; i++) {
        const anchor = document.getElementById(`anchor${i}`)
        if (!anchor) continue
        anchor.removeEventListener('targetLost', handleTargetLost)
      }

      positionTracker.current?.stop()
    }
  }, [])

  const resetNegativeResult = () => {
    setHasNegativeResult(false)
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
