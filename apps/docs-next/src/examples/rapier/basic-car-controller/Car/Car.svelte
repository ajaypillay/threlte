<script lang="ts">
  import { T, useThrelte } from '@threlte/core'
  import { Portal } from '@threlte/extras'
  import { DEG2RAD } from 'three/src/math/MathUtils'
  import RaycastVehicleController from './RaycastVehicleController.svelte'
  import MuscleCar from './Models/MuscleCar.svelte'
  import MuscleCarWheel from './Models/MuscleCarWheel.svelte'
  import { sunPos } from '../config'
  import { actions } from '../stores/app'
  import { PerspectiveCamera, Quaternion, Vector3 } from 'three'

  let carCam: PerspectiveCamera
  let freezeCam: PerspectiveCamera

  let respawnCar: () => void
  export let debug = false
  export let active = false
  export let useCarCamera = true
  export let freezeCamera = false
  export let volume = 1

  export const respawn = () => {
    respawnCar?.()
  }

  // The car is respawning on certain events
  actions.use('softResetTimeAttack', respawn)
  actions.use('resetTimeAttack', respawn)

  const { scene } = useThrelte()

  $: camera =
    useCarCamera && !freezeCamera ? 'car' : useCarCamera && freezeCamera ? 'carFreeze' : 'default'

  $: if (freezeCamera) {
    carCam.updateMatrix()
    const carCamWorldPosition = new Vector3()
    carCam.getWorldPosition(carCamWorldPosition)
    const carCamWorldQuaternion = new Quaternion()
    carCam.getWorldQuaternion(carCamWorldQuaternion)

    freezeCam.position.copy(carCamWorldPosition)
    freezeCam.quaternion.copy(carCamWorldQuaternion)
  }
</script>

<T.PerspectiveCamera
  bind:ref={freezeCam}
  slot="camera"
  fov={70}
  makeDefault={camera === 'carFreeze'}
/>

<RaycastVehicleController
  bind:respawn={respawnCar}
  {debug}
  {active}
  {volume}
>
  <T.PerspectiveCamera
    bind:ref={carCam}
    slot="camera"
    rotation={[-90 * DEG2RAD, 75 * DEG2RAD, 90 * DEG2RAD]}
    fov={70}
    makeDefault={camera === 'car'}
  />

  <svelte:fragment
    slot="body"
    let:carState
  >
    <T.Group rotation.y={(-90 * Math.PI) / 180}>
      <MuscleCar isBraking={carState.isBraking} />
    </T.Group>
  </svelte:fragment>

  <T.Group
    rotation.y={(90 * Math.PI) / 180}
    slot="wheel-fl"
  >
    <MuscleCarWheel />
  </T.Group>

  <T.Group
    rotation.y={(90 * Math.PI) / 180}
    slot="wheel-fr"
  >
    <MuscleCarWheel />
  </T.Group>

  <T.Group
    rotation.y={(90 * Math.PI) / 180}
    slot="wheel-rl"
  >
    <MuscleCarWheel />
  </T.Group>

  <T.Group
    rotation.y={(90 * Math.PI) / 180}
    slot="wheel-rr"
  >
    <MuscleCarWheel />
  </T.Group>

  <svelte:fragment let:carState>
    <T.DirectionalLight
      intensity={0.4}
      position.x={carState.worldPosition.x + sunPos[0] * 10}
      position.y={carState.worldPosition.y + sunPos[1] * 10}
      position.z={carState.worldPosition.z + sunPos[0] * 10}
      shadow.camera.left={-10}
      shadow.camera.right={10}
      shadow.camera.top={10}
      shadow.camera.bottom={-10}
      castShadow
      let:ref
    >
      <Portal object={scene}>
        <T
          is={ref.target}
          position.x={carState.worldPosition.x}
          position.y={carState.worldPosition.y}
          position.z={carState.worldPosition.z}
        />
      </Portal>
    </T.DirectionalLight>
  </svelte:fragment>
</RaycastVehicleController>
