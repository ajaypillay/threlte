<script lang="ts">
  import { TrackData } from '../Track/TrackData/TrackData'
  import { actions } from '../stores/app'
  import { useKeyDown } from '../useKeyDown'
  import UiWrapper from './UiWrapper.svelte'

  useKeyDown('Escape', () => {
    actions.goToMainMenu()
  })

  const userTrackIds = TrackData.listLocalStorageTrackIds()

  let numberOfUnnamedTracks = 0

  const getTrackName = (trackData?: TrackData) => {
    if (trackData?.trackName.current && trackData.trackName.current.length) {
      return trackData.trackName.current
    } else {
      numberOfUnnamedTracks++
      return `Unnamed Track ${numberOfUnnamedTracks}`
    }
  }

  const filterUndefined = <T>(value: T | undefined): value is T => {
    return !!value
  }
</script>

<UiWrapper>
  <div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
    <button
      on:click={() => {
        actions.loadEmptyTrackData((trackData) => {
          const trackDatas = userTrackIds
            .map((userTrackId) => {
              return TrackData.fromLocalStorage(userTrackId)
            })
            .filter(filterUndefined)

          const trackNamesStartingWithUnnamed = trackDatas.filter((trackData) => {
            return trackData.trackName.current.startsWith('Unnamed Track')
          }).length

          trackData.trackName.set(`Unnamed Track ${trackNamesStartingWithUnnamed + 1}`)

          actions.startTrackEditor()
        })
      }}
    >
      Create Track
    </button>

    {#each userTrackIds as userTrackId}
      {@const trackData = TrackData.fromLocalStorage(userTrackId)}
      {#if trackData?.validated.current}
        <button
          on:click={() => {
            actions.loadTrackDataFromLocalStorage(userTrackId, () => {
              actions.startTimeAttack()
            })
          }}
        >
          Time Attack Track {getTrackName(trackData)}
        </button>
      {/if}
      <button
        on:click={() => {
          actions.loadTrackDataFromLocalStorage(userTrackId, () => {
            actions.startTrackEditor()
          })
        }}
      >
        Edit Track {getTrackName(trackData)}
      </button>
    {/each}
  </div>
</UiWrapper>
