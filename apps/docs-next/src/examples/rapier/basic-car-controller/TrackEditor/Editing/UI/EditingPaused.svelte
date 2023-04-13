<script lang="ts">
  import UiWrapper from '../../../UI/UiWrapper.svelte'
  import BackButton from '../../../UI/components/BackButton.svelte'
  import Button from '../../../UI/components/Button.svelte'
  import Card from '../../../UI/components/Card.svelte'
  import TopBarLayout from '../../../UI/layouts/TopBarLayout.svelte'
  import { actions } from '../../../stores/app'
  import SaveTrack from './SaveTrack.svelte'
  import StartTrackValidation from './StartTrackValidation.svelte'
  import TrackDetails from './TrackDetails.svelte'
</script>

<UiWrapper>
  <TopBarLayout>
    <BackButton
      slot="topbar-left"
      on:click={() => {
        actions.resumeGame()
      }}
    />

    <Button
      slot="topbar-right"
      on:click={() => {
        actions.goToMainMenu()
      }}
    >
      Main Menu
    </Button>

    <div class="flex flex-col gap-[15px]">
      <Card class="flex flex-col gap-[20px] max-w-[400px]">
        <div>Track details</div>
        <TrackDetails />
        <div class="pb-[2px]">
          <SaveTrack />
        </div>
      </Card>

      <Card class="flex flex-col gap-[20px] max-w-[400px]">
        <div>TRACK VALIDATION</div>

        <div class="text-[0.65em]">
          A track must be validated before it can be exported or played. To validate a track, it
          must be completed from start to finish.
        </div>

        <div class="pb-[2px]">
          <StartTrackValidation />
        </div>
      </Card>
    </div>
  </TopBarLayout>
</UiWrapper>
