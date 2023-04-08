<script lang="ts">
  import { DEG2RAD, RAD2DEG } from 'three/src/math/MathUtils'
  import { useTrackEditor } from '../context'
  import { trackDataUtils } from '../utils/trackDataUtils'
  import type { TrackElement } from '../../types'

  const { trackData } = useTrackEditor()

  export let currentlySelectedTrackElement: TrackElement

  const position = currentlySelectedTrackElement.position
  const rotation = currentlySelectedTrackElement.rotation
</script>

<div class="pointer-events-auto text-[0.5em]">
  <div>
    <input
      type="number"
      value={$position[0]}
      on:input={(e) => {
        $position[0] = Number(e.currentTarget.value)
        trackDataUtils.saveTrackDataToLocalStorage(trackData)
      }}
    />
    <input
      type="number"
      value={$position[1]}
      on:input={(e) => {
        $position[1] = Number(e.currentTarget.value)
        trackDataUtils.saveTrackDataToLocalStorage(trackData)
      }}
    />
    <input
      type="number"
      value={$position[2]}
      on:input={(e) => {
        $position[2] = Number(e.currentTarget.value)
        trackDataUtils.saveTrackDataToLocalStorage(trackData)
      }}
    />
  </div>

  <div>
    <input
      type="number"
      value={$rotation[0] * RAD2DEG}
      on:input={(e) => {
        $rotation[0] = Number(e.currentTarget.value) * DEG2RAD
        trackDataUtils.saveTrackDataToLocalStorage(trackData)
      }}
    />
    <input
      type="number"
      value={$rotation[1] * RAD2DEG}
      on:input={(e) => {
        $rotation[1] = Number(e.currentTarget.value) * DEG2RAD
        trackDataUtils.saveTrackDataToLocalStorage(trackData)
      }}
    />
    <input
      type="number"
      value={$rotation[2] * RAD2DEG}
      on:input={(e) => {
        $rotation[2] = Number(e.currentTarget.value) * DEG2RAD
        trackDataUtils.saveTrackDataToLocalStorage(trackData)
      }}
    />
  </div>
</div>
