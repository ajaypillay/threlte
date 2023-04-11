<script lang="ts">
  import { TrackData } from '../../TrackData/TrackData'
  import { actions } from '../../stores/app'
  import { useKeyDown } from '../../utils/useKeyDown'
  import UiWrapper from '../../UI/UiWrapper.svelte'

  useKeyDown('Escape', () => {
    actions.goToMainMenu()
  })

  const userTrackIds = TrackData.localStorageTrackIds

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
          const trackDatas = $userTrackIds
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
      Create New Track
    </button>

    {#each $userTrackIds as userTrackId}
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

      <button
        on:click={() => {
          trackData?.removeFromLocalStorage()
        }}
      >
        Delete Track {getTrackName(trackData)}
      </button>
    {/each}
  </div>
</UiWrapper>
