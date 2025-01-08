import type { Fotobook, Page, PageWithAreas } from './types.ts'
import { useState } from 'react'
import { Button, Textarea, Label } from 'flowbite-react'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import FotobookPage from './FotobookPage.tsx'

export default function App () {
  const [ xml, setXml ] = useState('')
  const [ fotobookInJsonFormat, setFotobookInJsonFormat ] = useState<Fotobook | null>(null)
  const [ fotobookInXmlFormat, setFotobookInXmlFormat ] = useState('');

  function parseFotobookXml () {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "__",
      cdataPropName: "$$$cdata",
    });

    const data: Fotobook = parser.parse(xml)

    setFotobookInJsonFormat(data)
  }

  function exportFotobookToXml () {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: "__",
      suppressEmptyNode: true,
      format: true,
      cdataPropName: "$$$cdata"
    });

    setFotobookInXmlFormat(builder.build(fotobookInJsonFormat))
  }

  function hasAreas (page: Page): page is PageWithAreas {
    return Array.isArray(page.area)
  }

  const pages = fotobookInJsonFormat
    ? fotobookInJsonFormat.fotobook.page.filter(hasAreas)
    : []


  function updatePage (page: PageWithAreas) {
    const indexOfUpdatedPage = fotobookInJsonFormat?.fotobook.page
      .findIndex(({ __pagenr, __type  }) => __pagenr === page.__pagenr && __type === page.__type
    )

    setFotobookInJsonFormat({
      ...fotobookInJsonFormat!,
      ...{
        fotobook: {
          ...fotobookInJsonFormat!.fotobook,
          page: [
            ...fotobookInJsonFormat!.fotobook.page.slice(0, indexOfUpdatedPage),
            page,
            ...fotobookInJsonFormat!.fotobook.page.slice(indexOfUpdatedPage! + 1),
          ],
        },
      },
    })
  }

  return (
    <div className="p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="xml" value="Xml"/>
          <Textarea
            id="xml"
            rows={4}
            value={xml}
            onChange={(event) => setXml(event.target.value)}
          />
          <Button className="mt-2" color="purple" onClick={parseFotobookXml}>
            Load
          </Button>
        </div>
        <div>
          <Label htmlFor="xml" value="Exported data" />
          <Textarea
            id="xml"
            rows={4}
            readOnly
            value={fotobookInXmlFormat}
          />
          <Button color="purple" onClick={exportFotobookToXml} className="mt-2">
            Export
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {pages.map((page, index) => (
          <div key={index}>
            <FotobookPage page={page} onUpdatePage={updatePage} />
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
  )
}
