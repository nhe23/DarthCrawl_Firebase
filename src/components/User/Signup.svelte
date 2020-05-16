<script>
  import { auth, googleProvider } from "../../conf/firebase";
  import GoogleLogin from "./GoogleLogin.svelte";
  let showDialog = false;
</script>

<div>
  <button
    class="button is-primary"
    on:click={() => {
      showDialog = true;
    }}>
    <strong>Register</strong>
  </button>

</div>
