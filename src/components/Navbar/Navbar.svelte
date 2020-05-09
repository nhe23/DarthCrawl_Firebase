<script>
  import  {Link}  from "../utils";
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
  .navend {
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .white {
    color: #ffffff;
    text-decoration: none;
  }
  .white:active {
    color: goldenrod;
    text-decoration: none;
  }

  .white:hover {
    background-color: goldenrod;
  }

  a:active {
    background-color: goldenrod;
  }
  .test {
    font-size: 1px;
  }
</style>

<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item">
      <Branding />
    </div>

    <div class="navend is-hidden-desktop">
      <Login />
      <a
        on:click={toggleBurger}
        class="navbar-burger burger is-dark"
        class:is-active={showBurger}
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

  </div>

  <div
    id="navbarBasicExample"
    class="navbar-menu is-dark"
    class:is-active={showBurger}>
    <div class="navbar-start">

      <Link className="navbar-item" to="/">Home</Link>
      <Link className="navbar-item" to="/mycrawls">My Crawls</Link>
      <Link className="navbar-item" to="/crawl">Crawl</Link>
      <Link className="navbar-item" to="/documentation">Documentation</Link>

      <div class="navbar-item has-dropdown" class:is-hoverable={!showBurger}>

        <a class="navbar-link" on:click={toggleNavbarlink}>
          <div>More</div>
        </a>
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

  </div>
  <div class="navend is-hidden-touch">
    <Login />
  </div>
</nav>
