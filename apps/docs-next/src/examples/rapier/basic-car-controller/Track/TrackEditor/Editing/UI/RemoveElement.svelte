<script lang="ts">
  import Button from '../../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()
  const { validated } = trackData

  const removeElement = () => {
    if (!$currentlySelectedElement) return
    trackData.removeTrackElement($currentlySelectedElement.id)
  }
</script>

<Button
  disabled={$validated}
  size="small"
  on:click={removeElement}>Remove Element</Button
>
