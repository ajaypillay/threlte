<script lang="ts">
  import { menuState } from '../stores/app'
  import CampaignMenu from './CampaignMenu/CampaignMenu.svelte'
  import MainMenu from './MainMenu/MainMenu.svelte'
  import OptionsMenu from './OptionsMenu/OptionsMenu.svelte'
  import UserTracksMenu from './UserTracksMenu/UserTracksMenu.svelte'

  const { state } = menuState
</script>

{#if $state === 'campaign'}
  <CampaignMenu />
{:else if $state === 'main'}
  <MainMenu />
{:else if $state === 'user-tracks'}
  <UserTracksMenu />
{:else if $state === 'options'}
  <OptionsMenu />
{/if}
