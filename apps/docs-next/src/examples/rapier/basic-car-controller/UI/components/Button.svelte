<script lang="ts">
  import { c } from '../../../../../lib/classes'

  export let size: 'small' | 'large' = 'large'

  let _class = ''
  export { _class as class }
</script>

<button
  on:click
  class={c(
    size === 'small'
      ? 'px-1 bg-white border-2 border-black text-black hover:bg-black hover:text-white uppercase [&_svg]:h-[0.75em] [&_svg]:w-[0.75em] [&_svg]:!fill-current text-[0.5em]'
      : 'px-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white uppercase [&_svg]:h-[1em] [&_svg]:w-[1em] [&_svg]:!fill-current',
    _class
  )}
>
  <slot />
</button>
