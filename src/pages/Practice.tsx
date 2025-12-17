import { useRef } from 'react'
import ErrorModal from 'src/components/common/ErrorModal'
import MindARViewer from 'src/components/mindar/viewer'
import usePracticeMode from 'src/hooks/usePracticeMode'
import PageOverlay from 'src/components/common/PageOverlay'

const Practice = () => {
  const sceneRef = useRef(null)

  const { hasNegativeResult, resetNegativeResult } = usePracticeMode()

  const handleErrorClose = () => {
    resetNegativeResult()
  }

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden">
      <audio
        id="sound-bg"
        src="../../public/audios/home-soundtrack.mp3"
        preload="auto"
        loop
      ></audio>

      <div className="absolute inset-0 w-full h-full z-0">
        <MindARViewer sceneRef={sceneRef} />
        <video className="absolute inset-0 w-full h-full object-cover"></video>
      </div>

      <PageOverlay />

      <ErrorModal isOpen={hasNegativeResult} onClose={handleErrorClose} />
    </div>
  )
}

export default Practice
