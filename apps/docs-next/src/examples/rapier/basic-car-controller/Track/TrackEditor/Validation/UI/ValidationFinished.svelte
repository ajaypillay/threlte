<script lang="ts">
  import UiWrapper from '../../../../UI/UiWrapper.svelte'
  import Button from '../../../../UI/components/Button.svelte'
  import { actions } from '../../../../stores/app'
  import { useTrackEditor } from '../../Editing/context'

  const { trackData } = useTrackEditor()
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
