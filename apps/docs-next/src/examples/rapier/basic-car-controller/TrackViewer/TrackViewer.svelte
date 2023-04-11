<script lang="ts">
  import type { TrackData } from '../TrackData/TrackData'

  export let trackData: TrackData
  $: elements = trackData.trackElements
</script>

{#each $elements as element (element.id)}
  <slot trackElement={element} />
{/each}
