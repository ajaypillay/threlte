<script lang="ts">
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'
  import { trackDataUtils } from '../utils/trackDataUtils'

  const { trackData } = useTrackEditor()

  // export trackData
  const onClick = () => {
    // stringify trackData
    const json = trackDataUtils.stringifyTrackData(trackData)

    // create a download link
    const link = document.createElement('a')
    link.download = trackData.trackName.current + '.json'
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(json)
    link.click()
  }
</script>

<Button
  size="small"
  on:click={onClick}>Save Track</Button
>
