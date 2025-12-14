export type TargetType = 'number' | 'operator'

export interface TargetInfo {
  type: TargetType
  value: number | string
  symbol: string
  vietnameseName: string
}

export interface Target extends TargetInfo {
  index: number
  anchor: any
  position: Position
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface Expression {
  operand1: Target
  operator: Target
  operand2: Target
}

export interface MultiDigitNumber {
  digits: Target[]
  value: number
  isEven: boolean
}

export interface TargetConfig {
  [key: number]: TargetInfo
}

export interface ResultModels {
  [key: string]: string
}

// ============================================
// constants/targetConfig.ts
// ============================================
export const TARGET_TYPES: TargetConfig = {
  0: { type: 'number', value: 0, symbol: '0', vietnameseName: 'không' },
  1: { type: 'number', value: 1, symbol: '1', vietnameseName: 'một' },
  2: { type: 'number', value: 2, symbol: '2', vietnameseName: 'hai' },
  3: { type: 'number', value: 3, symbol: '3', vietnameseName: 'ba' },
  4: { type: 'number', value: 4, symbol: '4', vietnameseName: 'bốn' },
  5: { type: 'number', value: 5, symbol: '5', vietnameseName: 'năm' },
  6: { type: 'number', value: 6, symbol: '6', vietnameseName: 'sáu' },
  7: { type: 'number', value: 7, symbol: '7', vietnameseName: 'bảy' },
  8: { type: 'number', value: 8, symbol: '8', vietnameseName: 'tám' },
  9: { type: 'number', value: 9, symbol: '9', vietnameseName: 'chín' },
  10: { type: 'operator', value: '+', symbol: '+', vietnameseName: 'cộng' },
  11: { type: 'operator', value: '-', symbol: '-', vietnameseName: 'trừ' },
  12: { type: 'operator', value: '*', symbol: '×', vietnameseName: 'nhân' },
  13: { type: 'operator', value: '/', symbol: '÷', vietnameseName: 'chia' },
}

export const RESULT_MODELS: ResultModels = {
  0: '#zeroModel',
  1: '#oneModel',
  2: '#twoModel',
  3: '#threeModel',
  4: '#fourModel',
  5: '#fiveModel',
  6: '#sixModel',
  7: '#sevenModel',
  8: '#eightModel',
  9: '#nineModel',
  minus: '#minusModel',
}

export const MULTI_DIGIT_THRESHOLD_RATIO = 0.3
