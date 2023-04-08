<script lang="ts">
  import { useProgress } from '@threlte/extras'
  import { preloadEnv } from './Env.svelte'
  import { preloadBarrier } from './Track/Elements/Barrier.svelte'
  import { preloadBarrierEnd } from './Track/Elements/BarrierEnd.svelte'
  import { preloadBarrierTurnLeft } from './Track/Elements/BarrierTurnLeft.svelte'
  import { preloadBarrierTurnRight } from './Track/Elements/BarrierTurnRight.svelte'
  import { preloadBasicBox } from './Track/Elements/BasicBox.svelte'
  import { preloadBoost } from './Track/Elements/Boost.svelte'
  import { preloadCheckpoint } from './Track/Elements/Checkpoint.svelte'
  import { preloadDoubleBarrier } from './Track/Elements/DoubleBarrier.svelte'
  import { preloadHalfbox } from './Track/Elements/HalfBox.svelte'
  import { preloadRamp } from './Track/Elements/Ramp.svelte'
  import { preloadRampInverse } from './Track/Elements/RampInverse.svelte'
  import { preloadSlope } from './Track/Elements/Slope.svelte'
  import { preloadMuscleCar } from './Car/Models/MuscleCar.svelte'
  import { preloadMuscleCarWheel } from './Car/Models/MuscleCarWheel.svelte'
  import LoadingUi from './UI/LoadingUi.svelte'

  const preload = () => {
    return Promise.all([
      preloadMuscleCar(),
      preloadMuscleCarWheel(),
      preloadCheckpoint(),
      preloadHalfbox(),
      preloadRamp(),
      preloadRampInverse(),
      preloadDoubleBarrier(),
      preloadBarrierEnd(),
      preloadBoost(),
      preloadBarrierTurnLeft(),
      preloadBarrierTurnRight(),
      preloadBarrier(),
      preloadSlope(),
      preloadEnv(),
      preloadBasicBox()
    ])
  }

  const { progress } = useProgress()
</script>

{#await preload()}
  <LoadingUi progress={$progress} />
{:then}
  <slot />
{/await}
