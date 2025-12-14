import { Outlet } from 'react-router'

interface OverlayItem {
  id: string
  src: string
  type: 'formula' | 'operator'
  width: string
  rotate?: number
}

interface OverlaySection {
  position: 'top' | 'right' | 'bottom' | 'left'
  items: (OverlayItem | OverlayItem[])[]
}

const overlayData: OverlaySection[] = [
  {
    position: 'top',
    items: [
      {
        id: 'math_formula_01',
        src: 'math_formula_01.png',
        type: 'formula',
        width: '13vh',
      },
      {
        id: 'op_infinite',
        src: 'op_infinite.png',
        type: 'operator',
        width: '28vh',
        rotate: -8,
      },
      {
        id: 'math_formula_02',
        src: 'math_formula_02.png',
        type: 'formula',
        width: '33vh',
        rotate: 10,
      },
      {
        id: 'op_equal',
        src: 'op_equal.png',
        type: 'operator',
        width: '18vh',
        rotate: 15,
      },
      {
        id: 'math_formula_03',
        src: 'math_formula_03.png',
        type: 'formula',
        width: '15vh',
      },
    ],
  },
  {
    position: 'right',
    items: [
      {
        id: 'op_multiply',
        src: 'op_multiply.png',
        type: 'operator',
        width: '28vh',
      },
      {
        id: 'math_formula_04',
        src: 'math_formula_04.png',
        type: 'formula',
        width: '28vh',
        rotate: -6,
      },
      [
        {
          id: 'math_formula_05',
          src: 'math_formula_05.png',
          type: 'formula',
          width: '13vh',
        },
        {
          id: 'op_question_mark',
          src: 'op_question_mark.png',
          type: 'operator',
          width: '15vh',
          rotate: 10,
        },
      ],
      [
        {
          id: 'math_formula_06',
          src: 'math_formula_06.png',
          type: 'formula',
          width: '16vh',
          rotate: -25,
        },
        {
          id: 'op_lower_than',
          src: 'op_lower_than.png',
          type: 'operator',
          width: '18vh',
        },
      ],
    ],
  },
  {
    position: 'bottom',
    items: [
      {
        id: 'math_formula_07',
        src: 'math_formula_07.png',
        type: 'formula',
        width: '13vh',
      },
      {
        id: 'op_mod',
        src: 'op_mod.png',
        type: 'operator',
        width: '14vh',
        rotate: -10,
      },
    ],
  },
  {
    position: 'left',
    items: [
      {
        id: 'op_divide',
        src: 'op_divide.png',
        type: 'operator',
        width: '18vh',
        rotate: 13,
      },
      {
        id: 'math_formula_11',
        src: 'math_formula_11.png',
        type: 'formula',
        width: '20vh',
        rotate: -5,
      },
      {
        id: 'op_plus',
        src: 'op_plus.png',
        type: 'operator',
        width: '18vh',
        rotate: 8,
      },
      [
        {
          id: 'math_formula_10',
          src: 'math_formula_10.png',
          type: 'formula',
          width: '16vh',
          rotate: 13,
        },
        {
          id: 'math_formula_09',
          src: 'math_formula_09.png',
          type: 'formula',
          width: '16vh',
          rotate: 25,
        },
      ],
      [
        {
          id: 'std_tool_kit',
          src: 'std_tool_kit.png',
          type: 'operator',
          width: '28vh',
          rotate: -20,
        },
        {
          id: 'math_formula_08',
          src: 'math_formula_08.png',
          type: 'formula',
          width: '25vh',
        },
      ],
    ],
  },
]

const positionStyles = {
  top: 'top-0 left-0 right-0 flex-row justify-center pt-[3vh] gap-[10vh]',
  right: 'top-0 right-0 bottom-0 flex-col justify-around items-end pr-[3vh]',
  bottom: 'bottom-0 right-[18%] flex-row justify-center pb-[1.5vh] gap-[7vh]',
  left: 'top-0 left-0 bottom-0 flex-col justify-around !items-start pl-[3vh]',
}

const AppLayout = () => {
  const renderItem = (item: OverlayItem) => (
    <img
      key={item.id}
      id={item.id}
      src={`/images/${item.src}`}
      alt={item.id}
      className={`h-auto ${
        item.type === 'formula' ? 'opacity-70' : 'opacity-60'
      }`}
      style={{
        width: item.width,
        transform: item.rotate ? `rotate(${item.rotate}deg)` : undefined,
      }}
    />
  )

  const renderItems = (items: (OverlayItem | OverlayItem[])[]) => {
    return items.map((item, index) => {
      if (Array.isArray(item)) {
        return (
          <div key={`group-${index}`} className="flex items-center gap-5">
            {item.map(renderItem)}
          </div>
        )
      }
      return renderItem(item)
    })
  }

  return (
    <div className="bg-blueprint">
      <div className="absolute inset-0 pointer-events-none [filter:drop-shadow(6px_6px_4px_rgba(0,0,0,0.5))]">
        {overlayData.map((section) => (
          <div
            key={section.position}
            className={`absolute flex items-center ${
              positionStyles[section.position]
            }`}
          >
            {renderItems(section.items)}
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  )
}

export default AppLayout
