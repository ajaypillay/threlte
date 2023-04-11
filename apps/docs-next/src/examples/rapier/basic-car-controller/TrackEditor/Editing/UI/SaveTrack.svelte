<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData } = useTrackEditor()
  const { canBeSaved } = trackData

  // export trackData
  const onClick = () => {
    trackData.saveTrackToDisk()
  }
</script>

<Button
  size="small"
  disabled={!$canBeSaved}
  on:click={onClick}>Save Track</Button
>
