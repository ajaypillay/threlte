<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { actions } from '../../../stores/app'
</script>

<Button
  on:click={() => {
    actions.startTrackEditor()
  }}
>
  Edit Track
</Button>
