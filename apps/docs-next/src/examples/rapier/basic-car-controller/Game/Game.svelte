<script lang="ts">
  import TimeAttack from '../TimeAttack/TimeAttack.svelte'
  import TrackEditor from '../TrackEditor/TrackEditor.svelte'
  import LoadingUi from '../UI/LoadingUi.svelte'
  import { gameState } from '../stores/app'

  const { gameType, trackData } = gameState
</script>

{#if !$trackData}
  <LoadingUi />
{:else if $gameType === 'time-attack'}
  <TimeAttack trackData={$trackData} />
{:else if $gameType === 'track-editor'}
  <TrackEditor trackData={$trackData} />
{/if}
