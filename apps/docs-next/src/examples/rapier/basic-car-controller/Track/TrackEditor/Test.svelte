<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import TrackEditor from './TrackEditor.svelte'
  import { trackDataUtils } from './utils/trackDataUtils'

  let trackData = trackDataUtils.loadTrackDataFromLocalStorage('test')
</script>

{#if trackData}
  <TrackEditor {trackData} />
{/if}

<T.PerspectiveCamera
  makeDefault
  position={[30, 30, 30]}
>
  <OrbitControls />
</T.PerspectiveCamera>
