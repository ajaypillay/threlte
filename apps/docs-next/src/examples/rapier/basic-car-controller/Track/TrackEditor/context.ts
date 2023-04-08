import { CurrentWritable, currentWritable } from '@threlte/core'
import type { TrackData, TrackElement } from '../types'
import { getContext, setContext } from 'svelte'

type TrackEditorContext = {
  transformMode: CurrentWritable<'translate' | 'rotate'>
  transformSpace: CurrentWritable<'local' | 'world'>
  transformSnap: CurrentWritable<boolean>
  isDragging: CurrentWritable<boolean>
  trackData: TrackData
  currentlySelectedElement: CurrentWritable<TrackElement | undefined>
}

export const createTrackEditorContext = (trackData: TrackData) => {
  const context: TrackEditorContext = {
    transformMode: currentWritable('translate'),
    transformSpace: currentWritable('local'),
    transformSnap: currentWritable(false),
    isDragging: currentWritable(false),
    trackData,
    currentlySelectedElement: currentWritable(undefined)
  }

  setContext<TrackEditorContext>('track-editor-context', context)

  return context
}

export const useTrackEditor = () => {
  const context = getContext<TrackEditorContext>('track-editor-context')
  if (!context) {
    throw new Error('No track editor context found')
  }
  return context
}
