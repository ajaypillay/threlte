<script lang="ts">
  import { actions } from '../../stores/app'
  import { getters } from '../../stores/getters'

  const { formattedTime } = getters.game.common.time
</script>

<div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
  <div>
    {$formattedTime}
  </div>
  <button
    on:click={() => {
      actions.goToMainMenu()
    }}
  >
    Main Menu
  </button>
  <button
    on:click={() => {
      actions.goToIntro()
    }}
  >
    Restart
  </button>
</div>
