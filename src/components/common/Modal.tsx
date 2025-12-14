import { CircleChevronLeft, CircleChevronRight, X } from 'lucide-react'
import { useRef } from 'react'
import Slide from 'src/components/common/Slide'
import { useOnClickOutside } from 'usehooks-ts'

type ModalProps = {
  currentSlide: number
  content: { title: string; items: string[] }[]
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

const Modal = ({
  currentSlide,
  content,
  onClose,
  onNext,
  onPrev,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null) as any

  useOnClickOutside(modalRef, onClose)

  return (
    <div className="fixed z-[1000] left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.6)] flex justify-center items-center">
      <div
        ref={modalRef}
        className="border-blueprint-dark border-[1.5vh] rounded-[7.15vh] bg-blueprint-light w-[150vh] h-[71.5vh] text-center relative"
      >
        <button
          className="absolute top-[2vh] right-[2vh] bg-none text-blueprint-dark text-[4vh] cursor-pointer z-[2000] hover:scale-110 hover:opacity-80 active:scale-95"
          onClick={onClose}
        >
          <X strokeWidth={5} />
        </button>

        <div className="relative overflow-hidden w-full h-full">
          {content.map((slide, index) => (
            <Slide
              key={index}
              title={slide.title}
              items={slide.items}
              isActive={currentSlide === index}
            />
          ))}
        </div>

        <div className="absolute top-1/2 left-0 right-0 px-[3vh] flex justify-between translate-y-[-50%] z-[2000]">
          <button
            onClick={onPrev}
            className="
            text-blueprint-dark
            transition-all duration-200 ease-out
            hover:scale-110 hover:opacity-80
            active:scale-95
          "
          >
            <CircleChevronLeft className="w-[10vh] h-[10vh]" />
          </button>
          <button
            onClick={onNext}
            className="
            text-blueprint-dark
            transition-all duration-200 ease-out
            hover:scale-110 hover:opacity-80
            active:scale-95
          "
          >
            <CircleChevronRight className="w-[10vh] h-[10vh]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
