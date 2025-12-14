import { CircleX, Info } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Corners from 'src/components/common/Corners'
import Modal from 'src/components/common/Modal'
import ErrorModal from 'src/components/common/ErrorModal'
import MindARViewer from 'src/components/mindar/viewer'
import { GUIDE_CONTENT } from 'src/constant/modal'
import usePracticeMode from 'src/hooks/usePracticeMode'

const Practice = () => {
  const sceneRef = useRef(null)

  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [slide, setSlide] = useState(0)

  const { hasNegativeResult, resetNegativeResult } = usePracticeMode()

  const handleSlideChange = (direction: 'next' | 'prev') => {
    const totalSlides = GUIDE_CONTENT.length

    const newSlide =
      direction === 'next'
        ? (slide + 1) % totalSlides
        : (slide - 1 + totalSlides) % totalSlides

    setSlide(newSlide)
  }

  const openModal = () => {
    setIsOpen(true)
    setSlide(0)
  }

  const handleErrorClose = () => {
    resetNegativeResult()
  }

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <MindARViewer sceneRef={sceneRef} />
        <video className="absolute inset-0 w-full h-full object-cover"></video>
      </div>

      <div className="fixed top-0 left-0 right-0 p-5 flex justify-between z-50">
        <button
          className="text-white cursor-pointer transition-[all_0.3s] hover:scale-110"
          onClick={() => navigate('/')}
        >
          <CircleX size={36} />
        </button>
        <button
          className="text-white cursor-pointer transition-[all_0.3s] hover:scale-110"
          onClick={openModal}
        >
          <Info size={36} />
        </button>
      </div>

      <Corners />

      {isOpen && (
        <Modal
          currentSlide={slide}
          content={GUIDE_CONTENT}
          onClose={() => setIsOpen(false)}
          onNext={() => handleSlideChange('next')}
          onPrev={() => handleSlideChange('prev')}
        />
      )}

      <ErrorModal isOpen={hasNegativeResult} onClose={handleErrorClose} />
    </div>
  )
}

export default Practice
