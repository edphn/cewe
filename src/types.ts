type Position = {
  __height: string
  __left: string
  __rotation: string
  __top: string
  __width: string
  __zposition: string
}

export type Area = {
  __areatype: 'imagearea' | 'imagebackgroundarea' | 'textarea' | 'spinelogoarea' | 'spinetextarea'
  position: Position
  text?: {
    $$$cdata: string
  }
  imagebackground?: {
    __backgroundPosition: 'RIGHT_OR_BOTTOM' | 'LEFT_OR_TOP'
  }
}

export type Page = {
  __designStyleID: string,
  __pagenr: string
  __type: 'fullcover' | 'spine' | 'emptypage' | 'normalpage'
  bundlesize: {
    __height: string
    __width: string
  }
  area?: Area | Area[],
}

export type PageWithAreas = Omit<Page, 'area'> & {
  area: Area[];
};

export type Fotobook = {
  '?xml': string
  fotobook: {
    page: Page[]
  }
}
