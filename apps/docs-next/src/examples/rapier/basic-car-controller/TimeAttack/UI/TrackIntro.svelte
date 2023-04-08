<script lang="ts">
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import { actions } from '../../stores/app'
  import { useKeyPress } from '../../useKeyPress'

  export let trackId: string

  useKeyPress('Enter', () => {
    actions.timeAttackStartCountIn()
  })
</script>

<UiWrapper>
  <div class="flex flex-col justify-center items-center h-full tracking-widest uppercase">
    <div>{trackId}</div>

    <div>PRESS ENTER TO START</div>
  </div>
</UiWrapper>
