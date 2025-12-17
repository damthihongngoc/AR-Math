import { TARGET_TYPES } from 'src/constant/target'

export const numberToVietnamese = (num: number): string => {
  if (num < 0) return 'âm ' + numberToVietnamese(Math.abs(num))
  if (num < 10) return TARGET_TYPES[num]?.vietnameseName || String(num)
  if (num < 20) {
    const ones = num % 10
    return `mười ${
      ones === 0 ? '' : ones === 5 ? 'lăm' : TARGET_TYPES[ones].vietnameseName
    }`
  }
  if (num < 100) {
    const tens = Math.floor(num / 10)
    const ones = num % 10
    let result = TARGET_TYPES[tens].vietnameseName + ' mươi'
    if (ones > 0) {
      result +=
        ' ' +
        (ones === 5 && tens > 1 ? 'lăm' : TARGET_TYPES[ones].vietnameseName)
    }
    return result
  }
  return String(num)
}

export const operatorToVietnamese = (operator: string): string => {
  switch (operator) {
    case '+':
      return 'cộng'
    case '-':
      return 'trừ'
    case '*':
      return 'nhân'
    case '/':
      return 'chia'
    default:
      return operator
  }
}
