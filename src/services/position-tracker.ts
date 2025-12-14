import type { ExpressionAnalyzer } from 'src/services/expression-analyzer'
import type { TargetManager } from 'src/services/target-manager'

export class PositionTracker {
  private targetManager: TargetManager
  private expressionAnalyzer: ExpressionAnalyzer
  private intervalId: number | null

  constructor(
    targetManager: TargetManager,
    expressionAnalyzer: ExpressionAnalyzer
  ) {
    this.targetManager = targetManager
    this.expressionAnalyzer = expressionAnalyzer
    this.intervalId = null
  }

  start(): void {
    if (this.intervalId) return

    this.intervalId = window.setInterval(() => {
      this.update()
    }, 100)
  }

  stop(): void {
    if (!this.intervalId) return
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  private update(): void {
    this.targetManager.getActiveTargetsMap().forEach((t, i) => {
      this.targetManager.updateTargetPosition(i, t.anchor)
    })

    this.updateResultPosition()

    // Analyze with at least 2 targets (for multi-digit numbers)
    if (this.targetManager.getTargetCount() >= 2) {
      this.expressionAnalyzer.analyze(this.targetManager.getTargets())
    } else {
      // Reset if less than 2 targets
      this.expressionAnalyzer.reset()
    }
  }

  private updateResultPosition(): void {
    const expression = this.expressionAnalyzer.getExpression()
    if (!expression) return

    const { operand2 } = expression
    const equalEl = document.getElementById('virtual-equal') as any
    const resultEl = document.getElementById('virtual-result') as any
    const anchor = operand2.anchor

    if (!equalEl || !resultEl || !anchor) return

    anchor.object3D.updateMatrixWorld(true)

    const equalMatrix = anchor.object3D.matrixWorld
      .clone()
      .multiply(
        new (window as any).AFRAME.THREE.Matrix4().makeTranslation(0.8, 0, 0)
      )
    equalEl.object3D.matrix.copy(equalMatrix)
    equalEl.object3D.matrixAutoUpdate = false

    const resultMatrix = anchor.object3D.matrixWorld
      .clone()
      .multiply(
        new (window as any).AFRAME.THREE.Matrix4().makeTranslation(1.5, 0, 0)
      )
    resultEl.object3D.matrix.copy(resultMatrix)
    resultEl.object3D.matrixAutoUpdate = false
  }
}
