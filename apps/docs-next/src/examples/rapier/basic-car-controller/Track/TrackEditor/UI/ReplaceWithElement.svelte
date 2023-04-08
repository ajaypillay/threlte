<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { trackElementPrototypes } from '../../Elements/elements'
  import { useTrackEditor } from '../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()
</script>

<div class="flex flex-col items-start gap-1">
  {#each Object.entries(trackElementPrototypes) as [key, value] (key)}
    <Button
      size="small"
      on:click={() => {
        if (!$currentlySelectedElement) return
        trackData.setTrackElementType($currentlySelectedElement.id, key)
      }}
    >
      {value.buttonLabel}
    </Button>
  {/each}
</div>
