<script lang="ts">
  import { actions } from '../../../stores/app'
  import { useKeyDown } from '../../../utils/useKeyDown'

  useKeyDown('Enter', () => {
    actions.goToCountIn()
  })
</script>

To publish a track, you need to validate it. This will check that the track is valid and that it can
be played. You will also set the author time for the track. Press enter to continue.
