<script>
  import { collectionData, docData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  import { fade } from "svelte/transition";
  import {
    crawlResults,
    deleteCrawl,
    setReCrawl,
    newestCrawlResult
  } from "../../services/firestore";
  import firebase from "firebase/app";
  import CrawlElements from "./CrawlElements.svelte";
  import CrawlResults from "./CrawlResults.svelte";
  export let crawl;
  export let userHasQuotaLeft;

  let showResults = false;
  let showElements = false;
  let results = crawlResults(crawl.id);
  let result;

  console.log(crawl);

  let reCrawlLoading = false;
  async function reCrawl() {
    reCrawlLoading = true;
    const createTime = firebase.firestore.Timestamp.now();
    await setReCrawl(crawl.id, createTime);
    result = newestCrawlResult(crawl.id, createTime).subscribe(r => {
      console.log(r);
      if (r.length > 0) {
        reCrawlLoading = false;
      }
    });
  }

  let deleteCrawlLoading = false;
  function deleteUserCrawl() {
    deleteCrawlLoading = true;
    deleteCrawl(crawl.id).then(() => (deleteCrawlLoading = false));
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
</style>

<div class="box">
  <div class="columns">
    <div class="column is-3 urlBlock">
      <div class="url">
        <a href={crawl.url} target="_blank">{crawl.crawlName}</a>
      </div>

    </div>
    <div class="column is-2">{crawl.createDate.toDate().toLocaleString()}</div>
    <div
      class="column is-3 elements"
      on:click={() => (showElements = !showElements)}>
      Elements
      {#if showElements}
        <span class="icon is-small has-text-link">
          <i class="fas fa-chevron-up" />
        </span>
        <CrawlElements
          elements={crawl.crawlElements}
          parentIndeces={[]}
          staticView={true} />
      {:else}
        <span class="icon is-small has-text-link">
          <i class="fas fa-chevron-down" />
        </span>
      {/if}
    </div>

    <div class="column is-3" on:click={() => (showResults = !showResults)}>
      Result
      {#if showResults}
        <span class="icon is-small has-text-link">
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
        <span class="icon is-small has-text-link">
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
        class:is-loading={reCrawlLoading}
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
