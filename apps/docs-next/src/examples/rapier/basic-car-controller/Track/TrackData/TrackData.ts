import { Readable, derived } from 'svelte/store'
import type { Vector3Tuple } from 'three'
import type { trackElementPrototypes } from '../Elements/elements'
import { JsonCurrentWritable, jsonCurrentWritable } from '../jsonCurrentWritable'

type JsonCurrentReadable<T> = Readable<T> & {
  current: T
  toJSON: () => T
}

export type TrackElementType = keyof typeof trackElementPrototypes

/**
 * This provides only type-safety and will not complain if the store is actually set!
 */
const jsonCurrentReadable = <T>(
  jsonCurrentWritable: JsonCurrentWritable<T>
): JsonCurrentReadable<T> => {
  return jsonCurrentWritable
}

export class TrackElement {
  public id: string = Math.random().toString(36).substring(2, 9)
  #type: JsonCurrentWritable<TrackElementType>
  type: JsonCurrentReadable<TrackElementType>
  #position: JsonCurrentWritable<Vector3Tuple>
  position: JsonCurrentReadable<Vector3Tuple>
  #rotation: JsonCurrentWritable<[x: number, y: number, z: number, order: string]>
  rotation: JsonCurrentReadable<[x: number, y: number, z: number, order: string]>

  constructor(
    type: TrackElementType,
    position: Vector3Tuple,
    rotation: [x: number, y: number, z: number, order: string]
  ) {
    this.#type = jsonCurrentWritable(type)
    this.type = jsonCurrentReadable(this.#type)
    this.#position = jsonCurrentWritable(position)
    this.position = jsonCurrentReadable(this.#position)
    this.#rotation = jsonCurrentWritable(rotation)
    this.rotation = jsonCurrentReadable(this.#rotation)
  }

  public static fromType(type: TrackElementType) {
    return new TrackElement(type, [0, 0, 0], [0, 0, 0, 'XYZ'])
  }

  public static fromTrackElement(trackElement: TrackElement) {
    return new TrackElement(
      trackElement.type.current,
      trackElement.position.current,
      trackElement.rotation.current
    )
  }

  public static fromJSON(json: any) {
    return new TrackElement(json.type, json.position, json.rotation)
  }

  public setType(type: TrackElementType) {
    this.#type.set(type)
  }

  public setPosition(position: Vector3Tuple) {
    this.#position.set(position)
  }

  public setRotation(rotation: [x: number, y: number, z: number, order: string]) {
    this.#rotation.set(rotation)
  }
}

class TimeAttackTrackTimes {
  public author: JsonCurrentWritable<number> = jsonCurrentWritable(0)
  public gold: JsonCurrentWritable<number> = jsonCurrentWritable(0)
  public silver: JsonCurrentWritable<number> = jsonCurrentWritable(0)
  public bronze: JsonCurrentWritable<number> = jsonCurrentWritable(0)
}

class TrialTrackRespawns {
  public author: JsonCurrentWritable<number> = jsonCurrentWritable(0)
  public gold: JsonCurrentWritable<number> = jsonCurrentWritable(0)
  public silver: JsonCurrentWritable<number> = jsonCurrentWritable(0)
  public bronze: JsonCurrentWritable<number> = jsonCurrentWritable(0)
}

export class TrackData {
  trackId: string = `Track-${Math.random().toString(36).substring(2, 9)}`
  trackName: JsonCurrentWritable<string> = jsonCurrentWritable('')
  authorName: JsonCurrentWritable<string> = jsonCurrentWritable('')

  #trackElements: JsonCurrentWritable<TrackElement[]> = jsonCurrentWritable([])
  trackElements: JsonCurrentReadable<TrackElement[]> = jsonCurrentReadable(this.#trackElements)

  timeAttackTrackTimes = new TimeAttackTrackTimes()
  trialTrackRespawns = new TrialTrackRespawns()

  #validated: JsonCurrentWritable<boolean> = jsonCurrentWritable(false)
  validated: JsonCurrentReadable<boolean> = jsonCurrentReadable(this.#validated)

  public setValidated(validated: boolean) {
    this.#validated.set(validated)
    this.toLocalStorage()
  }

  #checkpointCount = jsonCurrentWritable(0)
  checkpointCount = jsonCurrentReadable(this.#checkpointCount)

  #finishCount = jsonCurrentWritable(0)
  finishCount = jsonCurrentReadable(this.#finishCount)

  public canBeValidated = derived(this.finishCount, (finishCount) => {
    return finishCount > 0
  })

  public canBeSaved = derived(
    [this.trackName, this.authorName, this.validated],
    ([trackName, authorName, validated]) => {
      return trackName.length > 0 && authorName.length > 0 && validated
    }
  )

  public static createEmpty() {
    return new TrackData()
  }

  public static async fromServer(trackId: string) {
    const text = await import(`../../Track/tracks/${trackId}.json?raw`)
    if (!text.default) throw new Error('Track not found')
    const trackData = TrackData.fromJSON(text.default)
    if (!trackData) throw new Error('Track not found')
    return trackData
  }

  public static fromJSON(json: string) {
    try {
      const data = JSON.parse(json)

      const trackData = new TrackData()

      trackData.trackId = data.trackId
      trackData.trackName.set(data.trackName)
      trackData.authorName.set(data.authorName)

      trackData.#trackElements.set(
        data.trackElements.map((trackElement: any) => TrackElement.fromJSON(trackElement))
      )

      trackData.timeAttackTrackTimes.author.set(data.timeAttackTrackTimes.author)
      trackData.timeAttackTrackTimes.gold.set(data.timeAttackTrackTimes.gold)
      trackData.timeAttackTrackTimes.silver.set(data.timeAttackTrackTimes.silver)
      trackData.timeAttackTrackTimes.bronze.set(data.timeAttackTrackTimes.bronze)

      trackData.trialTrackRespawns.author.set(data.trialTrackRespawns.author)
      trackData.trialTrackRespawns.gold.set(data.trialTrackRespawns.gold)
      trackData.trialTrackRespawns.silver.set(data.trialTrackRespawns.silver)
      trackData.trialTrackRespawns.bronze.set(data.trialTrackRespawns.bronze)

      trackData.#validated.set(data.validated)

      trackData.updateCheckpointCount()

      return trackData
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  private updateCheckpointCount() {
    const checkpointCount = this.#trackElements.current.filter((trackElement) => {
      return trackElement.type.current.startsWith('Checkpoint')
    }).length
    const finishCount = this.#trackElements.current.filter((trackElement) => {
      return trackElement.type.current.startsWith('Finish')
    }).length
    this.#checkpointCount.set(checkpointCount)
    this.#finishCount.set(finishCount)
  }

  public static fromLocalStorage(trackId: string) {
    const json = localStorage.getItem(trackId)
    if (json) {
      return TrackData.fromJSON(json)
    }
    return undefined
  }

  #timeout: ReturnType<typeof setTimeout> | undefined
  public toLocalStorage(debounce: number | false = 100) {
    if (this.#timeout) {
      clearTimeout(this.#timeout)
    }
    if (!debounce) {
      localStorage.setItem(this.trackId, this.stringify())
    } else {
      this.#timeout = setTimeout(() => {
        localStorage.setItem(this.trackId, this.stringify())
      })
    }
  }

  public static listLocalStorageTrackIds() {
    const localStorageKeys = Object.keys(localStorage)
    return localStorageKeys.filter((key) => key.startsWith('Track-'))
  }

  public export() {
    if (!this.#validated.current) {
      console.warn('Cannot export unvalidated track!')
      return
    }
    const json = this.stringify()
    const link = document.createElement('a')
    link.download = this.trackName.current + '.json'
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(json)
    link.click()
  }

  public stringify() {
    return JSON.stringify(this)
  }

  public addTrackElement(type: TrackElementType) {
    if (this.#validated.current) {
      console.warn('Cannot add track element to validated track!')
      return
    }
    const newTrackElement = TrackElement.fromType(type)
    this.#trackElements.update((trackElements) => {
      trackElements.push(newTrackElement)
      return trackElements
    })
    this.updateCheckpointCount()
    this.toLocalStorage()
    return newTrackElement
  }

  public removeTrackElement(id: string) {
    if (this.#validated.current) {
      console.warn('Cannot remove track element from validated track!')
      return
    }
    this.#trackElements.update((trackElements) => {
      return trackElements.filter((trackElement) => trackElement.id !== id)
    })
    this.updateCheckpointCount()
    this.toLocalStorage()
  }

  public duplicateTrackElement(id: string) {
    if (this.#validated.current) {
      console.warn('Cannot duplicate track element of validated track!')
      return
    }
    const trackElementToDuplicate = this.#trackElements.current.find(
      (trackElement) => trackElement.id === id
    )
    if (!trackElementToDuplicate) {
      console.warn('Cannot duplicate track element that does not exist!')
      return
    }
    const newTrackElement = TrackElement.fromTrackElement(trackElementToDuplicate)
    this.#trackElements.update((trackElements) => {
      trackElements.push(newTrackElement)
      return trackElements
    })
    this.updateCheckpointCount()
    this.toLocalStorage()
    return newTrackElement
  }

  public setTrackElementType = (id: string, type: TrackElementType) => {
    if (this.#validated.current) {
      console.warn('Cannot set track element type of validated track!')
      return
    }
    this.#trackElements.update((trackElements) => {
      const trackElement = trackElements.find((trackElement) => trackElement.id === id)
      if (trackElement) {
        trackElement.setType(type)
      }
      return trackElements
    })
    this.updateCheckpointCount()
    this.toLocalStorage()
  }

  public setTrackElementPosition = (id: string, position: Vector3Tuple) => {
    if (this.#validated.current) {
      console.warn('Cannot set track element position of validated track!')
      return
    }
    this.#trackElements.update((trackElements) => {
      const trackElement = trackElements.find((trackElement) => trackElement.id === id)
      if (trackElement) {
        trackElement.setPosition(position)
      }
      return trackElements
    })
    this.toLocalStorage()
  }

  public setTrackElementRotation = (
    id: string,
    rotation: [x: number, y: number, z: number, order: string]
  ) => {
    if (this.#validated.current) {
      console.warn('Cannot set track element rotation of validated track!')
      return
    }
    this.#trackElements.update((trackElements) => {
      const trackElement = trackElements.find((trackElement) => trackElement.id === id)
      if (trackElement) {
        trackElement.setRotation(rotation)
      }
      return trackElements
    })
    this.toLocalStorage()
  }
}
