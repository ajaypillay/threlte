<script lang="ts">
  import { T, useThrelte } from '@threlte/core'
  import { OrbitControls, Portal } from '@threlte/extras'
  import { derived } from 'svelte/store'
  import { PerspectiveCamera, Quaternion, Vector3 } from 'three'
  import { DEG2RAD } from 'three/src/math/MathUtils'
  import Car from './Car.svelte'
  import CountIn from './CountIn.svelte'
  import Track from './Track/Track.svelte'
  import MuscleCar from './MuscleCar.svelte'
  import MuscleCarWheel from './MuscleCarWheel.svelte'
  import GamePauseMenu from './UI/GamePauseMenu.svelte'
  import TrackIntroMenu from './UI/TrackIntroMenu.svelte'
  import TimeAttackFinished from './UI/TimeAttackFinished.svelte'
  import TimeAttackUi from './UI/TimeAttackUi.svelte'
  import { actions, appState, gameState } from './stores/app'
  import { useKeyDown } from './useKeyDown'
  import { useKeyPress } from './useKeyPress'
  import LoadingUi from './UI/LoadingUi.svelte'
  import { sunPos } from './config'

  const { gameType, trackState, trackEditor, paused, trackId } = gameState
  const { view } = trackEditor
  const { visibility, debug } = appState

  useKeyPress('Enter', () => {
    if ($trackState === 'track-intro') {
      // when we're in the track editor, we jump straight to game play without a
      // count-in.
      if ($gameType === 'track-editor') {
        actions.startGamePlay()
      } else {
        // For other game modes, we start the count-in.
        actions.startCountIn()
      }
    }
    if ($trackState === 'finished' && $gameType === 'time-attack') {
      actions.resetTimeAttack()
    }
    if ($trackState === 'playing' && $gameType === 'time-attack') {
      actions.softResetTimeAttack()
    }
  })

  useKeyDown('Escape', () => {
    actions.toggleGamePaused()
  })

  const carActive = derived(
    [gameType, trackState, visibility, view, paused],
    ([gameType, trackState, visibility, view, paused]) => {
      if (visibility === 'hidden') return false
      if (gameType === 'track-editor' && view === 'editor') return false
      if (paused) return false
      if (trackState === 'playing' || trackState === 'finished') return true
      return false
    }
  )

  const showCountIn = derived([gameType, trackState, paused], ([gameType, trackState, paused]) => {
    if (gameType === 'track-editor') return false
    if (trackState !== 'count-in') return false
    if (paused) return false
    return true
  })

  const showTrackIntro = derived(
    [gameType, view, trackState, paused],
    ([gameType, view, trackState, paused]) => {
      if (paused) return false
      if (trackState !== 'track-intro') return false
      if (gameType === 'track-editor' && view === 'editor') return false
      return true
    }
  )

  const showTimeAttackUi = derived(
    [gameType, trackState, paused],
    ([gameType, trackState, paused]) => {
      if (gameType !== 'time-attack') return false
      if (trackState !== 'playing') return false
      if (paused) return false
      return true
    }
  )

  const carVolume = derived([paused, gameType, view], ([paused, gameType, view]) => {
    if (paused) return 0
    if (gameType === 'track-editor' && view === 'editor') return 0
    return 1
  })

  const showTimeAttackFinishedUi = derived([gameType, trackState], ([gameType, trackState]) => {
    if (gameType !== 'time-attack') return false
    if (trackState !== 'finished') return false
    return true
  })

  const showTrack = derived(trackState, (trackState) => {
    return trackState !== 'loading-track'
  })

  let gameCam: PerspectiveCamera
  let finishCam: PerspectiveCamera

  const { scene } = useThrelte()

  const currentCam = derived([gameType, trackState, view], ([gameType, trackState, view]) => {
    if (gameType === 'track-editor' && view === 'editor') return 'edit'
    if (trackState === 'finished') return 'finish'
    return 'game'
  })

  let respawnCar: () => void

  const onTrackComplete = () => {
    const worldPosition = new Vector3()
    const worldQuaternion = new Quaternion()
    gameCam.getWorldPosition(worldPosition)
    gameCam.getWorldQuaternion(worldQuaternion)
    finishCam.position.copy(worldPosition)
    finishCam.quaternion.copy(worldQuaternion)
    actions.trackFinished()
  }

  actions.use('softResetTimeAttack', () => {
    respawnCar?.()
  })
  actions.use('resetTimeAttack', () => {
    respawnCar?.()
  })
</script>

{#if $trackState === 'loading-track'}
  <LoadingUi />
{/if}

{#if $showTimeAttackUi}
  <TimeAttackUi />
{/if}

{#if $paused}
  <GamePauseMenu />
{/if}

{#if $showTimeAttackFinishedUi}
  <TimeAttackFinished />
{/if}

{#if $showTrackIntro}
  <TrackIntroMenu trackId={$trackId} />
{/if}

{#if $showCountIn}
  <CountIn
    on:countindone={() => {
      actions.startGamePlay()
    }}
  />
{/if}

<T.Group visible={$showTrack}>
  <Track
    on:trackcomplete={() => {
      onTrackComplete()
    }}
    on:trackloaded={() => {
      actions.trackLoaded()
    }}
  >
    <!-- FINISH CAM -->
    <T.PerspectiveCamera
      bind:ref={finishCam}
      makeDefault={$currentCam === 'finish'}
      fov={70}
    />

    <Car
      bind:respawn={respawnCar}
      debug={$debug}
      active={$carActive}
      volume={$carVolume}
    >
      <T.PerspectiveCamera
        bind:ref={gameCam}
        slot="camera"
        rotation={[-90 * DEG2RAD, 75 * DEG2RAD, 90 * DEG2RAD]}
        fov={70}
        makeDefault={$currentCam === 'game'}
      />

      <svelte:fragment
        slot="body"
        let:carState
      >
        <T.Group rotation.y={(-90 * Math.PI) / 180}>
          <MuscleCar isBraking={carState.isBraking} />
        </T.Group>
      </svelte:fragment>

      <T.Group
        rotation.y={(90 * Math.PI) / 180}
        slot="wheel-fl"
      >
        <MuscleCarWheel />
      </T.Group>

      <T.Group
        rotation.y={(90 * Math.PI) / 180}
        slot="wheel-fr"
      >
        <MuscleCarWheel />
      </T.Group>

      <T.Group
        rotation.y={(90 * Math.PI) / 180}
        slot="wheel-rl"
      >
        <MuscleCarWheel />
      </T.Group>

      <T.Group
        rotation.y={(90 * Math.PI) / 180}
        slot="wheel-rr"
      >
        <MuscleCarWheel />
      </T.Group>

      <svelte:fragment let:carState>
        <T.DirectionalLight
          intensity={0.4}
          position.x={carState.worldPosition.x + sunPos[0] * 10}
          position.y={carState.worldPosition.y + sunPos[1] * 10}
          position.z={carState.worldPosition.z + sunPos[0] * 10}
          shadow.camera.left={-10}
          shadow.camera.right={10}
          shadow.camera.top={10}
          shadow.camera.bottom={-10}
          castShadow
          let:ref
        >
          <Portal object={scene}>
            <T
              is={ref.target}
              position.x={carState.worldPosition.x}
              position.y={carState.worldPosition.y}
              position.z={carState.worldPosition.z}
            />
          </Portal>
        </T.DirectionalLight>
      </svelte:fragment>
    </Car>

    <!-- Track editing camera -->
    <T.PerspectiveCamera
      position.x={30}
      position.y={30}
      position.z={30}
      fov={70}
      makeDefault={$currentCam === 'edit'}
    >
      <OrbitControls />
    </T.PerspectiveCamera>
  </Track>
</T.Group>
