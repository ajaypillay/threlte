<script lang="ts">
  import UiWrapper from '../../../UI/UiWrapper.svelte'
  import { actions } from '../../../stores/app'
  import { useKeyDown } from '../../../utils/useKeyDown'

  useKeyDown('Enter', () => {
    actions.startTrackValidationCountIn()
  })
</script>

<UiWrapper>
  To publish a track, you need to validate it. This will check that the track is valid and that it
  can be played. You will also set the author time for the track. Press enter to continue.
</UiWrapper>
