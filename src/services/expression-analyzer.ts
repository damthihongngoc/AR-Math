import type { ResultRenderer } from 'src/services/result-renderer'
import type { Expression, MultiDigitNumber, Target } from 'src/types'
import {
  calculateResult,
  findMultiDigitNumbers,
  isValidExpression,
} from 'src/utils/expression-validator'
import { sortTargetsByX } from 'src/utils/position'

export class ExpressionAnalyzer {
  private resultRenderer: ResultRenderer
  private currentExpression: Expression | null
  private currentResult: number | null
  private currentMultiDigit: MultiDigitNumber | null

  constructor(resultRenderer: ResultRenderer) {
    this.resultRenderer = resultRenderer
    this.currentExpression = null
    this.currentResult = null
    this.currentMultiDigit = null
  }

  analyze(targets: Target[]): void {
    // Check for multi-digit numbers first
    const multiDigits = findMultiDigitNumbers(targets)
    if (multiDigits.length > 0) {
      this.handleMultiDigitNumber(multiDigits[0])
    } else {
      if (this.currentMultiDigit) {
        this.currentMultiDigit = null
      }
    }

    // Check for expressions
    const sortedTargets = sortTargetsByX(targets)
    const expression = isValidExpression(sortedTargets)

    if (!expression) {
      this.resetExpression()
      return
    }

    this.currentExpression = expression
    this.currentResult = calculateResult(expression)

    if (this.currentResult !== null && this.currentResult < 0) {
      // Negative result detected
      return
    }
  }

  private async handleMultiDigitNumber(
    multiDigit: MultiDigitNumber
  ): Promise<void> {
    this.currentMultiDigit = multiDigit
    this.resultRenderer.displayMultiDigitNumber(multiDigit)
  }

  resetExpression(): void {
    this.currentExpression = null
    this.currentResult = null
    this.resultRenderer.hideExpression()
  }

  reset(): void {
    this.resetExpression()
    this.currentMultiDigit = null
    this.resultRenderer.hideAll()
  }

  getExpression(): Expression | null {
    return this.currentExpression
  }

  getResult(): number | null {
    return this.currentResult
  }

  getMultiDigit(): MultiDigitNumber | null {
    return this.currentMultiDigit
  }
}
