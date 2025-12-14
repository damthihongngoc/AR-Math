import { MULTI_DIGIT_THRESHOLD_RATIO } from 'src/constant/target'
import type { Expression, MultiDigitNumber, Target } from 'src/types'
import {
  getDistance,
  getDistanceFromCamera,
  sortTargetsByX,
} from 'src/utils/position'

export const isValidExpression = (targets: Target[]): Expression | null => {
  if (targets.length < 3) return null
  const [first, second, third] = targets
  if (
    first.type === 'number' &&
    second.type === 'operator' &&
    third.type === 'number'
  ) {
    return { operand1: first, operator: second, operand2: third }
  }
  return null
}

export const calculateResult = (expression: Expression): number | null => {
  const a = expression.operand1.value as number
  const b = expression.operand2.value as number
  const operator = expression.operator.value as string

  switch (operator) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return b !== 0 ? Math.floor(a / b) : null
    default:
      return null
  }
}

export const findMultiDigitNumbers = (
  targets: Target[]
): MultiDigitNumber[] => {
  const numbers = targets.filter((t) => t.type === 'number')
  const sorted = sortTargetsByX(numbers)
  const multiDigits: MultiDigitNumber[] = []

  console.log('Finding multi-digit from', sorted.length, 'numbers')

  let i = 0
  while (i < sorted.length) {
    const current = sorted[i]
    const next = sorted[i + 1]

    if (next) {
      const distance = getDistance(current.position, next.position)

      // Get distance from camera for scale reference
      const cameraDistance = getDistanceFromCamera(current.position)
      const threshold = cameraDistance * MULTI_DIGIT_THRESHOLD_RATIO

      console.log(
        `Distance between ${current.value} and ${next.value}:`,
        distance.toFixed(2)
      )
      console.log(
        `Camera distance: ${cameraDistance.toFixed(
          2
        )}, Dynamic threshold: ${threshold.toFixed(2)}`
      )

      if (distance < threshold) {
        const value = (current.value as number) * 10 + (next.value as number)
        console.log(`✓ Found multi-digit: ${value}`)
        multiDigits.push({
          digits: [current, next],
          value,
          isEven: value % 2 === 0,
        })
        i += 2 // Skip both numbers
        continue
      } else {
        console.log(
          `✗ Too far apart (${distance.toFixed(2)} > ${threshold.toFixed(2)})`
        )
      }
    }
    i++
  }

  return multiDigits
}
