<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { Sound, useAudioProvider } from './AudioProvider.svelte'

  export let sound: Sound
  export let autostop = false

  const { playAudio } = useAudioProvider()

  let node: AudioBufferSourceNode

  onMount(() => {
    node = playAudio(sound)
  })

  onDestroy(() => {
    if (autostop && node) {
      node.stop()
    }
  })
</script>
