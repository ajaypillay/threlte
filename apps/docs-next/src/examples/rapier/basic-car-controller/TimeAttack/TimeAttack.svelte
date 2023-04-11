<script lang="ts">
  // UI
  import CommonGamePlay from '../CommonGamePlay/CommonGamePlay.svelte'
  import TimeAttackFinished from './UI/TimeAttackFinished.svelte'
  import TimeAttackPaused from './UI/TimeAttackPaused.svelte'
  import TimeAttackUi from './UI/TimeAttackUi.svelte'
  import TrackIntro from './UI/TrackIntro.svelte'
</script>

<CommonGamePlay>
  <TimeAttackPaused slot="ui-paused" />

  <TrackIntro slot="ui-intro" />

  <TimeAttackUi slot="ui-playing" />

  <TimeAttackFinished slot="ui-finished" />
</CommonGamePlay>
