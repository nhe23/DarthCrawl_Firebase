<script>
  import { onMount, onDestroy } from "svelte";
  import { interval, from } from "rxjs";
  import { flatMap, map, takeWhile } from "rxjs/operators";
  import Spinner from "../../utils/Spinner.svelte";
  export let formValues;
  export let continueDisabled;

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

  function setContinueDisabled() {
    continueDisabled = !formValues.passwordValid;
  }

  onMount(() => {
    setContinueDisabled();
  });

  onDestroy(() => {
    subscribe.unsubscribe();
  });
</script>

<div>
  Please verify your email by clickling the link in the verification mail we
  just sent you. This view will automatically update once email is verified.
  {#if !userVerified}
    <Spinner />
  {/if}

</div>
