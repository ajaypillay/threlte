<script lang="ts">
  import { useFrame } from '@threlte/core'
  import { actions, gameState } from '../stores/app'

  const { paused, common } = gameState
  const { finishReached } = common

  useFrame((_, delta) => {
    if ($paused || $finishReached) return
    actions.incrementGameTime(delta * 1000)
  })
</script>

<slot />
