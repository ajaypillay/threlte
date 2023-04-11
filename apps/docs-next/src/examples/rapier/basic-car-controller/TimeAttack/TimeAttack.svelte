<script lang="ts">
  import { derived } from 'svelte/store'
  import Car from '../Car/Car.svelte'
  import GameTime from '../Common/GameTime.svelte'
  import { actions, appState, gameState } from '../stores/app'
  import { useKeyPress } from '../utils/useKeyPress'

  // UI
  import type { TrackData } from '../TrackData/TrackData'
  import CountIn from '../UI/Common/CountIn.svelte'
  import TimeAttackPaused from './UI/TimeAttackPaused.svelte'
  import { useGameIsPausable } from '../utils/useGameIsPausable'
  import TimeAttackFinished from './UI/TimeAttackFinished.svelte'
  import TimeAttackUi from './UI/TimeAttackUi.svelte'
  import TrackIntro from './UI/TrackIntro.svelte'
  import TrackViewer from '../TrackViewer/TrackViewer.svelte'
  import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
  import TrackElement from '../TrackViewer/TrackElement.svelte'

  export let trackData: TrackData

  const { visibility } = appState
  const { timeAttack, paused } = gameState
  const { state } = timeAttack

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

  useGameIsPausable()

  actions.use('finishReached', () => {
    actions.timeAttackFinish()
  })
</script>

<!-- UI -->
{#if $showTrackIntro}
  <TrackIntro />
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

{#if $paused}
  <TimeAttackPaused />
{/if}

<!-- 3D -->
<GameTime>
  <TrackViewer
    let:trackElement
    {trackData}
  >
    <TrackElementTransform {trackElement}>
      <TrackElement {trackElement} />
    </TrackElementTransform>
  </TrackViewer>
</GameTime>

<Car
  active={$carActive}
  volume={$carVolume}
/>
