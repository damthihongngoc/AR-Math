import type { ResultRenderer } from 'src/services/result-renderer'
import type { TextToSpeechService } from 'src/services/text-to-speech'
import type { Expression, MultiDigitNumber, Target } from 'src/types'
import {
  calculateResult,
  findMultiDigitNumbers,
  isValidExpression,
} from 'src/utils/expression-validator'
import { sortTargetsByX } from 'src/utils/position'

export class ExpressionAnalyzer {
  private resultRenderer: ResultRenderer
  private tts: TextToSpeechService
  private currentExpression: Expression | null
  private currentResult: number | null
  private currentMultiDigit: MultiDigitNumber | null
  private lastAnnouncedExpression: string | null
  private lastAnnouncedMultiDigit: number | null

  constructor(resultRenderer: ResultRenderer, tts: TextToSpeechService) {
    this.resultRenderer = resultRenderer
    this.tts = tts
    this.currentExpression = null
    this.currentResult = null
    this.currentMultiDigit = null
    this.lastAnnouncedExpression = null
    this.lastAnnouncedMultiDigit = null
  }

  analyze(targets: Target[]): void {
    // Check for multi-digit numbers first
    const multiDigits = findMultiDigitNumbers(targets)
    if (multiDigits.length > 0) {
      this.handleMultiDigitNumber(multiDigits[0])
    } else {
      if (this.currentMultiDigit) {
        this.currentMultiDigit = null
        this.lastAnnouncedMultiDigit = null
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

    if (this.currentResult !== null) {
      this.resultRenderer.displayExpressionResult(this.currentResult)
      this.announceExpression(expression, this.currentResult)
    }
  }

  private async handleMultiDigitNumber(
    multiDigit: MultiDigitNumber
  ): Promise<void> {
    this.currentMultiDigit = multiDigit
    this.resultRenderer.displayMultiDigitNumber(multiDigit)

    if (this.lastAnnouncedMultiDigit === multiDigit.value) {
      return
    }

    try {
      await this.tts.speakEvenOdd(multiDigit.value, multiDigit.isEven)
      this.lastAnnouncedMultiDigit = multiDigit.value
    } catch (error) {
      console.error('TTS even/odd error:', error)
    }
  }

  private async announceExpression(
    expression: Expression,
    result: number
  ): Promise<void> {
    const expressionKey = `${expression.operand1.value}${expression.operator.value}${expression.operand2.value}=${result}`

    if (this.lastAnnouncedExpression === expressionKey) {
      return
    }

    const num1 = expression.operand1.value as number
    const op = expression.operator.value as string
    const num2 = expression.operand2.value as number

    try {
      await this.tts.speakEquation(num1, op, num2, result)
      this.lastAnnouncedExpression = expressionKey
    } catch (error) {
      console.error('TTS equation error:', error)
    }
  }

  resetExpression(): void {
    this.currentExpression = null
    this.currentResult = null
    this.lastAnnouncedExpression = null
    this.resultRenderer.hideExpression()
  }

  reset(): void {
    this.resetExpression()
    this.currentMultiDigit = null
    this.lastAnnouncedMultiDigit = null
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
