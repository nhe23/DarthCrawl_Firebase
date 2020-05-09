<script>
  import { Router, Link, Route } from "svelte-routing";
  import { auth } from "../conf/firebase";
  import { authState } from "rxfire/auth";
  import { userData } from "../services/firestore";
  import { updateQuota } from "../services/users";
  import Navbar from "./Navbar/Navbar.svelte";
  import Crawl from "./Crawl/Crawl.svelte";
  import Home from "./Home.svelte";
  import Documentation from "./Documentation.svelte";
  import MyCrawls from "./Crawl/MyCrawls.svelte";

  let user;
  let loadedUserData;
  export let url = "";
  const unsubscribeUser = authState(auth).subscribe(async u => {
    user = u;
    if (u) {
      await updateQuota(u.uid);
      userData(u.uid).then(d =>
        d.subscribe(d => {
          console.log(d);
          loadedUserData = d;
        })
      );
    }
  });
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
    <div>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/mycrawls">
        {#if user && loadedUserData}
          <MyCrawls uid={user.uid} {loadedUserData} />
        {:else}NOT LOGGED IN{/if}
      </Route>
      <Route path="/crawl">
        {#if user && loadedUserData}
          <Crawl uid={user.uid} {loadedUserData} />
        {:else}NOT LOGGED IN{/if}
      </Route>
      <Route path="documentation">Just google it</Route>

    </div>
  </Router>
</main>
