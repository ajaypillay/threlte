<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData } = useTrackEditor()

  // export trackData
  const onClick = () => {
    trackData.saveTrackToDisk()
  }
</script>

<Button
  style="grey"
  on:click={onClick}>Export Track</Button
>
