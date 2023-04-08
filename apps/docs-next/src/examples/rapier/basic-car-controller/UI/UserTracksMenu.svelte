<script lang="ts">
  import { TrackData } from '../Track/TrackData/TrackData'
  import { actions } from '../stores/app'
  import { useKeyDown } from '../useKeyDown'
  import UiWrapper from './UiWrapper.svelte'

  useKeyDown('Escape', () => {
    actions.goToMainMenu()
  })

  const userTrackIds = TrackData.listLocalStorageTrackIds()
</script>

<UiWrapper>
  <div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
    <button
      on:click={() => {
        actions.loadEmptyTrackData(() => {
          actions.startTrackEditor()
        })
      }}
    >
      Create Track
    </button>

    {#each userTrackIds as userTrackId}
      <button
        on:click={() => {
          actions.loadTrackDataFromLocalStorage(userTrackId, () => {
            actions.startTimeAttack()
          })
        }}
      >
        Time Attack Track {userTrackId}
      </button>
      <button
        on:click={() => {
          actions.loadTrackDataFromLocalStorage(userTrackId, () => {
            actions.startTrackEditor()
          })
        }}
      >
        Edit Track {userTrackId}
      </button>
    {/each}
  </div>
</UiWrapper>
