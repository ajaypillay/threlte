<script lang="ts">
  import { actions } from '../stores/app'
  import UiWrapper from './UiWrapper.svelte'
  import Button from './components/Button.svelte'
</script>

<UiWrapper>
  <div class="relative w-full h-full top-0 left-0 flex flex-row justify-center items-center">
    <Button
      forceFocusOnMount
      on:click={() => {
        actions.goToAppIntro()
      }}
    >
      Start
    </Button>
  </div>
</UiWrapper>
