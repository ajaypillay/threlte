<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()
  const { validated } = trackData

  const removeElement = () => {
    if (!$currentlySelectedElement) return
    trackData.removeTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(undefined)
  }
</script>

<Button
  class="!bg-red-500 hover:!bg-red-600 hover:!text-black"
  disabled={$validated}
  on:click={removeElement}
>
  DELETE
</Button>
