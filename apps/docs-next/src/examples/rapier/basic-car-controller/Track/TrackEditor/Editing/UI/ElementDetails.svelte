<script lang="ts">
  import { DEG2RAD, RAD2DEG } from 'three/src/math/MathUtils'
  import type { TrackElement } from '../../../TrackData/TrackData'
  import { useTrackEditor } from '../../context'

  const { trackData } = useTrackEditor()

  export let currentlySelectedTrackElement: TrackElement

  const position = currentlySelectedTrackElement.position
  const rotation = currentlySelectedTrackElement.rotation

  const updatePosition = (component: 0 | 1 | 2, data: number) => {
    const currentPosition = currentlySelectedTrackElement.position.current
    currentPosition[component] = data
    trackData.setTrackElementPosition(currentlySelectedTrackElement.id, currentPosition)
  }

  const updateRotation = (component: 0 | 1 | 2, data: number) => {
    const currentRotation = currentlySelectedTrackElement.rotation.current
    currentRotation[component] = data * DEG2RAD
    trackData.setTrackElementRotation(currentlySelectedTrackElement.id, currentRotation)
  }
</script>

<div class="pointer-events-auto text-[0.5em]">
  <div>
    <input
      type="number"
      value={$position[0]}
      on:input={(e) => {
        updatePosition(0, Number(e.currentTarget.value))
      }}
    />
    <input
      type="number"
      value={$position[1]}
      on:input={(e) => {
        updatePosition(1, Number(e.currentTarget.value))
      }}
    />
    <input
      type="number"
      value={$position[2]}
      on:input={(e) => {
        updatePosition(2, Number(e.currentTarget.value))
      }}
    />
  </div>

  <div>
    <input
      type="number"
      value={$rotation[0] * RAD2DEG}
      on:input={(e) => {
        updateRotation(0, Number(e.currentTarget.value))
      }}
    />
    <input
      type="number"
      value={$rotation[1] * RAD2DEG}
      on:input={(e) => {
        updateRotation(1, Number(e.currentTarget.value))
      }}
    />
    <input
      type="number"
      value={$rotation[2] * RAD2DEG}
      on:input={(e) => {
        updateRotation(2, Number(e.currentTarget.value))
      }}
    />
  </div>
</div>
