<script lang="ts">
  import Button from '../../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()
  const validated = trackData.validated

  const duplicateElement = () => {
    if (!$currentlySelectedElement) return
    const newTrackElement = trackData.duplicateTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(newTrackElement)
  }
</script>

<Button
  disabled={$validated}
  size="small"
  on:click={duplicateElement}>Duplicate Element</Button
>
