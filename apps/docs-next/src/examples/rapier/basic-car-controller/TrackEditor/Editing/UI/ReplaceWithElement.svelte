<script lang="ts">
  import { trackElementPrototypes } from '../../../TrackElements/elements'
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()
  const { validated } = trackData
</script>

<div class="flex flex-col items-start gap-1">
  {#each Object.entries(trackElementPrototypes) as [key, _] (key)}
    <Button
      disabled={$validated}
      on:click={() => {
        if (!$currentlySelectedElement) return
        trackData.setTrackElementType($currentlySelectedElement.id, key)
      }}
    >
      <img
        src="/assets/basic-vehicle-controller/TrackElements/images/{key}.png"
        alt={key}
      />
    </Button>
  {/each}
</div>
