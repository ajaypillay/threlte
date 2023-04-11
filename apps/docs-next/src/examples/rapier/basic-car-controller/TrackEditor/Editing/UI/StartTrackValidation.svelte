<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { actions } from '../../../stores/app'
  import { useTrackEditor } from '../context'

  const { trackData } = useTrackEditor()

  const { canBeValidated, validated } = trackData
</script>

{#if $validated}
  <Button
    size="small"
    on:click={() => {
      trackData.setValidated(false)
    }}
  >
    Edit Track
  </Button>
{:else}
  <Button
    size="small"
    disabled={!$canBeValidated}
    on:click={() => {
      actions.startTrackValidation()
    }}
  >
    Validate Track
  </Button>
{/if}
