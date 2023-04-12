<script lang="ts">
  import { c } from '../../../../../lib/classes'
  import { useAudioProvider } from '../../AudioProvider.svelte'
  import { appState } from '../../stores/app'

  export let size: 'small' | 'large' = 'large'
  export let disabled = false
  export let audioCues = true

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
</script>

<button
  on:pointerenter={onPointerEnter}
  on:click={onClick}
  on:click
  {disabled}
  class={c(
    'bg-white rounded-sm text-black hover:bg-black hover:text-white uppercase [&_svg]:!fill-current flex flex-row gap-2 items-center justify-center [&_img]:block [&_img]:p-[2px] outline-none',
    size === 'small'
      ? 'px-2 [&_svg]:h-[0.75em] [&_svg]:w-[0.75em] [&_img]:h-[0.75em] [&_img]:w-[0.75em] text-[0.5em]'
      : 'px-3 [&_svg]:h-[1em] [&_svg]:w-[1em] [&_img]:h-[1em] [&_img]:w-[1em]',
    disabled ? 'opacity-50 cursor-not-allowed !bg-white !text-black' : '',
    _class
  )}
>
  <slot />
</button>
