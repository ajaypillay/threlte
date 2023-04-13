<script lang="ts">
  import { c } from '../../../../../lib/classes'
  import { useAudioProvider } from '../../AudioProvider.svelte'
  import { appState } from '../../stores/app'
  import { useKeyboardNavigation } from '../KeyboardNavigation.svelte'

  export let size: 'small' | 'large' = 'large'
  export let disabled = false
  export let audioCues = true
  export let preventFocusOnFocusLost = false
  export let forceFocusOnMount = false
  export let style: 'regular' | 'grey' = 'regular'

  const styles: Record<typeof style, string> = {
    grey: 'bg-[#e8e8e8] hover:bg-[#d6d6d6] focus:bg-[#d6d6d6] hover:!text-black focus:!text-black',
    regular: 'bg-white text-black hover:bg-black hover:text-white focus:bg-black focus:text-white'
  }

  const { sfx } = appState.options.audio

  let _class = ''
  export { _class as class }

  const { playAudio } = useAudioProvider()

  const onPointerEnter = async () => {
    if (!$sfx) return
    if (!audioCues) return
    playAudio('buttonHover', {
      detune: -300,
      volume: 0.3
    })
  }

  const onClick = async () => {
    if (!$sfx) return
    if (!audioCues) return
    playAudio('buttonHover', {
      detune: 300
    })
  }

  const { keyboardNavigationAction } = useKeyboardNavigation()
</script>

<button
  use:keyboardNavigationAction={{
    forceFocus: forceFocusOnMount,
    preventFocusOnFocusLost: preventFocusOnFocusLost
  }}
  on:pointerenter={onPointerEnter}
  on:click={onClick}
  on:click
  {disabled}
  class={c(
    'rounded-sm uppercase [&_svg]:!fill-current flex flex-row gap-2 items-center justify-center [&_img]:block [&_img]:p-[2px] outline-none',
    size === 'small'
      ? 'px-2 [&_svg]:h-[0.75em] [&_svg]:w-[0.75em] [&_img]:h-[0.75em] [&_img]:w-[0.75em] text-[0.5em]'
      : 'px-3 [&_svg]:h-[1em] [&_svg]:w-[1em] [&_img]:h-[1em] [&_img]:w-[1em]',
    styles[style],
    _class
  )}
>
  <slot />
</button>
