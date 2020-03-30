<script>
  import { Router, Link, Route } from "svelte-routing";
  import { auth } from "../conf/firebase";
  import { authState } from "rxfire/auth";
  import Navbar from "./Navbar/Navbar.svelte";
  import Crawl from "./Crawl/Crawl.svelte";
  import Home from "./Home.svelte";
  import Documentation from "./Documentation.svelte"
  import MyCrawls from "./Crawl/MyCrawls.svelte"

  let user;
  export let url = "";
  const unsubscribeUser = authState(auth).subscribe(u => (user = u));
</script>

<style>
 
</style>

<svelte:head>
  <link rel="stylesheet" href="css/mystyles.css" />
  <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js">

  </script>
</svelte:head>
<main class="background">

  <Router {url}>
    <Navbar />
    <!-- {#if user}
    <Crawl uid={user.uid} />
  {/if} -->
    <div>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/mycrawls">{#if user}
          <MyCrawls uid={user.uid} />
          {:else}
            NOT LOGGED IN
        {/if}</Route>
      <Route path="/crawl">
        {#if user}
          <Crawl uid={user.uid} />
          {:else}
            NOT LOGGED IN
        {/if}
      </Route>
      <Route path="documentation">Just google it</Route>

    </div>
  </Router>
</main>
