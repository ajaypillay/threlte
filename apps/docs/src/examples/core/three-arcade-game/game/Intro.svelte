<script lang="ts">
	import { Three, useFrame } from '@threlte/core'
	import { Edges, Text } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { tweened } from 'svelte/motion'
	import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { play, type ArcadeAudio } from '../sound'
	import { useTimeout } from './hooks/useTimeout'
	import { gameState } from './state'
	import ThrelteLogo from './ThrelteLogo.svelte'

	const { baseColor, state } = gameState

	const { timeout } = useTimeout()
	let audio: ArcadeAudio | undefined = undefined

	const logoScale = tweened(0)

	const showLogoAfter = 2e3
	const showThrelteAfter = showLogoAfter + 1e3
	const showPressSpaceToStartAfter = showThrelteAfter + 2e3

	timeout(() => {
		audio = play('levelSlow', {
			loop: true,
			volume: 1
		})
		logoScale.set(1)
		$state = 'await-intro-skip'
	}, showLogoAfter)

	const textScale = tweened(0)
	const textRotation = tweened(10)
	timeout(() => {
		textScale.set(1)
		textRotation.set(0)
	}, showThrelteAfter)

	let showPressSpaceToStart = false
	let blinkClock: 0 | 1 = 0
	timeout(() => {
		showPressSpaceToStart = true
	}, showPressSpaceToStartAfter)

	let intervalHandler = setInterval(() => {
		if (!showPressSpaceToStart) return
		blinkClock = blinkClock ? 0 : 1
	}, 500)
	onDestroy(() => {
		clearInterval(intervalHandler)
	})

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowLeft') {
			dir = -1
		} else if (e.key === 'ArrowRight') {
			dir = 1
		}
	}

	let rotationY = 0
	let dir = 1
	useFrame(() => {
		rotationY += 0.01 * dir
	})

	onDestroy(() => {
		audio?.source.stop()
	})
</script>

<svelte:window on:keydown={onKeyDown} />

<Three type={Group} position.z={-0.35}>
	<ThrelteLogo positionZ={-1.2} scale={$logoScale} />

	<Three
		type={Group}
		scale={$textScale}
		position.z={1.3}
		rotation.x={-90 * DEG2RAD}
		rotation.z={$textRotation}
	>
		<Three type={Mesh} position.y={-0.05}>
			<Three type={PlaneGeometry} args={[5.3, 1.8]} />
			<Three type={MeshBasicMaterial} transparent opacity={0} />
			<Edges color={$baseColor} />
		</Three>
		<Text
			font="/fonts/beefd.ttf"
			anchorX="50%"
			anchorY="50%"
			textAlign="center"
			fontSize={0.5}
			color={$baseColor}
			text={`THRELTE\nMASTER`}
		/>
	</Three>
</Three>

{#if showPressSpaceToStart}
	<Three
		type={Group}
		scale={$textScale}
		position.z={3.3}
		rotation.x={-90 * DEG2RAD}
		visible={!!blinkClock}
	>
		<Text
			font="/fonts/beefd.ttf"
			anchorX="50%"
			anchorY="50%"
			textAlign="center"
			fontSize={0.35}
			color={$baseColor}
			text={`PRESS SPACE TO START`}
		/>
	</Three>
{/if}
