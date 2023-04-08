<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()

  const removeElement = () => {
    if (!$currentlySelectedElement) return
    trackData.removeTrackElement($currentlySelectedElement.id)
  }
</script>

<Button
  size="small"
  on:click={removeElement}>Remove Element</Button
>
