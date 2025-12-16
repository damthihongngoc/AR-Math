import type { MultiDigitNumber, ResultModels } from 'src/types'
import { createModelEntity } from 'src/utils/model-factory'

export class ResultRenderer {
  private resultModels: ResultModels
  private currentDisplayedResult: number | null
  private currentDisplayedMultiDigit: number | null

  constructor(resultModels: ResultModels) {
    this.resultModels = resultModels
    this.currentDisplayedResult = null
    this.currentDisplayedMultiDigit = null
  }

  displayExpressionResult(result: number): void {
    const equalEl = document.getElementById('virtual-equal') as any
    const resultEl = document.getElementById('virtual-result') as any
    if (!equalEl || !resultEl) return

    if (this.currentDisplayedResult === result) return

    this.clearExpression()
    this.renderModels(resultEl, result)

    this.currentDisplayedResult = result
    equalEl.object3D.visible = true
    resultEl.object3D.visible = true
  }

  displayMultiDigitNumber(multiDigit: MultiDigitNumber): void {
    if (this.currentDisplayedMultiDigit === multiDigit.value) return

    const { value, isEven } = multiDigit
    const message = `${value} là ${isEven ? 'số chẵn' : 'số lẻ'}`

    // AppToast.success(message)

    this.currentDisplayedMultiDigit = value
  }

  private renderModels(resultEl: HTMLElement, result: number): void {
    const digits = String(Math.abs(result)).split('')

    digits.forEach((d, i) => {
      const model = createModelEntity(this.resultModels[d], {
        x: i * 0.6,
        y: 0,
        z: 0,
      })
      resultEl.appendChild(model)
    })

    if (result < 0) {
      const minus = createModelEntity(this.resultModels.minus, {
        x: -0.6,
        y: 0,
        z: 0,
      })
      resultEl.insertBefore(minus, resultEl.firstChild)
    }
  }

  private clearExpression(): void {
    const resultEl = document.getElementById('virtual-result')
    if (!resultEl) return

    while (resultEl.firstChild) {
      resultEl.removeChild(resultEl.firstChild)
    }
  }

  hideExpression(): void {
    const equalEl = document.getElementById('virtual-equal') as any
    const resultEl = document.getElementById('virtual-result') as any

    if (equalEl?.object3D) equalEl.object3D.visible = false
    if (resultEl?.object3D) {
      resultEl.object3D.visible = false
      this.clearExpression()
      this.currentDisplayedResult = null
    }
  }

  hideAll(): void {
    this.hideExpression()
  }
}
