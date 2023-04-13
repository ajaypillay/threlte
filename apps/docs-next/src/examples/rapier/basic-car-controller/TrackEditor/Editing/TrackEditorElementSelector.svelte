<script lang="ts">
  import { T } from '@threlte/core'
  import { useTrackEditor } from './context'
  import type { TrackElement } from '../../TrackData/TrackData'
  import { gameState } from '../../stores/app'

  export let trackElement: TrackElement

  const { currentlySelectedElement, isDragging, trackData } = useTrackEditor()

  const { paused } = gameState
  const { state } = gameState.trackEditor

  const { validated } = trackData

  $: if ($validated || $state === 'validation' || $paused) {
    currentlySelectedElement.set(undefined)
  }

  $: selected = $currentlySelectedElement?.id === trackElement.id
</script>

<T.Group
  on:click={(e) => {
    e.stopPropagation()
    if ($isDragging || $validated || $paused) return
    currentlySelectedElement.set(trackElement)
  }}
  on:pointermissed={() => {
    if ($isDragging || $validated || $paused) return
    currentlySelectedElement.set(undefined)
  }}
>
  <slot {selected} />
</T.Group>
