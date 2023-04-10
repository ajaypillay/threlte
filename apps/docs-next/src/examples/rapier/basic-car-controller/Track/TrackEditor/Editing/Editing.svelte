<script lang="ts">
  import { T } from '@threlte/core'
  import Car from '../../../Car/Car.svelte'
  import { OrbitControls } from '@threlte/extras'
  import { actions, gameState } from '../../../stores/app'
  import { useKeyDown } from '../../../useKeyDown'
  import UiWrapper from '../../../UI/UiWrapper.svelte'
  import AddElement from './UI/AddElement.svelte'
  import { useTrackEditor } from '../context'
  import ElementDetails from './UI/ElementDetails.svelte'
  import ReplaceWithElement from './UI/ReplaceWithElement.svelte'
  import DuplicateElement from './UI/DuplicateElement.svelte'
  import RemoveElement from './UI/RemoveElement.svelte'
  import StartTrackValidation from './UI/StartTrackValidation.svelte'
  import SaveTrack from './UI/SaveTrack.svelte'
  import TrackDetails from './UI/TrackDetails.svelte'
  import TrackState from '../../TrackState.svelte'
  import TrackViewer from '../../TrackViewer/TrackViewer.svelte'
  import TrackEditorElementTransformControls from './TrackEditorElementTransformControls.svelte'
  import TrackElementTransform from '../../TrackViewer/TrackElementTransform.svelte'
  import TrackElement from '../../TrackViewer/TrackElement.svelte'
  import TrackEditorElementSelection from './TrackEditorElementSelection.svelte'
  import TrackEditorElementSelector from './TrackEditorElementSelector.svelte'
  import { useGameIsPausable } from '../../../useGameIsPausable'
  import EditingPaused from './UI/EditingPaused.svelte'

  const { paused } = gameState
  const { view } = gameState.trackEditor.editing
  const { currentlySelectedElement, trackData } = useTrackEditor()

  $: carActive = $view === 'car'

  useKeyDown('v', () => {
    if ($view === 'car') {
      actions.setTrackEditorView('orbit')
    } else {
      actions.setTrackEditorView('car')
    }
  })

  useGameIsPausable()
</script>

<!-- UI -->
{#if $paused}
  <EditingPaused />
{:else}
  <!-- else content here -->
  {#if $view === 'orbit'}
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
{/if}

<!-- 3D -->
<TrackState {trackData}>
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
