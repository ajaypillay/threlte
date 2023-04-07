<script lang="ts">
  import type { ISheetObject } from '@theatre/core'
  import type { CurrentWritable } from '@threlte/core'
  import { onDestroy } from 'svelte'

  export let object: ISheetObject
  export let trackSheetObjects: CurrentWritable<Record<string, ISheetObject>>

  trackSheetObjects.update((sheetObjects) => {
    sheetObjects[object.address.objectKey] = object
    return sheetObjects
  })

  onDestroy(() => {
    trackSheetObjects.update((sheetObjects) => {
      delete sheetObjects[object.address.objectKey]
      return sheetObjects
    })
  })
</script>
