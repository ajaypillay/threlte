<script lang="ts">
  import { actions } from '../../../../stores/app'
  import { useKeyPress } from '../../../../useKeyPress'

  useKeyPress('Enter', () => {
    actions.startTrackValidationCountIn()
  })
</script>
