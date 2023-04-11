<script lang="ts">
  import CommonGamePlay from '../../CommonGamePlay/CommonGamePlay.svelte'
  import type { TrackData } from '../../TrackData/TrackData'
  import { actions, gameState } from '../../stores/app'
  import ValidationFinished from './UI/ValidationFinished.svelte'
  import ValidationInProgress from './UI/ValidationInProgress.svelte'
  import ValidationIntro from './UI/ValidationIntro.svelte'
  import ValidationPaused from './UI/ValidationPaused.svelte'

  export let trackData: TrackData

  actions.use('finishReached', () => {
    const time = gameState.common.time.current
    trackData.validate(time)
  })
</script>

<CommonGamePlay>
  <ValidationPaused slot="ui-paused" />

  <ValidationIntro slot="ui-intro" />

  <ValidationInProgress slot="ui-playing" />

  <ValidationFinished
    {trackData}
    slot="ui-finished"
  />
</CommonGamePlay>
