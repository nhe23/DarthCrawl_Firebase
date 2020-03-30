<script>
  import { collectionData, docData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  import { crawlResults, deleteCrawl } from "../../services/firestore";
  import CrawlElements from "./CrawlElements.svelte";
  import CrawlResults from "./CrawlResults.svelte";
  export let crawl;

  let showResults = false;
  let results = crawlResults(crawl.id)
  console.log(crawl);

  function reCrawl(){

  } 

  let deleteCrawlLoading=false;
  function deleteUserCrawl(){
    deleteCrawlLoading=true;
    deleteCrawl(crawl.id).then(() => deleteCrawlLoading=false);
  }
</script>

<style>
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
    <div class="column is-3 url">
      <a href={crawl.url} target="_blank">{crawl.url}</a>
    </div>
    <div class="column is-2">{crawl.createDate.toDate()}</div>
    <div class="column is-3 elements">
      <CrawlElements
        elements={crawl.crawlElements}
        parentIndeces={[]}
        staticView={true} />
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
          {:else}Loading{/if}
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
      <button on:click={reCrawl} class="button" class:is-loading={deleteCrawlLoading} title="Recrawl">
        <span class="icon">
          <i class="fas fa-redo-alt" />
        </span>
      </button>
      <button on:click={deleteCrawl} class="button" title="Delete">
        <span class="icon">
          <i class="fas fa-minus-circle has-text-danger" />
        </span>
      </button>
    </div>
  </div>
</div>
