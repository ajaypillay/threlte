<script lang="ts">
  import { interactivity } from '@threlte/extras'
  import { gameState } from '../../stores/app'
  import { useKeyDown } from '../../useKeyDown'
  import { useKeyUp } from '../../useKeyUp'
  import type { TrackData } from '../TrackData/TrackData'
  import { createTrackEditorContext } from './context'
  import Editing from './Editing/Editing.svelte'
  import Validation from './Validation/Validation.svelte'

  export let trackData: TrackData

  const { state } = gameState.trackEditor

  interactivity()

  const { currentlySelectedElement, transformMode, transformSpace, transformSnap } =
    createTrackEditorContext(trackData)

  useKeyDown('t', () => {
    transformMode.set('translate')
  })

  useKeyDown('r', () => {
    transformMode.set('rotate')
  })

  useKeyDown('g', () => {
    transformSpace.update((space) => {
      if (space === 'local') {
        return 'world'
      } else {
        return 'local'
      }
    })
  })

  useKeyDown('Shift+D', () => {
    if (!$currentlySelectedElement) return
    const newElement = trackData.duplicateTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(newElement)
  })

  useKeyDown('Control+Backspace', () => {
    if (!$currentlySelectedElement) return
    trackData.removeTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(undefined)
  })

  useKeyDown('Shift', () => {
    transformSnap.set(true)
  })

  useKeyUp('Shift', () => {
    transformSnap.set(false)
  })
</script>

{#if $state === 'editing'}
  <Editing />
{:else if $state === 'validation'}
  <Validation />
{/if}
