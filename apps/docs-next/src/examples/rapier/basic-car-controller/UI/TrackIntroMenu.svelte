<script lang="ts">
  import UiWrapper from './UiWrapper.svelte'

  export let trackId: string
</script>

<UiWrapper>
  <div class="flex flex-col justify-center items-center h-full tracking-widest uppercase">
    <div>{trackId}</div>

    <div>PRESS ENTER TO START</div>
  </div>
</UiWrapper>
