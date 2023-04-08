<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls, interactivity } from '@threlte/extras'
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import { useKeyDown } from '../../useKeyDown'
  import { useKeyUp } from '../../useKeyUp'
  import type { TrackData } from '../TrackData/TrackData'
  import TrackState from '../TrackState.svelte'
  import TrackElement from '../TrackViewer/TrackElement.svelte'
  import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
  import TrackViewer from '../TrackViewer/TrackViewer.svelte'
  import TrackEditorElementSelection from './TrackEditorElementSelection.svelte'
  import TrackEditorElementSelector from './TrackEditorElementSelector.svelte'
  import TrackEditorElementTransformControls from './TrackEditorElementTransformControls.svelte'
  import AddElement from './UI/AddElement.svelte'
  import DuplicateElement from './UI/DuplicateElement.svelte'
  import ElementDetails from './UI/ElementDetails.svelte'
  import RemoveElement from './UI/RemoveElement.svelte'
  import ReplaceWithElement from './UI/ReplaceWithElement.svelte'
  import SaveTrack from './UI/SaveTrack.svelte'
  import TrackDetails from './UI/TrackDetails.svelte'
  import { createTrackEditorContext } from './context'
  import StartTrackValidation from './UI/StartTrackValidation.svelte'
  import { gameState } from '../../stores/app'
  import Car from '../../Car/Car.svelte'

  export let trackData: TrackData

  const { state } = gameState.trackEditor

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
</script>

{#if $state === 'editing'}
  <UiWrapper>
    {#if !$currentlySelectedElement}
      <AddElement />
    {:else}
      <div class="absolute top-0 right-0">
        {#key $currentlySelectedElement.id}
          <ElementDetails currentlySelectedTrackElement={$currentlySelectedElement} />
        {/key}
      </div>
      <ReplaceWithElement />
      <DuplicateElement />
      <RemoveElement />
    {/if}
    <StartTrackValidation />
    <SaveTrack />
    <TrackDetails />
  </UiWrapper>
{/if}

<TrackState
  {trackData}
  on:trackcomplete={() => {
    trackData.setValidated(true)
  }}
>
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
</TrackState>

{#if $state === 'editing'}
  <T.PerspectiveCamera
    makeDefault
    position={[30, 30, 30]}
  >
    <OrbitControls />
  </T.PerspectiveCamera>
{:else if $state === 'validating'}
  <Car active />
{/if}
