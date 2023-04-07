<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  const dispatch = createEventDispatcher<{
    trackloaded: void
  }>()

  onMount(() => {
    dispatch('trackloaded')
  })
</script>
