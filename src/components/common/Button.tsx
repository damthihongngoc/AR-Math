type ButtonProps = {
  onClick?: () => void
  children: React.ReactNode
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-[50vh] h-[11.5vh]
        text-[5vh] font-alfa
        rounded-[4vh]
        border-0
        bg-blueprint-light text-blueprint-dark

        transition-[transform,box-shadow,background-color]
        duration-[250ms] ease-out

        hover:-translate-y-[0.6vh]
        hover:scale-[1.05]
        hover:bg-blueprint-soft
        hover:shadow-[0_0_2vh_rgba(194,220,255,0.8),0_0_4vh_rgba(194,220,255,0.6)]

        active:translate-y-[0.3vh]
        active:scale-[0.97]
        active:shadow-[inset_0_0_1vh_rgba(0,0,0,0.4)]
      "
    >
      {children}
    </button>
  )
}

export default Button
