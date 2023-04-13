<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()
  const validated = trackData.validated

  const duplicateElement = () => {
    if (!$currentlySelectedElement) return
    const newTrackElement = trackData.duplicateTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(newTrackElement)
  }
</script>

<Button
  class="bg-[#e8e8e8] hover:bg-[#d6d6d6] focus:bg-[#d6d6d6]"
  disabled={$validated}
  on:click={duplicateElement}
>
  Duplicate
</Button>
