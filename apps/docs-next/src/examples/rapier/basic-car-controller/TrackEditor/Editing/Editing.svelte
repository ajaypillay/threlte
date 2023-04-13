<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls, interactivity } from '@threlte/extras'
  import Car from '../../Car/Car.svelte'
  import type { TrackData } from '../../TrackData/TrackData'
  import { trackElementPrototypes } from '../../TrackElements/elements'
  import TrackElement from '../../TrackViewer/TrackElement.svelte'
  import TrackElementTransform from '../../TrackViewer/TrackElementTransform.svelte'
  import TrackViewer from '../../TrackViewer/TrackViewer.svelte'
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import Button from '../../UI/components/Button.svelte'
  import Card from '../../UI/components/Card.svelte'
  import TopBarLayout from '../../UI/layouts/TopBarLayout.svelte'
  import { actions, gameState } from '../../stores/app'
  import { useGameIsPausable } from '../../utils/useGameIsPausable'
  import { useKeyDown } from '../../utils/useKeyDown'
  import { useKeyUp } from '../../utils/useKeyUp'
  import TrackEditorElementSelection from './TrackEditorElementSelection.svelte'
  import TrackEditorElementSelector from './TrackEditorElementSelector.svelte'
  import TrackEditorElementTransformControls from './TrackEditorElementTransformControls.svelte'
  import AddElement from './UI/AddOrReplaceElement.svelte'
  import DuplicateElement from './UI/DuplicateElement.svelte'
  import EditingPaused from './UI/EditingPaused.svelte'
  import ElementDetails from './UI/ElementDetails.svelte'
  import RemoveElement from './UI/RemoveElement.svelte'
  import RotateElement from './UI/RotateElement.svelte'
  import { createTrackEditorContext } from './context'
  import { Euler } from 'three'
  import { DEG2RAD } from 'three/src/math/MathUtils'

  export let trackData: TrackData

  const { paused } = gameState
  const { view } = gameState.trackEditor.editing

  $: carActive = $view === 'car' && !$paused

  const validated = trackData.validated

  interactivity()

  const { currentlySelectedElement, transformMode, transformSpace, transformSnap } =
    createTrackEditorContext(trackData)

  $: currentlySelectedElementType = $currentlySelectedElement?.type

  useKeyDown('t', () => {
    if ($paused) return
    transformMode.set('translate')
  })

  useKeyDown('r', () => {
    if ($paused) return
    transformMode.set('rotate')
  })

  useKeyDown('Shift+R', () => {
    if ($paused) return
    if (!$currentlySelectedElement) return
    const euler = new Euler().set(...$currentlySelectedElement.rotation.current)
    // snap to the next 90 degree rotation on the y axis
    euler.y += 90 * DEG2RAD
    // modulo 360
    euler.y = euler.y % (Math.PI * 2)
    const newRotation = euler.toArray()
    trackData.setTrackElementRotation($currentlySelectedElement.id, newRotation as any)
  })

  useKeyDown('g', () => {
    if ($paused) return
    transformSpace.update((space) => {
      if (space === 'local') {
        return 'world'
      } else {
        return 'local'
      }
    })
  })

  useKeyDown('Shift+D', () => {
    if ($paused) return
    if (!$currentlySelectedElement) return
    const newElement = trackData.duplicateTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(newElement)
  })

  useKeyDown('Control+Backspace', () => {
    if ($paused) return
    if (!$currentlySelectedElement) return
    trackData.removeTrackElement($currentlySelectedElement.id)
    currentlySelectedElement.set(undefined)
  })

  useKeyDown('Shift', () => {
    if ($paused) return
    transformSnap.set(true)
  })

  useKeyUp('Shift', () => {
    if ($paused) return
    transformSnap.set(false)
  })

  useKeyDown('v', () => {
    if ($paused) return
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
      <TopBarLayout>
        <Button
          on:click={() => {
            actions.pauseGame()
          }}
          slot="topbar-left">Menu</Button
        >

        {#if $validated}
          <Card class="flex flex-col gap-[20px] max-w-[400px]">
            <div>Track is validated</div>

            <div class="text-[0.65em]">
              The track is validated and can be played. While the track is validated, you cannot
              edit it. If you want to edit the track, you have to unlock it first.
            </div>

            <div class="pb-[2px]">
              <Button
                style="red"
                on:click={() => {
                  trackData.invalidate()
                }}
              >
                Unlock
              </Button>
            </div>
          </Card>
        {/if}

        <div class="absolute bottom-0 left-0">
          <AddElement />
        </div>

        {#if $currentlySelectedElement && $currentlySelectedElementType}
          <div class="absolute bottom-0 right-0">
            <Card>
              <div class="mb-[20px]">
                {trackElementPrototypes[$currentlySelectedElementType].buttonLabel}
              </div>
              <div class="mb-[20px]">
                {#key $currentlySelectedElement.id}
                  <ElementDetails currentlySelectedTrackElement={$currentlySelectedElement} />
                {/key}
              </div>
              <div class="flex flex-row justify-between gap-[2px] text-[0.65em] pb-[2px]">
                <div class="flex flex-row gap-[2px]">
                  <DuplicateElement />
                  <RotateElement />
                </div>
                <RemoveElement />
              </div>
            </Card>
          </div>
        {/if}

        <!-- <div class="absolute w-full h-full left-0 top-0">
        </div> -->

        <!-- <div class="relative w-full h-full top-0 left-0">
        <StartTrackValidation />
        <SaveTrack />
        <TrackDetails />

        {#if $currentlySelectedElement && $currentlySelectedElementType}
          <div class="absolute top-0 right-0">
            <Card>
              <div class="mb-[10px]">
                {trackElementPrototypes[$currentlySelectedElementType].buttonLabel}
              </div>
              <div class="mb-[20px]">
                {#key $currentlySelectedElement.id}
                  <ElementDetails currentlySelectedTrackElement={$currentlySelectedElement} />
                {/key}
              </div>
              <div class="flex flex-row justify-between gap-[2px] text-[0.65em] pb-[2px]">
                <div class="flex flex-row gap-[2px]">
                  <DuplicateElement />
                  <RotateElement />
                </div>
                <RemoveElement />
              </div>
            </Card>
          </div>
        {/if}
      </div> -->
      </TopBarLayout>
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
