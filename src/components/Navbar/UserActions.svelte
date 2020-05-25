<script>
  import { onDestroy } from "svelte";
  import { userDbData } from "../../store";
  import Signup from "../User/Signup/Signup.svelte";

  import { auth, googleProvider } from "../../conf/firebase";
  import { authState } from "rxfire/auth";
  import Login from "../User/Login.svelte";
  import ProfileModal from "../User/ProfileModal.svelte";

  let user;
  let userData;

  const unsubscribeUser = authState(auth).subscribe(u => {
    console.log(u);
    user = u});
  const userDbData$ = userDbData.subscribe(d => {
    console.log(d);
    userData=d});

  onDestroy(() => {
    unsubscribeUser.unsubscribe();
    userDbData$.unsubscribe();
  });
</script>

<style>

</style>

<div>
  {#if user && userData}
    <ProfileModal {user} />
  {:else}
    <div class="buttons">
      <Login />
      <Signup />
    </div>
  {/if}
</div>
