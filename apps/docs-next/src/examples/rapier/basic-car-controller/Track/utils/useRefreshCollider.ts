import { watch } from '@threlte/core'
import { useTrackElement } from '../TrackViewer/TrackElement.svelte'
import { tick } from 'svelte'

export const useRefreshCollider = () => {
  let refreshFns: any[] = []

  const { position, rotation } = useTrackElement()

  watch([position, rotation], async () => {
    await tick()
    refreshFns.forEach((fn) => fn())
  })

  return {
    refreshFns
  }
}
