import type { TrackData, TrackElement, TrackElementType } from '../../types'
import { jsonCurrentWritable } from '../../jsonCurrentWritable'

let saveDebounceTimeout: ReturnType<typeof setTimeout> | undefined

export const trackDataUtils = {
  parseTrackData: (json: string): TrackData => {
    const data = JSON.parse(json)
    const elements = data.elements.map((element: any): TrackElement => {
      return {
        id: element.id,
        type: jsonCurrentWritable(element.type),
        position: jsonCurrentWritable(element.position),
        rotation: jsonCurrentWritable(element.rotation)
      }
    })

    const trackData: TrackData = {
      trackId: data.trackId,
      trackName: jsonCurrentWritable(data.trackName),
      authorName: jsonCurrentWritable(data.authorName),
      times: {
        author: jsonCurrentWritable(data.times.author),
        gold: jsonCurrentWritable(data.times.gold),
        silver: jsonCurrentWritable(data.times.silver),
        bronze: jsonCurrentWritable(data.times.bronze)
      },
      elements: jsonCurrentWritable(elements)
    }

    return trackData
  },

  stringifyTrackData: (trackData: TrackData): string => {
    const json = JSON.stringify(trackData, null, 2)
    return json
  },

  loadTrackDataFromLocalStorage: (trackId: string): TrackData | undefined => {
    const json = localStorage.getItem(trackId)
    if (json) {
      return trackDataUtils.parseTrackData(json)
    }
    return undefined
  },

  saveTrackDataToLocalStorage: (trackData: TrackData, debounce = 200): void => {
    if (debounce === 0) {
      const json = trackDataUtils.stringifyTrackData(trackData)
      localStorage.setItem(trackData.trackId, json)
    } else {
      clearTimeout(saveDebounceTimeout)
      saveDebounceTimeout = setTimeout(() => {
        const json = trackDataUtils.stringifyTrackData(trackData)
        localStorage.setItem(trackData.trackId, json)
      }, debounce)
    }
  },

  addElement: (trackData: TrackData, type: TrackElementType, save = true): TrackElement => {
    const element: TrackElement = {
      id: Math.random().toString(36).substring(2, 9),
      type: jsonCurrentWritable(type),
      position: jsonCurrentWritable([0, 0, 0]),
      rotation: jsonCurrentWritable([0, 0, 0, 'XYZ'])
    }
    trackData.elements.update((elements) => [...elements, element])
    if (save) trackDataUtils.saveTrackDataToLocalStorage(trackData)
    return element
  },

  removeElement: (trackData: TrackData, elementId: string, save = true): void => {
    trackData.elements.update((elements) => elements.filter((element) => element.id !== elementId))
    if (save) trackDataUtils.saveTrackDataToLocalStorage(trackData)
  },

  duplicateElement: (
    trackData: TrackData,
    elementId: string,
    save = true
  ): TrackElement | undefined => {
    const element = trackData.elements.current.find((element) => element.id === elementId)
    if (!element) return
    const newElement: TrackElement = {
      id: Math.random().toString(36).substring(2, 9),
      type: jsonCurrentWritable(element.type.current),
      position: jsonCurrentWritable(element.position.current),
      rotation: jsonCurrentWritable(element.rotation.current)
    }
    trackData.elements.update((elements) => [...elements, newElement])
    if (save) trackDataUtils.saveTrackDataToLocalStorage(trackData)
    return newElement
  },

  updateElementType: (
    trackData: TrackData,
    elementId: string,
    type: TrackElementType,
    save = true
  ): void => {
    trackData.elements.update((elements) =>
      elements.map((element) => {
        if (element.id === elementId) {
          element.type.set(type)
        }
        return element
      })
    )
    if (save) trackDataUtils.saveTrackDataToLocalStorage(trackData)
  },

  updateElementPosition: (
    trackData: TrackData,
    elementId: string,
    position: TrackElement['position']['current'],
    save = true
  ): void => {
    trackData.elements.update((elements) =>
      elements.map((element) => {
        if (element.id === elementId) {
          element.position.set(position)
        }
        return element
      })
    )
    if (save) trackDataUtils.saveTrackDataToLocalStorage(trackData)
  },

  updateElementRotation: (
    trackData: TrackData,
    elementId: string,
    rotation: TrackElement['rotation']['current'],
    save = true
  ): void => {
    trackData.elements.update((elements) =>
      elements.map((element) => {
        if (element.id === elementId) {
          element.rotation.set(rotation)
        }
        return element
      })
    )
    if (save) trackDataUtils.saveTrackDataToLocalStorage(trackData)
  },

  updateTrackDetails: (
    trackData: TrackData,
    details: {
      trackName?: string
      authorName?: string
      times?: {
        author?: number
        gold?: number
        silver?: number
        bronze?: number
      }
    }
  ): void => {
    if (details.trackName) trackData.trackName.set(details.trackName)
    if (details.authorName) trackData.authorName.set(details.authorName)
    if (details.times) {
      if (details.times.author !== undefined) trackData.times.author.set(details.times.author)
      if (details.times.gold !== undefined) trackData.times.gold.set(details.times.gold)
      if (details.times.silver !== undefined) trackData.times.silver.set(details.times.silver)
      if (details.times.bronze !== undefined) trackData.times.bronze.set(details.times.bronze)
    }
    trackDataUtils.saveTrackDataToLocalStorage(trackData)
  }
}
