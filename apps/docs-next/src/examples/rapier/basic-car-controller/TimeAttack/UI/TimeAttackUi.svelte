<script lang="ts">
  import { getters } from '../../stores/getters'

  const { formattedTime } = getters.game.common.time
</script>

<div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
  <div>
    {$formattedTime}
  </div>
</div>
