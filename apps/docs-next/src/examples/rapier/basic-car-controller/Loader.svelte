<script lang="ts">
  import { useProgress } from '@threlte/extras'
  import { preloadEnv } from './Common/Env.svelte'
  import { preloadBarrier } from './TrackElements/Barrier.svelte'
  import { preloadMuscleCar } from './Car/Models/MuscleCar.svelte'
  import { preloadMuscleCarWheel } from './Car/Models/MuscleCarWheel.svelte'
  import LoadingUi from './UI/LoadingUi.svelte'
  import { preloadCheckpoint } from './TrackElements/Checkpoint.svelte'
  import { preloadHalfbox } from './TrackElements/HalfBox.svelte'
  import { preloadRamp } from './TrackElements/Ramp.svelte'
  import { preloadRampInverse } from './TrackElements/RampInverse.svelte'
  import { preloadDoubleBarrier } from './TrackElements/DoubleBarrier.svelte'
  import { preloadBarrierEnd } from './TrackElements/BarrierEnd.svelte'
  import { preloadBoost } from './TrackElements/Boost.svelte'
  import { preloadBarrierTurnLeft } from './TrackElements/BarrierTurnLeft.svelte'
  import { preloadBarrierTurnRight } from './TrackElements/BarrierTurnRight.svelte'
  import { preloadSlope } from './TrackElements/Slope.svelte'
  import { preloadBasicBox } from './TrackElements/BasicBox.svelte'

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
