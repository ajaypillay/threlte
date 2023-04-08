<script lang="ts">
  import { T } from '@threlte/core'
  import { trackDataUtils } from '../Track/TrackEditor/utils/trackDataUtils'
  import TrackState from '../Track/TrackState.svelte'
  import TrackElement from '../Track/TrackViewer/TrackElement.svelte'
  import TrackElementTransform from '../Track/TrackViewer/TrackElementTransform.svelte'
  import TrackViewer from '../Track/TrackViewer/TrackViewer.svelte'
  import type { TrackData } from '../Track/types'
  import { actions, appState, gameState } from '../stores/app'
  import LoadEvent from '../Track/LoadEvent.svelte'
  import LoadingUi from '../UI/LoadingUi.svelte'
  import { derived } from 'svelte/store'
  import Car from '../Car/Car.svelte'
  import { useKeyPress } from '../useKeyPress'
  import { useKeyDown } from '../useKeyDown'

  // UI
  import TrackIntro from './UI/TrackIntro.svelte'
  import CountIn from './UI/CountIn.svelte'
  import TimeAttackUi from './UI/TimeAttackUi.svelte'
  import TimeAttackFinished from './UI/TimeAttackFinished.svelte'

  const { visibility } = appState
  const { trackId, timeAttack, paused } = gameState
  const { state } = timeAttack

  $: showTrack = $state !== 'loading'

  const getTrackData = async (): Promise<TrackData> => {
    const text = await import(`../Track/tracks/${$trackId}.json?raw`)
    return trackDataUtils.parseTrackData(text.default)
  }

  const showCountIn = derived([state, paused], ([state, paused]) => {
    if (state !== 'count-in') return false
    if (paused) return false
    return true
  })

  const showTrackIntro = derived([state, paused], ([state, paused]) => {
    if (paused) return false
    if (state !== 'track-intro') return false
    return true
  })

  const carActive = derived([state, visibility, paused], ([state, visibility, paused]) => {
    if (visibility === 'hidden') return false
    if (paused) return false
    if (state === 'playing' || state === 'finished') return true
    return false
  })

  const showTimeAttackUi = derived([state, paused], ([state, paused]) => {
    if (state !== 'playing') return false
    if (paused) return false
    return true
  })

  const carVolume = derived([paused], ([paused]) => {
    return paused ? 0 : 1
  })

  const showTimeAttackFinished = derived([state], ([state]) => {
    if (state !== 'finished') return false
    return true
  })

  useKeyPress('Enter', () => {
    if ($state === 'playing') {
      actions.softResetTimeAttack()
    }
  })

  useKeyDown('Escape', () => {
    actions.toggleGamePaused()
  })
</script>

<!-- UI -->
{#if !showTrack}
  <LoadingUi />
{/if}

{#if $showTrackIntro}
  <TrackIntro trackId={$trackId} />
{/if}

{#if $showCountIn}
  <CountIn
    on:countindone={() => {
      actions.timeAttackStartPlaying()
    }}
  />
{/if}

{#if $showTimeAttackUi}
  <TimeAttackUi />
{/if}

{#if $showTimeAttackFinished}
  <TimeAttackFinished />
{/if}

<!-- 3D -->
<T.Group visible={showTrack}>
  {#await getTrackData() then trackData}
    <LoadEvent
      on:trackloaded={() => {
        actions.timeAttackTrackLoaded()
      }}
    />
    <TrackState
      {trackData}
      on:trackcomplete={() => {
        actions.timeAttackFinish()
      }}
    >
      <TrackViewer
        let:trackElement
        {trackData}
      >
        <TrackElementTransform {trackElement}>
          <TrackElement {trackElement} />
        </TrackElementTransform>
      </TrackViewer>
    </TrackState>
  {/await}

  <Car
    active={$carActive}
    volume={$carVolume}
  />
</T.Group>
