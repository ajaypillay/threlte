<script lang="ts">
  import { actions, gameState } from '../../stores/app'
  import { useKeyPress } from '../../utils/useKeyPress'
  import TopbarLayout from '../../UI/layouts/TopBarLayout.svelte'
  import Card from '../../UI/components/Card.svelte'
  import BottomBar from '../../UI/components/BottomBar.svelte'
  import BackButton from '../../UI/components/BackButton.svelte'
  import { useKeyboardNavigation } from '../../UI/KeyboardNavigation.svelte'

  const { focusedElement } = useKeyboardNavigation()

  useKeyPress('Enter', () => {
    console.log('focusedElement', $focusedElement)
    if ($focusedElement) {
      return
    }
    actions.goToCountIn()
  })

  const { trackRecord, trackData } = gameState

  $: formattedTime = $trackRecord?.timeFormatted
</script>

<TopbarLayout>
  <div slot="topbar-left">
    <BackButton
      preventFocusOnFocusLost
      on:click={() => {
        actions.goToMainMenu()
      }}
    />
  </div>
  <div slot="topbar-center">
    {trackData.current?.trackName.current}
  </div>
  <div class="absolute top-0 left-0 w-full h-full">
    {#if $trackRecord}
      <div>Current best: {$formattedTime}</div>
    {/if}
    <BottomBar>
      <Card slot="center">
        <div>PRESS ENTER TO START</div>
      </Card>
    </BottomBar>
  </div>
</TopbarLayout>
