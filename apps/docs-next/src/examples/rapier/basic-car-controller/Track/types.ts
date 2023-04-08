import type { Vector3Tuple } from 'three'
import type { trackElementPrototypes } from './Elements/elements'
import type { JsonCurrentWritable } from './jsonCurrentWritable'

export type ElementConfiguration = {
  component: any
  name: string
  buttonSvgSource: string
}

export type ElementConfigurations = ElementConfiguration[]

/**
 * The track data is a list of elements that are placed on the track.
 */

export type TrackElementType = keyof typeof trackElementPrototypes

export type TrackElement = {
  id: string
  type: JsonCurrentWritable<TrackElementType>
  position: JsonCurrentWritable<Vector3Tuple>
  rotation: JsonCurrentWritable<[x: number, y: number, z: number, order: string]>
}

export type TrackTimes = {
  author: JsonCurrentWritable<number>
  gold: JsonCurrentWritable<number>
  silver: JsonCurrentWritable<number>
  bronze: JsonCurrentWritable<number>
}

export type TrackData = {
  trackId: string
  trackName: JsonCurrentWritable<string>
  authorName: JsonCurrentWritable<string>
  times: TrackTimes
  elements: JsonCurrentWritable<TrackElement[]>
}
