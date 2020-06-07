<script>
  import { userCrawls } from "../../services/firestore";
  import MyCrawl from "./MyCrawl.svelte";
  import QuotaUsed from "./QuotaUsed.svelte";
  export let uid;
  export let loadedUserData;
  let crawls = [];
  let filteredCrawls = [];
  let crawls$ = userCrawls(uid);
  let searchText = "";
  crawls$.subscribe(c => {
    crawls = c;
    if (searchText === "") {
      filteredCrawls = c;
    }
  });

  $: userHasQuotaLeft = loadedUserData.quotaUsed < loadedUserData.quota;

  function filterCrawls() {
    console.log("filtering");
    if (searchText === "") {
      filteredCrawls = crawls;
      return;
    }
    filteredCrawls = crawls.filter(c => {
      return (
        c.crawlName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.url.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }
</script>

<style>
  .input,
  .input:focus {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
    box-shadow: none;
  }

  .input:focus,
  .input:hover {
    border-bottom-color: white;
    border-bottom-width: 1px;
  }

  .headerColumn {
    display: flex;
    align-items: center;
  }
  .headerText {
    margin-right: 5px;
  }
</style>

<section class="hero is-small is-light is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">My Crawls</h1>
      <!-- <h2 class="subtitle">
         <Link to="/documentation">documentation</Link>
      </h2> -->
    </div>
  </div>
</section>
{#if !userHasQuotaLeft}
  <QuotaUsed />
{/if}
<section class="section">
  <div class="box has-background-grey has-text-white">
    <div class="columns">
      <div class="column is-3 headerColumn">
        <span class="headerText">Name</span>
        <span class="icon is-small has-text-primary">
          <i class="fas fa-chevron-up" />
        </span>
      </div>
      <div class="column is-2 headerColumn">
        <span class="headerText">Crawldate</span>
        <span class="icon is-small has-text-primary">
          <i class="fas fa-chevron-up" />
        </span>
      </div>
      <div class="column is-6">
        <div class="field">
          <p class="control has-icons-left">
            <input
              class="input has-background-grey has-text-white"
              bind:value={searchText}
              on:input={filterCrawls}
              type="text" />
            <span class="icon is-small is-left">
              <i class="fas fa-search has-text-white" />
            </span>
          </p>
        </div>
      </div>

      <div class="column is-1 headerColumn">

        <span class="icon">
          <i class="fas fa-filter has-text-primary" />
        </span>

      </div>

    </div>
  </div>
  {#each filteredCrawls as crawl}
    {#if crawl.createDate}
      <MyCrawl {crawl} {userHasQuotaLeft} />
    {/if}
  {/each}
</section>
