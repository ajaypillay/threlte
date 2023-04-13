<script lang="ts">
  import type { TrackData } from '../../../TrackData/TrackData'
  import Button from '../../../UI/components/Button.svelte'
  import { actions } from '../../../stores/app'
  import { formatTime } from '../../../utils/formatters'

  export let trackData: TrackData

  const { trackTimes } = trackData

  const { author } = trackTimes

  $: currentAuthorTime = formatTime($author)
</script>

<p>
  Current Author Time: {currentAuthorTime}
</p>

<Button
  on:click={() => {
    trackData.saveTrackToDisk()
  }}
>
  Save Track
</Button>

<Button
  on:click={() => {
    actions.startTrackEditor()
  }}
>
  Edit Track
</Button>
