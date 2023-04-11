<script lang="ts">
  import { useTrackEditor } from '../context'

  const { trackData } = useTrackEditor()

  const trackName = trackData.trackName
  const authorName = trackData.authorName
</script>

<div class="text-[0.5em] flex flex-col gap-1 items-start">
  <label for="trackName">Track Name</label>
  <input
    class="pointer-events-auto"
    id="trackName"
    name="trackName"
    type="text"
    bind:value={$trackName}
  />
  <label for="trackName">Author Name</label>
  <input
    class="pointer-events-auto"
    id="authorName"
    name="authorName"
    type="text"
    bind:value={$authorName}
  />
</div>
