import { useEffect, useState, useRef } from 'react'
import type { RefObject } from 'react'

interface UseARSystemReturn {
  isLoading: boolean
  loadingError: string | null
  arSystem: any | null
}

const useARSystem = (sceneRef: RefObject<any>): UseARSystemReturn => {
  const arSystemRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    const sceneEl = sceneRef.current

    if (!sceneEl) {
      setLoadingError('Scene element not found')
      setIsLoading(false)
      return
    }

    let started = false

    const handleRenderStart = async (): Promise<void> => {
      try {
        setIsLoading(true)
        setLoadingError(null)

        const arSystem = sceneEl.systems['mindar-image-system']

        if (!arSystem) {
          throw new Error('AR System not found')
        }

        await arSystem.start()
        arSystemRef.current = arSystem
        started = true

        console.log('AR System started')
        setIsLoading(false)
      } catch (error) {
        console.error('AR System start error:', error)
        setLoadingError(
          error instanceof Error ? error.message : 'Failed to start AR system'
        )
        setIsLoading(false)
      }
    }

    sceneEl.addEventListener('renderstart', handleRenderStart)

    return () => {
      sceneEl.removeEventListener('renderstart', handleRenderStart)

      if (started && arSystemRef.current) {
        arSystemRef.current.stop()
        console.log('AR System stopped')
      }
    }
  }, [sceneRef])

  return {
    isLoading,
    loadingError,
    arSystem: arSystemRef.current,
  }
}

export default useARSystem
