<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls, interactivity } from '@threlte/extras'
  import type { TrackData } from '../../TrackData/TrackData'
  import TrackElement from '../../TrackViewer/TrackElement.svelte'
  import TrackElementTransform from '../../TrackViewer/TrackElementTransform.svelte'
  import TrackViewer from '../../TrackViewer/TrackViewer.svelte'
  import TrackEditorElementSelection from './TrackEditorElementSelection.svelte'
  import TrackEditorElementSelector from './TrackEditorElementSelector.svelte'
  import TrackEditorElementTransformControls from './TrackEditorElementTransformControls.svelte'
  import AddElement from './UI/AddOrReplaceElement.svelte'
  import DuplicateElement from './UI/DuplicateElement.svelte'
  import EditingPaused from './UI/EditingPaused.svelte'
  import ElementDetails from './UI/ElementDetails.svelte'
  import RemoveElement from './UI/RemoveElement.svelte'
  import SaveTrack from './UI/SaveTrack.svelte'
  import StartTrackValidation from './UI/StartTrackValidation.svelte'
  import TrackDetails from './UI/TrackDetails.svelte'
  import { createTrackEditorContext } from './context'
  import { actions, gameState } from '../../stores/app'
  import { useKeyDown } from '../../utils/useKeyDown'
  import { useKeyUp } from '../../utils/useKeyUp'
  import { useGameIsPausable } from '../../utils/useGameIsPausable'
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import Car from '../../Car/Car.svelte'

  export let trackData: TrackData

  const { paused } = gameState
  const { view } = gameState.trackEditor.editing

  $: carActive = $view === 'car' && !$paused

  interactivity()

  const { currentlySelectedElement, transformMode, transformSpace, transformSnap } =
    createTrackEditorContext(trackData)

  useKeyDown('t', () => {
    transformMode.set('translate')
  })

  useKeyDown('r', () => {
    transformMode.set('rotate')
  })

  useKeyDown('g', () => {
    transformSpace.update((space) => {
      if (space === 'local') {
        return 'world'
      } else {
        return 'local'
      }
    })
  })

  useKeyDown('Shift+D', () => {
    if (!$currentlySelectedElement) return
    const newElement = trackData.duplicateTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(newElement)
  })

  useKeyDown('Control+Backspace', () => {
    if (!$currentlySelectedElement) return
    trackData.removeTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(undefined)
  })

  useKeyDown('Shift', () => {
    transformSnap.set(true)
  })

  useKeyUp('Shift', () => {
    transformSnap.set(false)
  })

  useKeyDown('v', () => {
    if ($view === 'car') {
      actions.setTrackEditorView('orbit')
    } else {
      actions.setTrackEditorView('car')
    }
  })

  useGameIsPausable()

  useKeyDown('Enter', () => {
    if ($view === 'car') {
      actions.resetGameplay()
    }
  })
</script>

<!-- UI -->
{#if $paused}
  <EditingPaused />
{:else}
  <!-- else content here -->
  {#if $view === 'orbit'}
    <UiWrapper>
      <AddElement />
      {#if $currentlySelectedElement}
        <div class="absolute top-0 right-0">
          {#key $currentlySelectedElement.id}
            <ElementDetails currentlySelectedTrackElement={$currentlySelectedElement} />
          {/key}
        </div>
        <DuplicateElement />
        <RemoveElement />
      {/if}
      <StartTrackValidation />
      <SaveTrack />
      <TrackDetails />
    </UiWrapper>
  {/if}
{/if}

<!-- 3D -->
<TrackViewer
  {trackData}
  let:trackElement
>
  <TrackEditorElementTransformControls {trackElement} />

  <TrackElementTransform
    reactive
    {trackElement}
  >
    <TrackEditorElementSelector
      {trackElement}
      let:selected
    >
      <TrackElement {trackElement}>
        <svelte:fragment slot="track-element-selection">
          {#if selected}
            <TrackEditorElementSelection />
          {/if}
        </svelte:fragment>
      </TrackElement>
    </TrackEditorElementSelector>
  </TrackElementTransform>
</TrackViewer>

<Car
  active={carActive}
  useCarCamera={carActive}
  volume={carActive ? 1 : 0}
/>

<T.PerspectiveCamera
  makeDefault={!carActive}
  on:create={({ ref }) => {
    ref.position.set(30, 30, 30)
    ref.lookAt(0, 0, 0)
  }}
>
  <OrbitControls />
</T.PerspectiveCamera>
