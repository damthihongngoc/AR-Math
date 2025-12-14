import type { Target, TargetConfig } from 'src/types'
import { getWorldPosition } from 'src/utils/position'

export class TargetManager {
  private activeTargets: Map<number, Target>
  private targetTypes: TargetConfig
  private announcedTargets: Set<number>

  constructor(targetTypes: TargetConfig) {
    this.activeTargets = new Map()
    this.targetTypes = targetTypes
    this.announcedTargets = new Set()
  }

  addTarget(index: number, anchor: any, onUpdate?: () => void): boolean {
    const wasNew = !this.activeTargets.has(index)
    const info = this.targetTypes[index]
    this.activeTargets.set(index, {
      index,
      anchor,
      type: info.type,
      value: info.value,
      symbol: info.symbol,
      vietnameseName: info.vietnameseName,
      position: getWorldPosition(anchor),
    })
    if (onUpdate) onUpdate()
    return wasNew && !this.announcedTargets.has(index)
  }

  removeTarget(index: number, onUpdate?: () => void): void {
    if (!this.activeTargets.has(index)) return
    this.activeTargets.delete(index)
    this.announcedTargets.delete(index)
    if (onUpdate) onUpdate()
  }

  updateTargetPosition(index: number, anchor: any): void {
    if (!this.activeTargets.has(index)) return
    const target = this.activeTargets.get(index)
    if (target) {
      target.position = getWorldPosition(anchor)
    }
  }

  markAsAnnounced(index: number): void {
    this.announcedTargets.add(index)
  }

  getTargets(): Target[] {
    return Array.from(this.activeTargets.values())
  }

  getTargetCount(): number {
    return this.activeTargets.size
  }

  getActiveTargetsMap(): Map<number, Target> {
    return this.activeTargets
  }
}
