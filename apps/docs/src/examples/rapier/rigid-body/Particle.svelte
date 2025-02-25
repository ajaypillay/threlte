<script lang="ts" context="module">
	const geometry = new BoxBufferGeometry(1, 1, 1)
	const material = new MeshStandardMaterial()
	export const muted = writable(true)
</script>

<script lang="ts">
	import { Mesh, PositionalAudio, type Position, type Rotation } from '@threlte/core'
	import { Collider, RigidBody, type ContactEvent } from '@threlte/rapier'
	import { writable } from 'svelte/store'
	import { BoxBufferGeometry, MeshStandardMaterial } from 'three'
	import { clamp } from 'three/src/math/MathUtils'

	export let position: Position | undefined = undefined
	export let rotation: Rotation | undefined = undefined

	const audios: {
		threshold: number
		volume: number
		stop: (() => any) | undefined
		play: ((...args: any[]) => any) | undefined
		source: string
	}[] = new Array(9).fill(0).map((_, i) => {
		return {
			threshold: i / 10,
			play: undefined,
			stop: undefined,
			volume: (i + 2) / 10,
			source: `/audio/ball_bounce_${i + 1}.mp3`
		}
	})

	const fireSound = (e: ContactEvent) => {
		if ($muted) return
		const volume = clamp((e.detail.totalForceMagnitude - 30) / 1100, 0.1, 1)
		const audio = audios.find((a) => a.volume >= volume)
		audio?.stop?.()
		audio?.play?.()
	}
</script>

<RigidBody type={'dynamic'} {position} {rotation} on:contact={fireSound}>
	{#each audios as audio}
		<PositionalAudio
			autoplay={false}
			detune={600 - Math.random() * 1200}
			bind:stop={audio.stop}
			bind:play={audio.play}
			source={audio.source}
			volume={audio.volume}
		/>
	{/each}

	<Collider
		contactForceEventThreshold={30}
		restitution={0.4}
		shape={'cuboid'}
		args={[0.5, 0.5, 0.5]}
	/>
	<Mesh castShadow receiveShadow {geometry} {material} />
</RigidBody>
