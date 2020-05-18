<script>
  import { Router, Link, Route } from "../components/Router";
  import { auth } from "../conf/firebase";
  import { authState, user } from "rxfire/auth";
  import { interval, from } from "rxjs";
  import { flatMap, map, takeWhile } from "rxjs/operators";
  import { userData } from "../services/firestore";
  import { updateQuota } from "../services/users";
  import Navbar from "./Navbar/Navbar.svelte";
  import SingupVerification from "./User/Signup/SignupStepVerification.svelte";
  import Crawl from "./Crawl/Crawl.svelte";
  import Home from "./Home.svelte";
  import Documentation from "./Documentation.svelte";
  import MyCrawls from "./Crawl/MyCrawls.svelte";

  let loadedUser;
  let loadedUserData;
  export let url = "";

  let userVerified = true;
  // function reload(currentUser) {
  //   if (!currentUser) return Promise.resolve("No User");
  //   console.log("Reload");
  //   return currentUser.reload();
  // }

  // const source = interval(2000).pipe(
  //   flatMap(() => from(reload(auth.currentUser))),
  //   map(() => {
  //     if (auth.currentUser) return auth.currentUser.emailVerified;
  //     return false;
  //   }),
  //   takeWhile(() => !userVerified)
  // );

  // const subscribe = source.subscribe(verified => {
  //   userVerified = verified;
  // });

  const unsubscribeUser = authState(auth).subscribe(async u => {
    loadedUser = u;
    if (u) {
      if (!u.emailVerified) {
        userVerified=false;
        u.sendEmailVerification()
          .then(function() {
            console.log("Email sent");
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      await updateQuota(u.uid);
      userData(u.uid).then(d =>
        d.subscribe(d => {
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
  {#if !userVerified}
    <SingupVerification />
  {/if}
  <Router {url}>
    <Navbar />
    <div>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/mycrawls">
        {#if loadedUser && loadedUserData}
          <MyCrawls uid={loadedUser.uid} {loadedUserData} />
        {:else}NOT LOGGED IN{/if}
      </Route>
      <Route path="/crawl">
        {#if loadedUser && loadedUserData}
          <Crawl uid={loadedUser.uid} {loadedUserData} />
        {:else}NOT LOGGED IN{/if}
      </Route>
      <Route path="documentation">Just google it</Route>

    </div>
  </Router>
</main>
