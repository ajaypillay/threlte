<script lang="ts">
  import { Canvas } from '@threlte/core'
  import { Debug, World } from '@threlte/rapier'
  import Loader from './Loader/Loader.svelte'
  import Scene from './Scene.svelte'
  import { appState, actions, printState } from './stores/app'
  import { useKeyPress } from './utils/useKeyPress'

  const { debug } = appState

  const onVisibilityChange = () => {
    if (document.hidden || document.visibilityState === 'hidden') {
      actions.setVisibility('hidden')
    } else {
      actions.setVisibility('visible')
    }
  }

  useKeyPress('Shift+P', () => {
    printState()
  })
</script>

<svelte:window on:visibilitychange={onVisibilityChange} />

<div class="w-full h-full relative bg-black">
  <Canvas
    rendererParameters={{
      powerPreference: 'high-performance',
      alpha: true,
      preserveDrawingBuffer: true
    }}
  >
    <World order={-999}>
      {#if $debug}
        <Debug
          depthTest={false}
          depthWrite={false}
        />
      {/if}

      <Loader>
        <Scene />
      </Loader>
    </World>
  </Canvas>

  <div
    class="absolute top-0 left-0 w-full h-full z-10 text-[28px] [&_button]:pointer-events-auto p-[15px] pointer-events-none leading-none select-none"
    id="car-ui-portal-target"
  />
</div>
