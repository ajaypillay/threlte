<script lang="ts">
  import UiWrapper from '../../../UI/UiWrapper.svelte'
  import Button from '../../../UI/components/Button.svelte'
  import { actions } from '../../../stores/app'
</script>

<UiWrapper>
  <Button
    on:click={() => {
      actions.cancelTrackValidation()
    }}
  >
    Edit Track
  </Button>
</UiWrapper>
