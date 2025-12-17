import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

interface UseARSystemReturn {
  isLoading: boolean
  loadingError: string | null
  arSystem: any | null
}

const useARSystem = (sceneRef: RefObject<any>): UseARSystemReturn => {
  const arSystemRef = useRef<any>(null)
  const startedRef = useRef(false)

  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    const sceneEl = sceneRef.current
    if (!sceneEl) {
      setLoadingError('Scene element not found')
      setIsLoading(false)
      return
    }

    const handleRenderStart = () => {
      const arSystem = sceneEl.systems['mindar-image-system']
      if (!arSystem || startedRef.current) return

      startedRef.current = true
      arSystemRef.current = arSystem

      arSystem.start()
      console.log('[MindAR] start called')
    }

    const handleARReady = () => {
      console.log('[MindAR] arReady')
      setIsLoading(false)
    }

    const handleARError = (event: any) => {
      console.error('[MindAR] arError', event)
      setLoadingError(
        'Khởi động AR thất bại (Lỗi thiết bị hoặc trình duyệt không được hỗ trợ)'
      )
      setIsLoading(false)
    }

    sceneEl.addEventListener('renderstart', handleRenderStart)
    sceneEl.addEventListener('arReady', handleARReady)
    sceneEl.addEventListener('arError', handleARError)

    return () => {
      sceneEl.removeEventListener('renderstart', handleRenderStart)
      sceneEl.removeEventListener('arReady', handleARReady)
      sceneEl.removeEventListener('arError', handleARError)

      if (!startedRef.current) return

      const system = arSystemRef.current

      if (system && system.video) {
        try {
          system?.stop()
          console.log('[MindAR] stopped safely')
        } catch (err) {
          console.warn('[MindAR] stop skipped', err)
        }
      }

      startedRef.current = false
      arSystemRef.current = null
    }
  }, [sceneRef])

  return {
    isLoading,
    loadingError,
    arSystem: arSystemRef.current,
  }
}

export default useARSystem
