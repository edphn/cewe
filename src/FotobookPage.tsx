import type { Area, Page, PageWithAreas } from './types.ts'
import FotobookPageArea from './FotobookPageArea.tsx'
import { Label, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { areObjectsEqual, changingAreaIsDisabled } from './support.ts'

export default function FotobookPage ({
  page,
  onUpdatePage
} : {
  page: PageWithAreas,
  onUpdatePage: (page: PageWithAreas) => void
}) {
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)

  const width = `${page.bundlesize.__width}px`
  const height = `${page.bundlesize.__height}px`

  function isAreaSelected (area: Area) {
    if (!selectedArea) {
      return false
    }

    return areObjectsEqual(selectedArea.position, area.position)
  }

  function getPageTitle (page: Page) {
    const pageNumber = parseInt(page.__pagenr, 10)

    return page.__type === 'normalpage' && pageNumber % 2 === 0
      ? `Page ${pageNumber} & ${pageNumber + 1}`
      : page.__type
  }

  function updateArea (field: keyof Area['position'], value: string) {
    if (!selectedArea) {
      return
    }

    const indexOfUpdatedArea = page.area.findIndex(area => areObjectsEqual(area.position, selectedArea.position || {}))

    const updatedArea = {
      ...selectedArea,
      position: {
        ...selectedArea.position,
        [field]: value,
      },
    }

    const updatedPage = {
      ...page,
      area: [
        ...page.area.slice(0, indexOfUpdatedArea),
        {
          ...page.area[indexOfUpdatedArea],
          ...updatedArea,
        },
        ...page.area.slice(indexOfUpdatedArea + 1),
      ],
    }

    onUpdatePage(updatedPage)
    setSelectedArea(updatedArea)
  }

  return (
    <div className="flex">
      <div
        onClick={() => setSelectedArea(null)}
        className="border border-gray-500 text-gree border-solid m-6 relative scale-25 origin-top-left"
        style={{ width, height, zoom: '0.18' }}
      >
        {page.__type === 'fullcover'
          ? (
              <>
                <div className="w-px left-[2740px] bg-gray-500 top-0 absolute" style={{height}}/>
                <div className="w-px left-[2830px] bg-gray-500 top-0 absolute" style={{height}}/>
              </>
          )
          : (
            <div className="w-px left-[2700px] bg-gray-500 top-0 absolute" style={{height}}/>
          )
        }

        {page.area.map((area, index) => (
          <FotobookPageArea
            area={area}
            pageType={page.__type}
            index={index}
            onSelect={setSelectedArea}
            isSelected={isAreaSelected(area)}
            key={index}
          />
        ))}
      </div>
      <div className="ml-8">
        <h5 className="text-xl font-medium capitalize mb-2  ">{getPageTitle(page)}</h5>
        <form>
          <div className="grid gap-2 grid-cols-2">
            <div className="mb-1 col-span-2">
              <Label htmlFor="top" value="Area Type"/>
              <TextInput
                id="top"
                type="text"
                disabled
                value={selectedArea?.__areatype ?? ''}
              />
            </div>
            <div className="mb-1">
              <Label htmlFor="top" value="Top"/>
              <TextInput
                id="top"
                type="text"
                disabled={selectedArea ? changingAreaIsDisabled(selectedArea) : false}
                value={selectedArea?.position.__top?.toString() ?? ''}
                onChange={event => updateArea('__top', event.target.value)}
              />
            </div>
            <div className="mb-1">
              <Label htmlFor="left" value="Left"/>
              <TextInput
                id="left"
                type="text"
                disabled={selectedArea ? changingAreaIsDisabled(selectedArea) : false}
                value={selectedArea?.position.__left?.toString() ?? ""}
                onChange={event => updateArea('__left', event.target.value)}
              />
            </div>
            <div className="mb-1">
              <Label htmlFor="width" value="Width"/>
              <TextInput
                id="width"
                type="text"
                disabled={selectedArea ? changingAreaIsDisabled(selectedArea) : false}
                value={selectedArea?.position.__width?.toString() ?? ""}
                onChange={event => updateArea('__width', event.target.value)}
              />
            </div>
            <div className="mb-1">
              <Label htmlFor="height" value="Height"/>
              <TextInput
                id="height"
                type="text"
                disabled={selectedArea ? changingAreaIsDisabled(selectedArea) : false}
                value={selectedArea?.position.__height?.toString() ?? ""}
                onChange={event => updateArea('__height', event.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
