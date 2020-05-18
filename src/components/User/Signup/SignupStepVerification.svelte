<script>
  import { onMount, onDestroy } from "svelte";
  import { auth } from "../../../conf/firebase";
  import { interval, from } from "rxjs";
  import { flatMap, map, takeWhile } from "rxjs/operators";
  import Spinner from "../../utils/Spinner.svelte";

  let userVerified = false;
  function reload(currentUser) {
    if (!currentUser) return Promise.resolve("No User");
    console.log("Reload");
    return currentUser.reload();
  }

  const emailVerified$ = interval(2000).pipe(
    flatMap(() => from(reload(auth.currentUser))),
    map(() => {
      if (auth.currentUser) return auth.currentUser.emailVerified;
      return false;
    }),
    takeWhile(() => !userVerified)
  );

  const subscribe = emailVerified$.subscribe(verified => {
    userVerified = verified;
  });

  onDestroy(() => {
    subscribe.unsubscribe();
  });
</script>

<style>
  .spinnerContainer {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }

  .modal-card {
    max-width: 440px;
    min-height: 400px;
  }

  .modal-card-head {
    border-bottom: 0px;
    flex-flow: row-reverse;
    justify-content: space-between;
    padding-bottom: 10px;
  }
</style>

<div class="modal is-active" class:is-active={!userVerified}>
  <div class="modal-background" />
  <div class="modal-card">

    <header class="modal-card-head" />
    <section class="modal-card-body">
      <div class="has-text-white">
        Please verify your email by clickling the link in the verification mail
        we just sent you. This view will automatically update once email is
        verified.
        {#if !userVerified}
          <div class="spinnerContainer">
            <Spinner />
          </div>
        {/if}
      </div>
    </section>
  </div>
</div>
