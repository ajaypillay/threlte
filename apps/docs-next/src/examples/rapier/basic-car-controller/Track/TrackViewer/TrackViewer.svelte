<script lang="ts">
  import type { TrackData } from '../types'

  export let trackData: TrackData
  $: elements = trackData.elements
</script>

{#each $elements as element (element.id)}
  <slot trackElement={element} />
{/each}
