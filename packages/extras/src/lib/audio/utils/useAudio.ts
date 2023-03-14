import { currentWritable, useLoader, watch } from '@threlte/core'
import { onDestroy } from 'svelte'
import { AudioLoader, type Audio, type PositionalAudio } from 'three'

type AudioSource = string | AudioBuffer | HTMLMediaElement | AudioBufferSourceNode | MediaStream
type AudioVolume = number | undefined
type AudioPlaybackRate = number | undefined

export type AudioProps = {
  src: AudioSource
  autoplay?: boolean
  loop?: boolean
  volume?: AudioVolume
  playbackRate?: AudioPlaybackRate
  detune?: number
}

/**
 * This hook handles basic audio functionality.
 */
export const useAudio = <T extends Audio<GainNode> | PositionalAudio>(audio: T) => {
  const loaded = currentWritable(false)
  const autoplay = currentWritable(false)
  const shouldPlay = currentWritable(false)

  const loader = useLoader(AudioLoader)

  const setSrc = async (source: AudioProps['src']) => {
    loaded.set(false)
    if (typeof source === 'string') {
      const audioBuffer = await loader.load(source)
      audio.setBuffer(audioBuffer)
    } else if (source instanceof AudioBuffer) {
      audio.setBuffer(source)
    } else if (source instanceof HTMLMediaElement) {
      audio.setMediaElementSource(source)
    } else if (source instanceof AudioBufferSourceNode) {
      audio.setNodeSource(source)
    } else if (source instanceof MediaStream) {
      audio.setMediaStreamSource(source)
    }
    loaded.set(true)
  }

  const setVolume = (volume: AudioProps['volume']) => {
    audio.setVolume(volume ?? 1)
  }

  const setPlaybackRate = (playbackRate: AudioProps['playbackRate']) => {
    audio.setPlaybackRate(playbackRate ?? 1)
  }

  const play = async (delay?: number | any) => {
    // source is not loaded yet, so we should play it after it's loaded
    if (!loaded.current) {
      shouldPlay.set(true)
      return
    }
    if (audio.context.state !== 'running') {
      await audio.context.resume()
    }
    return audio.play(delay)
  }

  const pause = () => {
    return audio.pause()
  }

  const stop = () => {
    if (!audio.source) return audio
    return audio.stop()
  }

  const setAutoPlay = (value?: AudioProps['autoplay']) => {
    autoplay.set(value ?? false)
  }

  const setDetune = (value?: AudioProps['detune']) => {
    if (audio.source && audio.source.detune) {
      audio.setDetune(value ?? 0)
    }
  }

  const setLoop = (value?: AudioProps['loop']) => {
    audio.setLoop(value ?? false)
  }

  watch([loaded, autoplay, shouldPlay], ([loaded, autoplay, shouldPlay]) => {
    if (!loaded) {
      if (audio.isPlaying) stop()
      return
    }
    if (autoplay || shouldPlay) {
      play()
    }
  })

  onDestroy(() => {
    if (audio.isPlaying) stop()
    if (audio.source) audio.disconnect()
  })

  return {
    setVolume,
    setSrc,
    setPlaybackRate,
    setAutoPlay,
    setDetune,
    setLoop,
    play,
    pause,
    stop
  }
}