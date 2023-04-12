<script lang="ts">
  import { TrackData } from '../../TrackData/TrackData'
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import BackButton from '../../UI/components/BackButton.svelte'
  import TopBar from '../../UI/components/TopBar.svelte'
  import TrackSelection from '../../UI/layouts/TrackSelection.svelte'
  import { actions } from '../../stores/app'
  import { useKeyDown } from '../../utils/useKeyDown'

  let trackDatas: TrackData[] = []

  const fetchAllTracks = async () => {
    const jsons = await import.meta.glob('../../CampaignTracks/*.json')
    console.log(jsons)
    const keys = Object.keys(jsons) as string[]
    const trackIds = keys
      .map((key) => key.split('/').pop()?.split('.').shift())
      .filter(Boolean) as string[]
    const trackDatasPromises = trackIds.map(async (trackId) => {
      const trackData = await TrackData.fromServer(trackId)
      return trackData
    })
    trackDatas = await Promise.all(trackDatasPromises)
  }

  fetchAllTracks()

  let trackSelected = false
  useKeyDown('Escape', () => {
    if (trackSelected) return
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

  <TrackSelection
    bind:trackSelected
    {trackDatas}
  />
</UiWrapper>
