import { CircleX, Info, Volume2, VolumeX } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Modal from 'src/components/common/Modal'
import { GUIDE_CONTENT } from 'src/constant/modal'
import AudioManager from 'src/services/audio-manager'

const PageOverlay = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audioManager = AudioManager.getInstance()
    setIsMuted(audioManager.isMutedState())

    // Subscribe to mute state changes
    const unsubscribe = audioManager.onMuteChange((muted) => {
      setIsMuted(muted)
    })

    return unsubscribe
  }, [])

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

  const handleToggleMute = () => {
    const audioManager = AudioManager.getInstance()
    audioManager.toggleMute()
  }

  return (
    <>
      {/* Góc trên */}
      <div
        className={`w-full h-[2vh] fixed top-0 left-0 bg-blueprint rounded-xl rounded-b-none`}
      ></div>
      {/* Góc dưới */}
      <div
        className={`w-full h-[2vh] fixed bottom-0 left-0 bg-blueprint rounded-xl rounded-t-none`}
      ></div>
      {/* Góc trái */}
      <div
        className={`w-[2vh] h-full fixed top-0 left-0 bg-blueprint rounded-xl rounded-r-none`}
      ></div>
      {/* Góc phải */}
      <div
        className={`w-[2vh] h-full fixed top-0 right-0 bg-blueprint rounded-xl rounded-l-none`}
      ></div>

      <div className="fixed top-0 left-0 right-0 p-5 flex justify-between z-50">
        <button
          className="text-white cursor-pointer transition-[all_0.3s] hover:scale-110"
          onClick={() => navigate('/')}
        >
          <CircleX size={36} />
        </button>

        <div className="flex items-center gap-3">
          {/* Audio Control Button */}
          <button
            className="text-white cursor-pointer transition-[all_0.3s] hover:scale-110"
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
          >
            {isMuted ? <VolumeX size={36} /> : <Volume2 size={36} />}
          </button>

          {/* Info Button */}
          <button
            className="text-white cursor-pointer transition-[all_0.3s] hover:scale-110"
            onClick={openModal}
          >
            <Info size={36} />
          </button>
        </div>
      </div>

      {isOpen && (
        <Modal
          currentSlide={slide}
          content={GUIDE_CONTENT}
          onClose={() => setIsOpen(false)}
          onNext={() => handleSlideChange('next')}
          onPrev={() => handleSlideChange('prev')}
        />
      )}
    </>
  )
}

export default PageOverlay
