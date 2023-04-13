<script lang="ts">
  import UiWrapper from '../../UI/UiWrapper.svelte'
  import BackButton from '../../UI/components/BackButton.svelte'
  import Button from '../../UI/components/Button.svelte'
  import Card from '../../UI/components/Card.svelte'
  import Checkbox from '../../UI/components/Checkbox.svelte'
  import TextInput from '../../UI/components/TextInput.svelte'
  import TopBarLayout from '../../UI/layouts/TopBarLayout.svelte'
  import { actions, appState } from '../../stores/app'
  import { useKeyDown } from '../../utils/useKeyDown'

  const { audio, video } = appState.options

  useKeyDown('Escape', () => {
    actions.goToMainMenu()
  })

  let oldPlayerName = appState.options.player.name.current
</script>

<UiWrapper>
  <TopBarLayout>
    <BackButton
      slot="topbar-left"
      on:click={() => {
        actions.goToMainMenu()
      }}
    />
    <div slot="topbar-center">OPTIONS</div>

    <div class="flex flex-col gap-[15px] w-1/2">
      <Card class="flex flex-col items-start justify-start">
        <div class="mb-[10px]">Audio</div>

        <Checkbox
          forceFocusOnMount
          class="pl-0"
          checked={audio.music.current}
          on:change={(value) => {
            actions.setMusic(value.detail)
          }}
        >
          Music
        </Checkbox>

        <Checkbox
          class="pl-0"
          checked={audio.sfx.current}
          on:change={(value) => {
            actions.setSfx(value.detail)
          }}
        >
          SFX
        </Checkbox>
      </Card>

      <Card class="flex flex-col items-start justify-start">
        <div class="mb-[10px]">Video</div>

        <Checkbox
          class="pl-0"
          checked={video.shadows.current}
          on:change={(value) => {
            actions.setShadows(value.detail)
          }}
        >
          SHADOWS
        </Checkbox>
        <Checkbox
          class="pl-0"
          checked={video.postprocessing.current}
          on:change={(value) => {
            actions.setPostprocessing(value.detail)
          }}
        >
          POST PROCESSING
        </Checkbox>
      </Card>

      <Card class="flex flex-col items-start justify-start">
        <div class="mb-[10px]">Player</div>

        <TextInput
          class="mb-[10px]"
          label="Name"
          id="name"
          bind:value={oldPlayerName}
        />
        <div class="pb-[2px]">
          <Button
            class="bg-[#e8e8e8] hover:bg-[#d6d6d6] focus:bg-[#d6d6d6]"
            disabled={!oldPlayerName.length}
            on:click={() => {
              actions.setPlayerName(oldPlayerName)
            }}
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  </TopBarLayout>
</UiWrapper>
