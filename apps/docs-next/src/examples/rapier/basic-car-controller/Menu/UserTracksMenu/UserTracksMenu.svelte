<script lang="ts">
  import { c } from '../../../../../lib/classes'
  import { TrackData } from '../../TrackData/TrackData'
  import { TrackRecord } from '../../TrackRecord/TrackRecord'
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import BackButton from '../../UI/components/BackButton.svelte'
  import Button from '../../UI/components/Button.svelte'
  import TopBar from '../../UI/components/TopBar.svelte'
  import { actions } from '../../stores/app'
  import { formatTime } from '../../utils/formatters'
  import { useKeyDown } from '../../utils/useKeyDown'

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

  let selectedTrackId: string | undefined = undefined

  const selectTrack = (trackId: string) => {
    selectedTrackId = trackId
  }
</script>

<UiWrapper>
  <div class="flex flex-col relative w-full h-full top-0 left-0">
    <TopBar>
      <BackButton
        slot="left"
        on:click={() => {
          actions.goToMainMenu()
        }}
      >
        Back
      </BackButton>

      <p slot="center">USER TRACKS</p>

      <Button
        slot="right"
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
          height="72"
          viewBox="0 0 256 256"
          ><path
            d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"
          /></svg
        >
        CREATE
      </Button>
    </TopBar>

    <div class="grid grid-cols-3 mt-[15px] gap-[15px] h-full min-h-0">
      <div class="flex flex-col col-span-1 gap-[2px] h-full overflow-auto pointer-events-auto">
        {#each $userTrackIds as userTrackId}
          {@const trackData = TrackData.fromLocalStorage(userTrackId)}
          {#if trackData}
            <Button
              on:click={() => selectTrack(trackData.trackId)}
              class={c(selectedTrackId === trackData.trackId && '!bg-black !text-white')}
            >
              {getTrackName(trackData)}
            </Button>
          {/if}
        {/each}
      </div>

      {#if selectedTrackId}
        {@const trackData = TrackData.fromLocalStorage(selectedTrackId)}
        <div class="col-span-2">
          {#if trackData}
            {@const trackRecord = TrackRecord.fromLocalStorage(trackData)}
            <div class="bg-white rounded-sm px-[2px] text-black uppercase flex flex-col gap-[0px]">
              <div>
                "{getTrackName(trackData)}"
              </div>
              {#if trackData.authorName.current.length}
                <div>
                  AUTHOR: {trackData.authorName.current}
                </div>
              {/if}

              {#if trackRecord}
                <div>
                  BEST: {formatTime(trackRecord.time.current)}
                </div>
              {/if}

              <div class="flex flex-row justify-between items-center mb-[2px] mt-[10px]">
                {#if trackData.validated.current}
                  <Button
                    class="!bg-green !text-black hover:!bg-green-600"
                    on:click={() => {
                      actions.setTrackData(trackData, () => {
                        actions.startTimeAttack()
                      })
                    }}
                  >
                    Play
                  </Button>
                {:else}
                  <div />
                {/if}

                <div class="flex flex-row justify-end items-center gap-[2px]">
                  <Button
                    class="!bg-black !text-white"
                    on:click={() => {
                      actions.setTrackData(trackData, () => {
                        actions.startTrackEditor()
                      })
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    class="!bg-red-500 hover:!bg-red-600 hover:!text-black"
                    on:click={() => {
                      TrackData.removeFromLocalStorage(trackData.trackId)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</UiWrapper>
