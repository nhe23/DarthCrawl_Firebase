<script>
  import { collectionData, docData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  import { fade } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";
  import {
    crawlResults,
    deleteCrawl,
    setReCrawl,
    newestCrawlResult
  } from "../../services/firestore";
  import firebase from "firebase/app";
  import { crawlElements, myCrawls } from "../../store";
  import CrawlElements from "./CrawlElements.svelte";
  import CrawlResults from "./CrawlResults.svelte";
  import EditCrawl from "./EditCrawl.svelte";
  export let crawlName;
  export let userHasQuotaLeft;

  let crawl;
  $: results = crawl ? crawlResults(crawl.dbCrawl.id) : null;

  let result;
  let editCrawl = false;
  let crawlEditable;
  let elements;

  $: myCrawls$ = myCrawls.subscribe(m => {
    crawl = m.find(f => f.crawlName === crawlName);
  });

  $: crawlElements$ = crawlElements.subscribe(c => {
    const storedCrawl = c.find(e => e.id === crawl.dbCrawl.id);
    if (storedCrawl) {
      elements = storedCrawl.elements;
    }
  });

  onMount(() => {
    crawlElements.update(c => [
      ...c,
      { id: crawl.dbCrawl.id, elements: crawl.dbCrawl.crawlElements }
    ]);
  });

  async function reCrawl() {
    myCrawls.update(m => {
      const c = m.find(n => n.crawlName === crawlName);
      c.reCrawlLoading = true;
      return m;
    });
    const createTime = firebase.firestore.Timestamp.now();
    await setReCrawl(crawl.dbCrawl.id, createTime);
    result = newestCrawlResult(crawl.dbCrawl.id, createTime).subscribe(r => {
      if (r.length > 0) {
        myCrawls.update(m => {
          const c = m.find(n => n.crawlName === crawlName);
          c.reCrawlLoading = false;
          return m;
        });
      }
    });
  }

  let deleteCrawlLoading = false;
  function deleteUserCrawl() {
    deleteCrawlLoading = true;
    deleteCrawl(crawl.dbCrawl.id).then(() => (deleteCrawlLoading = false));
  }

  function resetCrawlElements() {
    editCrawl = false;
    crawlElements.update(c => {
      const crawlEdit = c.find(e => e.id === crawl.id);
      crawlEdit.elements = crawl.crawlElements;
      return c;
    });
  }
</script>

<style>
  .urlBlock {
    display: flex;
    flex-direction: column;
  }
  .url {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .elements {
    display: inline-block;
    overflow: hidden !important;
    white-space: nowrap;
    text-overflow: ellipsis !important;
  }

  .edit {
    cursor: pointer;
  }
</style>

<div class="box">
  <div class="columns">
    <div class="column is-3 urlBlock">
      <div class="url">
        <a href={crawl.dbCrawl.url} target="_blank">{crawl.crawlName}</a>
      </div>

    </div>
    <div class="column is-2">
      {crawl.dbCrawl.createDate.toDate().toLocaleString()}
    </div>
    <div class="column is-3 elements">
      Elements
      {#if crawl.showElements && elements}
        <span
          class="icon is-small has-text-link"
          on:click={() => {
            myCrawls.update(m => {
              const c = m.find(n => n.crawlName === crawlName);
              c.showElements = !c.showElements;
              return m;
            });
          }}>
          <i class="fas fa-chevron-up" />
        </span>
        <CrawlElements
          storeId={crawl.dbCrawl.id}
          {elements}
          parentIndeces={[]}
          staticView={true} />
        <span
          class="icon is-small edit"
          on:click={() => {
            editCrawl = true;
          }}>
          <i class="fas fa-edit" />
        </span>
        {#if editCrawl}
          <EditCrawl
            on:cancel={resetCrawlElements}
            on:close={() => {
              editCrawl = false;
            }}
            {elements}
            crawl={crawl.dbCrawl} />
        {/if}
      {:else}
        <span
          class="icon is-small has-text-link"
          on:click={() => {
            myCrawls.update(m => {
              const c = m.find(n => n.crawlName === crawlName);
              c.showElements = !c.showElements;
              return m;
            });
          }}>
          <i class="fas fa-chevron-down" />
        </span>
      {/if}
    </div>

    <div class="column is-3">
      Result
      {#if crawl.showResults && $results}
        <span
          class="icon is-small has-text-link"
          on:click={() => {
            myCrawls.update(m => {
              const c = m.find(n => n.crawlName === crawlName);
              c.showResults = !c.showResults;
              return m;
            });
          }}>
          <i class="fas fa-chevron-up" />
        </span>
        {#each $results as result}
          {#if result.crawlResults}
            <CrawlResults results={result.crawlResults} />
          {:else if result.error}
            <ul>
              <li>Run had errors</li>
            </ul>
          {:else}
            <ul>
              <li>Loading</li>
            </ul>
          {/if}
        {/each}
      {:else}
        <span
          class="icon is-small has-text-link"
          on:click={() => {
            myCrawls.update(m => {
              const c = m.find(n => n.crawlName === crawlName);
              c.showResults = !c.showResults;
              return m;
            });
          }}>
          <i class="fas fa-chevron-down" />
        </span>
      {/if}

      <!-- <div class="bd-category is-active">RESULT</div> -->

      <!-- <CrawlResults /> -->
    </div>
    <div class="column is-1">
      <button
        on:click={reCrawl}
        disabled={!userHasQuotaLeft}
        class="button"
        class:is-loading={crawl.reCrawlLoading}
        title="Recrawl">
        <span class="icon">
          <i class="fas fa-redo-alt" />
        </span>
      </button>
      <button
        on:click={deleteUserCrawl}
        class:is-loading={deleteCrawlLoading}
        class="button"
        title="Delete">
        <span class="icon">
          <i class="fas fa-minus-circle has-text-danger" />
        </span>
      </button>
    </div>
  </div>
</div>
