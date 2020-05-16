<script>
  import { Link } from "../Router";
  import Branding from "./Branding.svelte";
  import UserActions from "./UserActions.svelte";

  let showBurger = false;
  let showDropdown = false;
  function toggleBurger() {
    showBurger = !showBurger;
  }

  function toggleNavbarlink() {
    showDropdown = !showDropdown;
  }

  function linkClick(e) {
    e.preventDefault();
    showBurger = false;
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
    margin-right:10px;
    display: flex;
    align-items: center;
  }
</style>

<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item">
      <Link to="/" on:click={linkClick}>
        <Branding />
      </Link>

    </div>

    <div class="navend is-hidden-desktop">
      <UserActions />
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

  </div>

  <div id="navbarBasicExample" class="navbar-menu" class:is-active={showBurger}>
    <div class="navbar-start">

      <Link className="navbar-item" to="/mycrawls" on:click={linkClick}>
        My Crawls
      </Link>

      <Link className="navbar-item" to="/crawl" on:click={linkClick}>
        Crawl
      </Link>

      <Link className="navbar-item" to="/documentation" on:click={linkClick}>
        Documentation
      </Link>

      <div class="navbar-item has-dropdown is-hoverable">
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
    <UserActions />
  </div>
</nav>
