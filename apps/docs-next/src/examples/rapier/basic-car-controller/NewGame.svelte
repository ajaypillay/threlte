<script lang="ts">
  import TimeAttack from './TimeAttack/TimeAttack.svelte'
  import TrackEditor from './Track/TrackEditor/TrackEditor.svelte'
  import { gameState } from './stores/app'

  const { gameType } = gameState
</script>

{#if $gameType === 'time-attack'}
  <TimeAttack />
{:else if $gameType === 'track-editor'}
  <TrackEditor />
{/if}
