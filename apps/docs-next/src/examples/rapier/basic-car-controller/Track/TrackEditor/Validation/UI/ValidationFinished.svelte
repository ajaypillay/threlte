<script lang="ts">
  import UiWrapper from '../../../../UI/UiWrapper.svelte'
  import Button from '../../../../UI/components/Button.svelte'
  import { actions } from '../../../../stores/app'
  import type { TrackData } from '../../../TrackData/TrackData'

  export let trackData: TrackData

  const { canBeSaved } = trackData
</script>

<UiWrapper>
  <Button
    disabled={!$canBeSaved}
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
</UiWrapper>
