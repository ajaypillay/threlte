<script lang="ts">
  import { fade } from 'svelte/transition'
  import { actions } from '../../stores/app'
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import Button from '../../UI/components/Button.svelte'
</script>

<UiWrapper>
  <div
    in:fade
    class="flex flex-col justify-center items-center h-full tracking-widest gap-4"
  >
    <div class="">THRELTEMANIA</div>

    <Button
      on:click={() => {
        actions.goToCampaignMenu()
      }}
    >
      Campaign
    </Button>

    <Button
      on:click={() => {
        actions.goToUserTracksMenu()
      }}
    >
      User Tracks
    </Button>
  </div>
</UiWrapper>
