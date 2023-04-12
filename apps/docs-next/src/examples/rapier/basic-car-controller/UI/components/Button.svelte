<script lang="ts">
  import { c } from '../../../../../lib/classes'

  export let size: 'small' | 'large' = 'large'
  export let disabled = false

  let _class = ''
  export { _class as class }
</script>

<button
  on:click
  {disabled}
  class={c(
    'bg-white rounded-sm text-black hover:bg-black hover:text-white uppercase [&_svg]:!fill-current flex flex-row gap-2 items-center justify-center',
    size === 'small'
      ? 'px-2 [&_svg]:h-[0.75em] [&_svg]:w-[0.75em] text-[0.5em]'
      : 'px-3 [&_svg]:h-[1em] [&_svg]:w-[1em]',
    disabled ? 'opacity-50 cursor-not-allowed !bg-white !text-black' : '',
    _class
  )}
>
  <slot />
</button>
