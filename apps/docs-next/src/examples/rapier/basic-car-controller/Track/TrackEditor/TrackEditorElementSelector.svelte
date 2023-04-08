<script lang="ts">
  import { T } from '@threlte/core'
  import type { TrackElement } from '../types'
  import { useTrackEditor } from './context'

  export let trackElement: TrackElement

  const { currentlySelectedElement, isDragging } = useTrackEditor()

  $: selected = $currentlySelectedElement?.id === trackElement.id
</script>

<T.Group
  on:click={(e) => {
    e.stopPropagation()
    if ($isDragging) return
    currentlySelectedElement.set(trackElement)
  }}
  on:pointermissed={() => {
    if ($isDragging) return
    currentlySelectedElement.set(undefined)
  }}
>
  <slot {selected} />
</T.Group>
