<script lang="ts">
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import BottomBar from '../../UI/components/BottomBar.svelte'
  import Button from '../../UI/components/Button.svelte'
  import TopBarLayout from '../../UI/layouts/TopBarLayout.svelte'
  import { actions } from '../../stores/app'
</script>

<UiWrapper>
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
      <div class="grid grid-cols-3 gap-[15px]">
        <div class="col-span-1">
          <div class="flex flex-col items-stretch gap-[2px]">
            <Button
              class="flex-1"
              on:click={() => {
                actions.goToCampaignMenu()
              }}
            >
              Campaign
            </Button>

            <Button
              forceFocusOnMount
              class="flex-1"
              on:click={() => {
                actions.goToUserTracksMenu()
              }}
            >
              User Tracks
            </Button>
          </div>
        </div>
      </div>

      <BottomBar>
        <Button slot="right">Made with Threlte</Button>
      </BottomBar>
    </svelte:fragment>
  </TopBarLayout>
</UiWrapper>
