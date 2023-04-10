<script lang="ts">
  import Car from '../../../Car/Car.svelte'
  import CountIn from '../../../UI/Common/CountIn.svelte'
  import { actions, gameState } from '../../../stores/app'
  import { useGameIsPausable } from '../../../useGameIsPausable'
  import GameTime from '../../GameTime.svelte'
  import type { TrackData } from '../../TrackData/TrackData'
  import TrackElement from '../../TrackViewer/TrackElement.svelte'
  import TrackElementTransform from '../../TrackViewer/TrackElementTransform.svelte'
  import TrackViewer from '../../TrackViewer/TrackViewer.svelte'
  import ValidationFinished from './UI/ValidationFinished.svelte'
  import ValidationInProgress from './UI/ValidationInProgress.svelte'
  import ValidationIntro from './UI/ValidationIntro.svelte'
  import ValidationPaused from './UI/ValidationPaused.svelte'

  const { paused, trackEditor } = gameState
  const { validation } = trackEditor
  const { state } = validation

  export let trackData: TrackData

  $: carActive = ($state === 'validation' || $state === 'finished') && !$paused

  useGameIsPausable()

  actions.use('finishReached', () => {
    actions.trackValidationFinished(1000)
  })
</script>

{#if $paused}
  <ValidationPaused />
{:else}
  <!-- UI -->
  {#if $state === 'intro'}
    <ValidationIntro />
  {:else if $state === 'count-in'}
    <CountIn
      on:countindone={() => {
        actions.startTrackValidationPlaying()
      }}
    />
  {:else if $state === 'validation'}
    <ValidationInProgress />
  {:else if $state === 'finished'}
    <ValidationFinished />
  {/if}
{/if}

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

<Car active={carActive} />
