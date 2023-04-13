<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { actions } from '../../../stores/app'
  import { useTrackEditor } from '../context'

  const { trackData } = useTrackEditor()

  const { validated } = trackData
</script>

{#if $validated}
  <Button
    class="!bg-red-500 hover:!bg-red-600 focus:!bg-red-600 hover:!text-black focus:!text-black"
    on:click={() => {
      trackData.invalidate()
    }}
  >
    Unlock Track
  </Button>
{:else}
  <Button
    class="!bg-green-500 hover:!bg-green-600 focus:!bg-green-600 hover:!text-black focus:!text-black"
    on:click={() => {
      actions.startTrackValidation()
    }}
  >
    Validate Track
  </Button>
{/if}
