<script
  lang="ts"
  context="module"
>
  import { currentWritable, CurrentWritable, useFrame } from '@threlte/core'

  type TrackStateContext = {
    checkpointsReached: CurrentWritable<Set<string>>
    registerCheckpointReached: (checkpointId: string) => void
    registerFinishReached: () => void
  }

  export const useTrackState = () => {
    return getContext<TrackStateContext>('track-state')
  }
</script>

<script lang="ts">
  import { createEventDispatcher, getContext, setContext } from 'svelte'
  import { actions, gameState } from '../stores/app'
  import type { TrackData } from './TrackData/TrackData'

  const { paused } = gameState

  export let trackData: TrackData

  const { finishCount, checkpointCount } = trackData

  $: if ($finishCount < 1) console.warn('No finish found')

  const dispatch = createEventDispatcher<{
    trackcomplete: void
  }>()

  const checkpointsReached = currentWritable(new Set<string>())
  let trackComplete = false

  const registerCheckpointReached = (checkpointId: string) => {
    checkpointsReached.update((set) => {
      set.add(checkpointId)
      return set
    })
  }

  const registerFinishReached = () => {
    if (checkpointsReached.current.size === $checkpointCount) {
      dispatch('trackcomplete')
      trackComplete = true
    }
  }

  const trackStateContext: TrackStateContext = {
    checkpointsReached,
    registerCheckpointReached,
    registerFinishReached
  }

  setContext<TrackStateContext>('track-state', trackStateContext)

  const resetTrackState = () => {
    checkpointsReached.update((set) => {
      set.clear()
      return set
    })
    trackComplete = false
  }

  useFrame((_, delta) => {
    if ($paused) return
    actions.incrementGameTime(delta * 1000)
  })

  actions.use('softResetTimeAttack', resetTrackState)
  actions.use('resetTimeAttack', resetTrackState)
</script>

<slot {trackComplete} />
