<script lang="ts">
  import { trackElementPrototypes } from '../../../TrackElements/elements'
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()
  const validated = trackData.validated
</script>

<div class="flex flex-col items-start gap-1">
  {#each Object.entries(trackElementPrototypes) as [key, value] (key)}
    <Button
      disabled={$validated}
      size="small"
      on:click={() => {
        const newTrackElement = trackData.addTrackElement(key)
        currentlySelectedElement.set(newTrackElement)
      }}
    >
      {value.buttonLabel}
    </Button>
  {/each}
</div>
