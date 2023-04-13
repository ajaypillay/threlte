<script lang="ts">
  import { trackElementPrototypes } from '../../../TrackElements/elements'
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()
  const validated = trackData.validated
</script>

<div class="flex flex-col items-start gap-1">
  {#each Object.entries(trackElementPrototypes) as [key, _] (key)}
    <Button
      class="!px-0"
      disabled={$validated}
      on:click={() => {
        const newTrackElement = trackData.addTrackElement(key)
        currentlySelectedElement.set(newTrackElement)
      }}
    >
      <img
        src="/assets/basic-vehicle-controller/TrackElements/images/{key}.png"
        alt={key}
        class="!h-[60px] !w-[60px]"
      />
    </Button>
  {/each}
</div>
