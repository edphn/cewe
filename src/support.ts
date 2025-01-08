import type { Area } from './types.ts'

export function areObjectsEqual(object1: Record<string, any>, object2: Record<string, any>) : boolean {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  return keys1.every(key => {
    if (!keys2.includes(key)) {
      return false
    }

    const value1 = object1[key]
    const value2 = object2[key]

    if (typeof value1 === 'object' && value1 !== null && typeof value2 === 'object' && value2 !== null) {
      return areObjectsEqual(value1, value2)
    }

    return value1 === value2
  })
}

export function isImageBackgroundArea (area: Area) {
  return area.__areatype === 'imagebackgroundarea'
}

export function isTextArea (area: Area) {
  return area.__areatype === 'textarea'
}

export function changingAreaIsDisabled (area: Area) {
  return isImageBackgroundArea(area) || area.__areatype === 'spinetextarea'
}
