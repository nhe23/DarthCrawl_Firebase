<script>
  import { onDestroy } from "svelte";
  import { userCrawls } from "../../services/firestore";
  import { myCrawls } from "../../store";
  import MyCrawl from "./MyCrawl.svelte";
  import QuotaUsed from "./QuotaUsed.svelte";
  export let uid;
  export let loadedUserData;
  let crawls = [];
  let filteredCrawls;
  let userCralws = userCrawls(uid);
  let searchText = "";
  let nameSortedDesc = false;
  let dateSortedDesc = false;
  let myCrawlsLocal;

  const myCrawls$ = myCrawls.subscribe(m => {
    myCrawlsLocal = m;
    if (!filteredCrawls) return (filteredCrawls = myCrawlsLocal);

    filteredCrawls = filteredCrawls.map(f => {
      console.log(m);
      const storedCrawl = m.find(c => {
        console.log(c);
        return c.crawlName === f.crawlName;
      });
      return storedCrawl;
    });
  });

  const userCrawls$ = userCralws.subscribe(c => {
    if (!myCrawlsLocal) {
      const crawls = [];
      for (const crawl of c) {
        crawls.push({
          crawlName: crawl.crawlName,
          dbCrawl: crawl,
          showElements: false,
          showResults: false,
          deleteCrawlLoading: false,
          reCrawlLoading: false
        });
      }
      console.log(crawls);
      myCrawls.update(u => crawls);
      return;
    }
    for (const crawl of c) {
      if (!crawl.createDate) return;
      if (!myCrawlsLocal.some(m => m && m.crawlName === crawl.crawlName)) {
        myCrawls.update(u => {
          u.push();
          return u;
        });
      } else {
        myCrawls.update(u => {
          const storedCrawl = u.find(f => f.crawlName == crawl.crawlName)
          storedCrawl.dbCrawl=crawl
          return u;
        });
      }
    }
  });

  $: userHasQuotaLeft = loadedUserData.quotaUsed < loadedUserData.quota;

  onDestroy(() => {
    userCrawls$.unsubscribe();
  });

  function filterCrawls() {
    if (searchText === "") {
      filteredCrawls = myCrawlsLocal;
      return;
    }
    filteredCrawls = myCrawlsLocal.filter(c => {
      return (
        c.crawlName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.dbCrawl.url.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    myCrawls.update(m => m);
  }

  function sortDate() {
    filteredCrawls = filteredCrawls.sort((a, b) => {
      const dateASeconds = a.dbCrawl.createDate.seconds;
      const dateBSeconds = b.dbCrawl.createDate.seconds;
      dateSortedDesc = !dateSortedDesc;
      return dateSortedDesc
        ? dateASeconds - dateBSeconds
        : dateBSeconds - dateASeconds;
    });
    myCrawls.update(m => m);
  }

  function sortName() {
    filteredCrawls = filteredCrawls.sort((a, b) => {
      const nameA = a.crawlName.toUpperCase();
      const nameB = b.crawlName.toUpperCase();
      let returnValue = 0;
      if (nameA < nameB) {
        returnValue = nameSortedDesc ? -1 : 1;
      } else if (nameA > nameB) {
        returnValue = nameSortedDesc ? 1 : -1;
      }
      nameSortedDesc = !nameSortedDesc;
      return returnValue;
    });
    myCrawls.update(m => m);
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
  .sortIcon {
    cursor: pointer;
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
  <div class="container">
    {#if myCrawlsLocal && myCrawlsLocal.length === 0}
      No crawls yet
    {:else}
      <div class="box has-background-grey has-text-white">
        <div class="columns">
          <div class="column is-3 headerColumn">
            <span class="headerText">Name</span>
            <span
              class="icon is-small has-text-primary sortIcon"
              on:click={sortName}>
              <i class="fas fa-sort" />
            </span>
          </div>
          <div class="column is-2 headerColumn">
            <span class="headerText">Crawldate</span>
            <span
              class="icon is-small has-text-primary sortIcon"
              on:click={sortDate}>
              <i class="fas fa-sort" />
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
      {#if filteredCrawls}
        {#each filteredCrawls as crawl}
          {#if crawl.dbCrawl.createDate}
            <MyCrawl crawlName={crawl.crawlName} {userHasQuotaLeft} />
          {/if}
        {/each}
      {/if}
    {/if}
  </div>
</section>
