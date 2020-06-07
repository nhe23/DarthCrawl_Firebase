<script>
  import { Router, Link, Route } from "../components/Router";
  import { userDbData } from "../store";
  import { auth, storageRef } from "../conf/firebase";
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
  import Profile from "./User/Profile/Profile.svelte";

  let loadedUser;
  let loadedUserData;
  const unsbscribeUserData = userDbData.subscribe(u => {
    loadedUserData = u;
  });
  export let url = "";

  let userVerified = true;

  const unsubscribeUser = authState(auth).subscribe(async u => {
    loadedUser = u;
    if (!u) return;

    if (!u.emailVerified) {
      userVerified = false;
      u.sendEmailVerification()
        .then(function() {
          console.log("Email sent");
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    await updateQuota(u.uid);
    const userData$ = await userData(u.uid);
    userData$.subscribe(async d => {
      let imgSrc;
      if (d && d.profilePicture) {
        imgSrc = await storageRef.child(d.profilePicture).getDownloadURL();
      }

      userDbData.set({ ...d, imgSrc });
    });
  });
</script>

<style>

</style>

<svelte:head>
<base href="/">
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
      <Route path="/">
        <Home />
      </Route>
      <Route path="/mycrawls">
        {#if loadedUser && loadedUserData}
          <MyCrawls uid={loadedUser.uid} {loadedUserData} />
        {:else}NOT LOGGED IN{/if}
      </Route>
      <Route path="/crawl">
        {#if loadedUser && $userDbData}
          <Crawl uid={loadedUser.uid} {loadedUserData} />
        {:else}NOT LOGGED IN{/if}
      </Route>
      <Route path="/documentation">
        <Documentation />
      </Route>


    <Route path="user/profile">
      {#if loadedUser && $userDbData}
        <Profile />
      {:else}NOT LOGGED IN{/if}
    </Route>
  </Router>
</main>
