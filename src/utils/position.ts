import type { Position, Target } from 'src/types'

export const getWorldPosition = (anchor: any): Position => {
  const worldPos = new (window as any).AFRAME.THREE.Vector3()
  anchor.object3D.getWorldPosition(worldPos)
  return { x: worldPos.x, y: worldPos.y, z: worldPos.z }
}

export const sortTargetsByX = (targets: Target[]): Target[] =>
  [...targets].sort((a, b) => a.position.x - b.position.x)

export const getDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos2.x - pos1.x
  const dy = pos2.y - pos1.y
  const dz = pos2.z - pos1.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

// Calculate distance from camera to get scale reference
export const getDistanceFromCamera = (position: Position): number => {
  const camera = document.querySelector('a-camera') as any
  if (!camera) return 1

  const camPos = new (window as any).AFRAME.THREE.Vector3()
  camera.object3D.getWorldPosition(camPos)

  const dx = position.x - camPos.x
  const dy = position.y - camPos.y
  const dz = position.z - camPos.z

  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
