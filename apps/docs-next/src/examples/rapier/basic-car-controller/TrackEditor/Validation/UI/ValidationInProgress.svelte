<script lang="ts">
  import UiWrapper from '../../../UI/UiWrapper.svelte'
  import { getters } from '../../../stores/getters'

  const { formattedTime } = getters.game.common.time
</script>

<UiWrapper>
  <div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
    <div>
      {$formattedTime}
    </div>
  </div>
</UiWrapper>
