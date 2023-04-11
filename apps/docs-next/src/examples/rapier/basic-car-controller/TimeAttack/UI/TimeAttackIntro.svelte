<script lang="ts">
  import { actions, gameState } from '../../stores/app'
  import { useKeyPress } from '../../utils/useKeyPress'

  useKeyPress('Enter', () => {
    actions.goToCountIn()
  })

  const { trackRecord } = gameState

  $: formattedTime = $trackRecord?.timeFormatted
</script>

<div class="flex flex-col justify-center items-center h-full tracking-widest uppercase">
  {#if $trackRecord}
    <div>Current best: {$formattedTime}</div>
  {/if}
  <div>PRESS ENTER TO START</div>
</div>
