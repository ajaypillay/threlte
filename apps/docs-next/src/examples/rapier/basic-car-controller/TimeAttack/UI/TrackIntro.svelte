<script lang="ts">
  import { actions } from '../../stores/app'
  import { useKeyPress } from '../../utils/useKeyPress'

  useKeyPress('Enter', () => {
    actions.goToCountIn()
  })
</script>

<div class="flex flex-col justify-center items-center h-full tracking-widest uppercase">
  <div>PRESS ENTER TO START</div>
</div>
