import { currentWritable } from '@threlte/core'
import { onDestroy } from 'svelte'
import { derived } from 'svelte/store'

export const useArrowKeys = () => {
  type Key = 'ArrowUp' | 'ArrowLeft' | 'ArrowDown' | 'ArrowRight'

  const arrowKeys = currentWritable<Record<Key, boolean>>({
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false
  })

  const keys = Object.keys(arrowKeys.current) as string[]

  const onKeyDown = (e: KeyboardEvent) => {
    if (!keys.includes(e.key)) return
    e.preventDefault()
    arrowKeys.update((keys) => {
      keys[e.key as keyof typeof keys] = true
      return keys
    })
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (!keys.includes(e.key)) return
    e.preventDefault()
    arrowKeys.update((keys) => {
      keys[e.key as keyof typeof keys] = false
      return keys
    })
  }

  const axis = derived(arrowKeys, (wasdKeys) => {
    return {
      x: 0 + (wasdKeys.ArrowLeft ? 1 : 0) - (wasdKeys.ArrowRight ? 1 : 0),
      y: 0 + (wasdKeys.ArrowUp ? 1 : 0) - (wasdKeys.ArrowDown ? 1 : 0)
    }
  })

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  onDestroy(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  })

  return {
    axis,
    arrowKeys
  }
}
