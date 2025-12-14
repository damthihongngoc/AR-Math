export type TargetType = 'number' | 'operator'

export interface TargetInfo {
  type: TargetType
  value: number | string
  symbol: string
  vietnameseName: string
}

export interface Target extends TargetInfo {
  index: number
  anchor: any // A-Frame entity
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
