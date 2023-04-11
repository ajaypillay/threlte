<script lang="ts">
  import { actions, gameState } from '../../stores/app'
  import { getters } from '../../stores/getters'

  const { formattedTime } = getters.game.common.time

  const { trackRecord } = gameState

  $: formattedBestTime = $trackRecord?.timeFormatted
</script>

<div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
  {#if $trackRecord}
    <div>Current best: {$formattedBestTime}</div>
  {/if}
  <div>
    {$formattedTime}
  </div>
  <button
    on:click={() => {
      actions.goToMainMenu()
    }}
  >
    Main Menu
  </button>
  <button
    on:click={() => {
      actions.goToIntro()
    }}
  >
    Restart
  </button>
</div>
