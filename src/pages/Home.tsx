import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from 'src/components/common/Button'
import Modal from 'src/components/common/Modal'
import { ABOUT_CONTENT, GUIDE_CONTENT } from 'src/constant/modal'

type ModalType = 'guide' | 'about' | null

const Home = () => {
  const navigate = useNavigate()
  const [modal, setModal] = useState<ModalType>(null)
  const [guideSlide, setGuideSlide] = useState(0)
  const [aboutSlide, setAboutSlide] = useState(0)

  const handleSlideChange = (type: ModalType, direction: 'next' | 'prev') => {
    const isGuide = type === 'guide'
    const currentSlide = isGuide ? guideSlide : aboutSlide
    const totalSlides = isGuide ? GUIDE_CONTENT.length : ABOUT_CONTENT.length
    const setSlide = isGuide ? setGuideSlide : setAboutSlide

    const newSlide =
      direction === 'next'
        ? (currentSlide + 1) % totalSlides
        : (currentSlide - 1 + totalSlides) % totalSlides

    setSlide(newSlide)
  }

  const openModal = (type: ModalType) => {
    setModal(type)
    if (type === 'guide') setGuideSlide(0)
    else setAboutSlide(0)
  }

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] pt-[4.5vh]">
      <div className="flex flex-col justify-center items-center">
        <img
          className="w-[30vh] h-auto mb-[-3.4vh] z-[1000]"
          src="/images/math_title.png"
          alt="Math Title"
        />
        <h1 className="m-0 text-[8.3vh] text-white font-bernoru [text-shadow:0.7vh_0.7vh_0_rgba(255,255,255,0.4)]">
          AR MATH
        </h1>
      </div>

      <div className="flex flex-col gap-[3vh] mt-[3vh] justify-center items-center">
        <Button onClick={() => navigate('/practice')}>LUYỆN TẬP</Button>
        <Button onClick={() => navigate('/quiz')}>KIỂM TRA</Button>
        <Button onClick={() => openModal('guide')}>HƯỚNG DẪN</Button>
        <Button onClick={() => openModal('about')}>GIỚI THIỆU</Button>
      </div>

      {modal === 'guide' && (
        <Modal
          currentSlide={guideSlide}
          content={GUIDE_CONTENT}
          onClose={() => setModal(null)}
          onNext={() => handleSlideChange('guide', 'next')}
          onPrev={() => handleSlideChange('guide', 'prev')}
        />
      )}

      {modal === 'about' && (
        <Modal
          currentSlide={aboutSlide}
          content={ABOUT_CONTENT}
          onClose={() => setModal(null)}
          onNext={() => handleSlideChange('about', 'next')}
          onPrev={() => handleSlideChange('about', 'prev')}
        />
      )}
    </div>
  )
}

export default Home
