<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData } = useTrackEditor()

  // export trackData
  const onClick = () => {
    trackData.export()
  }
</script>

<Button
  size="small"
  on:click={onClick}>Save Track</Button
>
