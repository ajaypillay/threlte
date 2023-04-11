<script lang="ts">
  import type { TrackData } from '../TrackData/TrackData'
  import { gameState } from '../stores/app'
  import Editing from './Editing/Editing.svelte'
  import Validation from './Validation/Validation.svelte'

  export let trackData: TrackData

  const { state } = gameState.trackEditor
</script>

{#if $state === 'editing'}
  <Editing {trackData} />
{:else if $state === 'validation'}
  <Validation {trackData} />
{/if}
