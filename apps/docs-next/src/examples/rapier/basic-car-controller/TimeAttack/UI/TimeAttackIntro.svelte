<script lang="ts">
  import Button from '../../UI/components/Button.svelte'
  import Card from '../../UI/components/Card.svelte'
  import TopbarLayout from '../../UI/layouts/TopBarLayout.svelte'
  import { actions, gameState } from '../../stores/app'
  import { formatTime } from '../../utils/formatters'

  const { trackRecord, trackData } = gameState

  $: formattedTime = $trackRecord?.timeFormatted
</script>

<TopbarLayout>
  <Button
    slot="topbar-left"
    preventFocusOnFocusLost
    on:click={() => {
      actions.goToMainMenu()
    }}
  >
    Menu
  </Button>
  <div slot="topbar-center">
    {trackData.current?.trackName.current}
  </div>
  <Button
    slot="topbar-right"
    forceFocusOnMount
    on:click={() => {
      actions.goToCountIn()
    }}
  >
    Start
  </Button>
  <div class="absolute top-0 left-0 w-full h-full">
    <Card class="inline-block">
      {#if $trackRecord}
        <div class="mb-[10px]">Current best: {$formattedTime}</div>
      {/if}
      <div>
        AUTHOR: {formatTime(trackData.current?.trackTimes.author.current ?? 0)}<br />
        GOLD: {formatTime(trackData.current?.trackTimes.gold.current ?? 0)}<br />
        SILVER: {formatTime(trackData.current?.trackTimes.silver.current ?? 0)}<br />
        BRONZE: {formatTime(trackData.current?.trackTimes.bronze.current ?? 0)}
      </div>
    </Card>
  </div>
</TopbarLayout>
