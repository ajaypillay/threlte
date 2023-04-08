<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()

  const duplicateElement = () => {
    if (!$currentlySelectedElement) return
    const newTrackElement = trackData.duplicateTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(newTrackElement)
  }
</script>

<Button
  size="small"
  on:click={duplicateElement}>Duplicate Element</Button
>
