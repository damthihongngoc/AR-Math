interface SlideProps {
  title: string
  items: string[]
  isActive: boolean
}

const Slide = ({ title, items, isActive }: SlideProps) => (
  <div
    className={`
      absolute inset-0 pt-[6vh] pb-[8vh] px-[6vh]
      flex flex-col justify-start items-center gap-[3vh]
      transition-all duration-300 ease-out
      ${
        isActive
          ? 'opacity-100 scale-100 translate-y-0 z-10'
          : 'opacity-0 scale-95 translate-y-[1vh] pointer-events-none z-0'
      }
    `}
  >
    <h2
      className="
        m-0
        w-[88.5vh] h-[17.15vh]
        flex items-center justify-center
        text-center
        font-alfa font-normal
        text-[5vh] text-blueprint-dark
        bg-[url('../public/images/slide_title_bg.png')]
        bg-center bg-no-repeat
      "
    >
      {title}
    </h2>
    <ul className="font-sans font-bold text-blueprint-dark leading-[1.4] max-w-[88.5vh] mx-auto list-disc text-[3.5vh]">
      {items.map((item, index) => (
        <li key={index} className="mb-[1.5vh] text-left">
          {item}
        </li>
      ))}
    </ul>
  </div>
)

export default Slide
