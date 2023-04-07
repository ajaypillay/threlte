import type { CurrentWritable } from '@threlte/core'
import type { Vector3Tuple } from 'three'

export type ElementConfiguration = {
  component: any
  name: string
  buttonSvgSource: string
}

export type ElementConfigurations = ElementConfiguration[]
