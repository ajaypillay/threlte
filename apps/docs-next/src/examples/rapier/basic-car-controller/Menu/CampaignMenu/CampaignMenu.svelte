<script lang="ts">
  import { actions } from '../../stores/app'
  import { useKeyDown } from '../../utils/useKeyDown'
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import BackButton from '../../UI/components/BackButton.svelte'
  import Button from '../../UI/components/Button.svelte'
  import TopBar from '../../UI/components/TopBar.svelte'

  let trackIds: string[] = []

  const fetchAllTracks = async () => {
    const jsons = await import.meta.glob('../../CampaignTracks/**.json')
    const keys = Object.keys(jsons) as string[]
    trackIds = keys
      .map((key) => key.split('/').pop()?.split('.').shift())
      .filter(Boolean) as string[]
  }

  fetchAllTracks()

  useKeyDown('Escape', () => {
    actions.goToMainMenu()
  })
</script>

<UiWrapper>
  <TopBar>
    <BackButton
      slot="left"
      on:click={() => {
        actions.goToMainMenu()
      }}
    >
      Back
    </BackButton>

    <p slot="center">CAMPAIGN</p>
  </TopBar>

  <div class="flex flex-col justify-center items-center h-[33vh]">
    {#each trackIds as trackId}
      <Button
        on:click={() => {
          actions.loadTrackDataFromServer(trackId, () => {
            actions.startTimeAttack()
          })
        }}
      >
        {trackId}
      </Button>
    {/each}
  </div>
</UiWrapper>
