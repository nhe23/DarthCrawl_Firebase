<script>
  import { Link } from "svelte-routing";
  import Branding from "./Branding.svelte";
  import Login from "./Login.svelte";

  let showBurger = false;
  let showDropdown = false;
  function toggleBurger() {
    showBurger = !showBurger;
  }

  function toggleNavbarlink() {
    showDropdown = !showDropdown;
  }

    function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
    const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;

    // The object returned here is spread on the anchor element's attributes
    if (isActive) {
      return { class: "active" };
    }
    return {};
  }
</script>
  
<style>

</style>

<nav class="navbar is-light" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item">
      <Branding />
    </div>

    <a
      on:click={toggleBurger}
      class="navbar-burger burger"
      class:is-active={showBurger}
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarBasicExample">
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>

  </div>

  <div id="navbarBasicExample" class="navbar-menu" class:is-active={showBurger}>
    <div class="navbar-start">

      <a class="navbar-item"><Link on:click={()=> showBurger = !showBurger} to="/"><div>Home</div></Link></a>
      <a class="navbar-item"><Link getProps={getProps} on:click={()=> showBurger = !showBurger} to="/mycrawls"><div>My Crawls</div></Link></a>
      <a class="navbar-item"><Link on:click={()=> showBurger = !showBurger} to="/crawl"><div>Crawl</div></Link></a>
      <a class="navbar-item"><Link on:click={()=> showBurger = !showBurger} to="/documentation"><div>Documentation</div></Link></a>

      <div class="navbar-item has-dropdown" class:is-hoverable={!showBurger}>

        <a class="navbar-link" on:click={toggleNavbarlink}><div>More</div></a>
        {#if !showBurger || showDropdown}
          <div class="navbar-dropdown">
            <a class="navbar-item">About</a>
            <a class="navbar-item">Jobs</a>
            <a class="navbar-item">Contact</a>
            <hr class="navbar-divider" />
            <a class="navbar-item">Report an issue</a>
          </div>
        {/if}
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <Login />
      </div>
    </div>
  </div>
</nav>
