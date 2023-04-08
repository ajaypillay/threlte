<script lang="ts">
  import TimeAttack from './TimeAttack/TimeAttack.svelte'
  import { gameState } from './stores/app'

  const { gameType } = gameState
</script>

{#if $gameType === 'time-attack'}
  <TimeAttack />
{/if}
