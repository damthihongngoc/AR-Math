import type { Position } from 'src/types'

export const createModelEntity = (
  src: string,
  position: Position = { x: 0, y: 0, z: 0 },
  scale = 0.05
): HTMLElement => {
  const el = document.createElement('a-gltf-model')
  el.setAttribute('src', src)
  el.setAttribute('rotation', '90 0 0')
  el.setAttribute('scale', `${scale} ${scale} ${scale}`)
  el.setAttribute('position', `${position.x} ${position.y} ${position.z}`)
  return el
}
