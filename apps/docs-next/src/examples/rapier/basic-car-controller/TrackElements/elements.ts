// Elements
import BarrierEnd from './BarrierEnd.svelte'
import BarrierTurnLeft from './BarrierTurnLeft.svelte'
import Barrier from './Barrier.svelte'
import BarrierTurnRight from './BarrierTurnRight.svelte'
import BasicBox from './BasicBox.svelte'
import Boost from './Boost.svelte'
import Checkpoint from './Checkpoint.svelte'
import CheckpointRing from './CheckpointRing.svelte'
import DoubleBarrier from './DoubleBarrier.svelte'
import Finish from './Finish.svelte'
import HalfBox from './HalfBox.svelte'
import Ramp from './Ramp.svelte'
import RampInverse from './RampInverse.svelte'
import Slope from './Slope.svelte'

export const trackElementPrototypes = {
  Box: {
    buttonLabel: 'Box',
    component: BasicBox
  },

  HalfBox: {
    buttonLabel: 'Half Box',
    component: HalfBox
  },

  Ramp: {
    buttonLabel: 'Ramp',
    component: Ramp
  },

  RampInverse: {
    buttonLabel: 'Inverse Ramp',
    component: RampInverse
  },

  Checkpoint: {
    buttonLabel: 'Checkpoint',
    component: Checkpoint
  },

  CheckpointRing: {
    buttonLabel: 'Ring Checkpoint',
    component: CheckpointRing
  },

  Boost: {
    buttonLabel: 'Boost',
    component: Boost
  },

  // Barrier: {
  //   buttonLabel: 'Barrier',
  //   component: Barrier
  // },

  DoubleBarrier: {
    buttonLabel: 'Double Barrier',
    component: DoubleBarrier
  },

  BarrierEnd: {
    buttonLabel: 'Barrier End',
    component: BarrierEnd
  },

  BarrierTurnLeft: {
    buttonLabel: 'Barrier Turn Left',
    component: BarrierTurnLeft
  },

  BarrierTurnRight: {
    buttonLabel: 'Barrier Turn Right',
    component: BarrierTurnRight
  },

  Slope: {
    buttonLabel: 'Slope',
    component: Slope
  },

  Finish: {
    buttonLabel: 'Finish',
    component: Finish
  }
} satisfies Record<
  string,
  {
    buttonLabel: string
    component: any
  }
>
