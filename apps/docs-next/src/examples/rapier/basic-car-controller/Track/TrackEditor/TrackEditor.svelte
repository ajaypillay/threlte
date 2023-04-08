<script lang="ts">
  import { interactivity } from '@threlte/extras'
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import { useKeyDown } from '../../useKeyDown'
  import { useKeyUp } from '../../useKeyUp'
  import TrackState from '../TrackState.svelte'
  import TrackElement from '../TrackViewer/TrackElement.svelte'
  import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
  import TrackViewer from '../TrackViewer/TrackViewer.svelte'
  import type { TrackData } from '../types'
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
  import { trackDataUtils } from './utils/trackDataUtils'

  export let trackData: TrackData

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
    const newElement = trackDataUtils.duplicateElement(trackData, $currentlySelectedElement.id)
    currentlySelectedElement.set(newElement)
  })
  useKeyDown('Control+Backspace', () => {
    if (!$currentlySelectedElement) return
    trackDataUtils.removeElement(trackData, $currentlySelectedElement.id)
    currentlySelectedElement.set(undefined)
  })
  useKeyDown('Shift', () => {
    transformSnap.set(true)
  })
  useKeyUp('Shift', () => {
    transformSnap.set(false)
  })
</script>

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
  <SaveTrack />
  <TrackDetails />
</UiWrapper>

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
