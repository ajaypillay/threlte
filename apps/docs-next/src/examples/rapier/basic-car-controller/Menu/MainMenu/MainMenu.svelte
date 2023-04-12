<script lang="ts">
  import BottomBar from '../../UI/components/BottomBar.svelte'
  import Button from '../../UI/components/Button.svelte'
  import TopBarLayout from '../../UI/layouts/TopBarLayout.svelte'
  import { actions } from '../../stores/app'
</script>

<TopBarLayout>
  <div slot="topbar-center">THRELTEMANIA</div>
  <Button
    slot="topbar-right"
    on:click={() => {
      actions.goToOptionsMenu()
    }}
  >
    Options
  </Button>
  <svelte:fragment>
    <div class="flex flex-col justify-center items-center h-full gap-[2px]">
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

    <BottomBar>
      <Button slot="right">Made with Threlte</Button>
    </BottomBar>
  </svelte:fragment>
</TopBarLayout>
