<script lang="ts">
  import { Route } from 'fp-ts-routing'

  import Clock from './Clock.svelte'
  import { Location as RoutesLocation } from './routes'
  import { historyStore } from './stores/historyStore'

  $: route = Route.parse($historyStore.location.pathname)
  $: parsed = RoutesLocation.parse(route)
</script>

<style>
  a.selected {
    font-weight: bold;
  }
</style>

<main>
  <Clock />

  <nav>
    <a class:selected={RoutesLocation.match.home(route)} href={RoutesLocation.format.home}>Home</a>
    <a
      class:selected={RoutesLocation.match.create(route)}
      href={RoutesLocation.format.create}>Create</a>
  </nav>

  {#if parsed._tag === 'Home'}
    <p>Home</p>
  {:else if parsed._tag === 'Create'}
    <p>Create</p>
  {:else if parsed._tag === 'Race'}
    <p>Race {parsed.raceId}</p>
  {:else if parsed._tag === 'NotFound'}
    <p>NotFound</p>
  {/if}
</main>
