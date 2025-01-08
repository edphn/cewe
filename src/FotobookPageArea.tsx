import type { Area, PageWithAreas } from './types.ts'
import { clsx } from 'clsx'
import { isImageBackgroundArea, isTextArea } from './support.ts'

const colors = [
  'bg-green-300',
  'bg-blue-300',
  'bg-pink-300',
  'bg-orange-300',
  'bg-yellow-300',
  'bg-indigo-300',
  'bg-green-400',
  'bg-blue-400',
  'bg-pink-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-indigo-400',
  'bg-green-500',
  'bg-blue-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-indigo-500',
]

function getLeftValue (area: Area, pageType: PageWithAreas['__type']) {
  if (isImageBackgroundArea(area) && area.imagebackground?.__backgroundPosition === 'RIGHT_OR_BOTTOM') {
    return pageType === 'fullcover'
      ? '2830px'
      : '2700px'
  }

  return `${area.position.__left}px`
}

export default function FotobookPageArea ({
  area,
  pageType,
  isSelected,
  onSelect,
  index
}: {
  area: Area
  pageType: PageWithAreas['__type']
  isSelected: boolean
  onSelect: (area: Area) => void
  index: number
}) {
  const top = `${area.position.__top}px`
  const width = `${area.position.__width}px`
  const height = `${area.position.__height}px`
  const left = getLeftValue(area, pageType)

  return (
    <div
      onClick={event => {
        event.stopPropagation()
        onSelect(area)
      }}
      className={clsx(
        'absolute',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'cursor-pointer',
        'bg-opacity-50',
        isImageBackgroundArea(area) ? 'bg-gray-200' : colors[index],
        isSelected && 'outline-[12px] outline-dashed outline-red-500',
      )}
      style={{left, top, height, width}}
    >
      {!isTextArea(area) && (
        <div className="text-7xl mb-20">
          <div className="top-[50px] absolute">{top}</div>
          <div className="left-[50px] top-[50%] absolute">{left}</div>
        </div>
      )}

      {isImageBackgroundArea(area) && (<div className="opacity-20 text-7xl -translate-y-[100px]">BACKGROUND</div>)}
      {!isTextArea(area) && (
        <div className="text-7xl">{width} x {height}</div>
      )}
      {isTextArea(area) && <div style={{ zoom: '3' }} dangerouslySetInnerHTML={{ __html: area.text!.$$$cdata }} />}
    </div>
  )
}
