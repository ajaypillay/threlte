<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'
  import { trackDataUtils } from '../utils/trackDataUtils'

  const { trackData, currentlySelectedElement } = useTrackEditor()

  const removeElement = () => {
    if (!$currentlySelectedElement) return
    trackDataUtils.removeElement(trackData, $currentlySelectedElement.id)
  }
</script>

<Button
  size="small"
  on:click={removeElement}>Remove Element</Button
>
