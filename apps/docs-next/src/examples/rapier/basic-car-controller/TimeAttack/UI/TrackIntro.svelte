<script lang="ts">
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import { actions } from '../../stores/app'
  import { useKeyPress } from '../../useKeyPress'

  useKeyPress('Enter', () => {
    actions.timeAttackStartCountIn()
  })
</script>

<UiWrapper>
  <div class="flex flex-col justify-center items-center h-full tracking-widest uppercase">
    <div>PRESS ENTER TO START</div>
  </div>
</UiWrapper>
