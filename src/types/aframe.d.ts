/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        mindarImage?: string
        colorSpace?: string
        embedded?: boolean
        renderer?: string
        'vr-mode-ui'?: string
        'device-orientation-permission-ui'?: string
      }
      'a-assets': any
      'a-asset-item': any
      'a-entity': any
      'a-gltf-model': any
      'a-camera': any
    }
  }
}
