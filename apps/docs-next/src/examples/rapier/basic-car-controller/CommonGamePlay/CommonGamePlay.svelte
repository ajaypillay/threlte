<script lang="ts">
  import { derived } from 'svelte/store'
  import Car from '../Car/Car.svelte'
  import { actions, appState, gameState } from '../stores/app'
  import { useKeyDown } from '../utils/useKeyDown'
  import CountIn from './UI/CountIn.svelte'
  import TrackViewer from '../TrackViewer/TrackViewer.svelte'
  import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
  import TrackElement from '../TrackViewer/TrackElement.svelte'
  import { useGameIsPausable } from '../utils/useGameIsPausable'
  import { useFrame } from '@threlte/core'
  import UiWrapper from '../UI/UiWrapper.svelte'

  const { visibility } = appState
  const { common, paused, trackData } = gameState

  const { state, finishReached } = common

  const carActive = derived([state, visibility, paused], ([state, visibility, paused]) => {
    if (visibility === 'hidden') return false
    if (paused) return false
    if (state === 'playing' || state === 'finished') return true
    return false
  })

  const carVolume = derived([paused], ([paused]) => {
    return paused ? 0 : 1
  })

  useKeyDown('Enter', () => {
    if ($state === 'playing') {
      actions.goToCountIn()
    }
  })

  useGameIsPausable()

  useFrame((_, delta) => {
    if ($paused || $state !== 'playing' || $finishReached) return
    actions.incrementGameTime(delta * 1000)
  })
</script>

<!-- UI -->
<UiWrapper>
  {#if $paused}
    <slot name="ui-paused" />
  {:else if $state === 'intro'}
    <slot name="ui-intro" />
  {:else if $state === 'count-in'}
    <slot name="ui-count-in">
      <CountIn
        on:countindone={() => {
          actions.startPlaying()
        }}
      />
    </slot>
  {:else if $state === 'playing'}
    <slot name="ui-playing" />
  {:else if $state === 'finished'}
    <slot name="ui-finished" />
  {/if}
</UiWrapper>

<!-- TRACK -->
{#if $trackData}
  <TrackViewer
    let:trackElement
    trackData={$trackData}
  >
    <TrackElementTransform {trackElement}>
      <TrackElement {trackElement} />
    </TrackElementTransform>
  </TrackViewer>
{/if}

<!-- CAR -->
<Car
  active={$carActive}
  volume={$carVolume}
/>
