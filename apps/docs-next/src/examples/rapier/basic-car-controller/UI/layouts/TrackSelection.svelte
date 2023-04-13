<script lang="ts">
  import { c } from '../../../../../lib/classes'
  import { TrackData } from '../../TrackData/TrackData'
  import { TrackRecord } from '../../TrackRecord/TrackRecord'
  import { actions } from '../../stores/app'
  import { formatTime } from '../../utils/formatters'
  import { useKeyDown } from '../../utils/useKeyDown'
  import Button from '../components/Button.svelte'

  export let trackDatas: TrackData[]

  export let tracksCanBeEdited = false
  export let tracksCanBeDeleted = false
  export let showAuthor = false

  let selectedTrackId: string | undefined = undefined

  export let trackSelected = false
  $: trackSelected = !!selectedTrackId

  const selectTrack = (trackId: string) => {
    selectedTrackId = trackId
  }

  useKeyDown('Escape', (e) => {
    e.stopPropagation()
    selectedTrackId = undefined
  })
</script>

<div class="grid grid-cols-3 mt-[15px] gap-[15px] h-full min-h-0">
  <div class="flex flex-col col-span-1 gap-[2px] h-full overflow-auto pointer-events-auto">
    {#each trackDatas as trackData, index}
      {#if trackData}
        <Button
          forceFocusOnMount={index === 0}
          on:click={() => selectTrack(trackData.trackId)}
          class={c(selectedTrackId === trackData.trackId && '!bg-black !text-white')}
        >
          {trackData.trackName.current}
        </Button>
      {/if}
    {/each}
  </div>

  {#if selectedTrackId}
    {@const trackData = trackDatas.find((trackData) => trackData.trackId === selectedTrackId)}
    {#if trackData}
      {@const trackRecord = TrackRecord.fromLocalStorage(trackData)}
      <div class="col-span-2">
        <div class="bg-white rounded-sm px-[2px] text-black uppercase flex flex-col gap-[0px]">
          <div>
            "{trackData.trackName.current}"
          </div>
          {#if trackData.authorName.current.length && showAuthor}
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
                forceFocusOnMount
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

            {#if tracksCanBeEdited || tracksCanBeDeleted}
              <div class="flex flex-row justify-end items-center gap-[2px]">
                {#if tracksCanBeEdited}
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
                {/if}

                {#if tracksCanBeDeleted}
                  <Button
                    class="!bg-red-500 hover:!bg-red-600 hover:!text-black"
                    on:click={() => {
                      TrackData.removeFromLocalStorage(trackData.trackId)
                    }}
                  >
                    Delete
                  </Button>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>
