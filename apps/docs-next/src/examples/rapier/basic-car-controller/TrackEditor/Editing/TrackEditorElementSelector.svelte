<script lang="ts">
  import { T } from '@threlte/core'
  import { useTrackEditor } from './context'
  import type { TrackElement } from '../../TrackData/TrackData'
  import { gameState } from '../../stores/app'

  export let trackElement: TrackElement

  const { currentlySelectedElement, isDragging, trackData } = useTrackEditor()

  const { state } = gameState.trackEditor

  const { validated } = trackData

  $: if ($validated || $state === 'validation') {
    currentlySelectedElement.set(undefined)
  }

  $: selected = $currentlySelectedElement?.id === trackElement.id
</script>

<T.Group
  on:click={(e) => {
    e.stopPropagation()
    if ($isDragging || $validated) return
    currentlySelectedElement.set(trackElement)
  }}
  on:pointermissed={() => {
    if ($isDragging || $validated) return
    currentlySelectedElement.set(undefined)
  }}
>
  <slot {selected} />
</T.Group>
