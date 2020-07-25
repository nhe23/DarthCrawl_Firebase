<script>
  import {
    setCrawl,
    newestCrawlResult,
    checkCrawlExists
  } from "../../services/firestore";
  import { crawlElements, crawlsElementsDefault } from "../../store";
  import { Link } from "../Router";
  import firebase from "firebase/app";
  import { fade, slide } from "svelte/transition";
  import { onMount } from "svelte";
  import CrawlElements from "./CrawlElements.svelte";
  import CrawlResults from "./CrawlResults.svelte";
  import QuotaUsed from "./QuotaUsed.svelte";
  import md5 from "md5";

  export let uid;
  export let loadedUserData;
  let url = "";
  let crawlName = "";
  let crawlAlreadyExists = "";
  let count_value;
  let elements = [];

  let results;

  onMount(() => {
    crawlElements.set(crawlsElementsDefault);
  });
  const crawlElements$ = crawlElements.subscribe(c => {
    elements = c[0].elements;
  });
  async function addCrawl() {
    const id = md5(`${crawlName}_${uid}`);
    try {
      const createTime = firebase.firestore.Timestamp.now();
      const ref = await setCrawl({
        id,
        uid,
        crawlName,
        createTime,
        url,
        elements
      });
      results = newestCrawlResult(id, createTime);
    } catch (err) {
      console.log(err);
    }
  }

  async function checkIfCrawlExists() {
    if (crawlAlreadyExists.length > 0) return;
    const id = md5(`${crawlName}_${uid}`);
    if (await checkCrawlExists(id)) {
      crawlAlreadyExists = "Crawl already exists";
    } else {
      crawlAlreadyExists = "";
    }
  }
</script>

<style>
  .elements {
    margin-top: 12px;
  }

  .help {
    margin-left: 15px;
  }
  /* .crawl {
    display: flex;
    align-items: center;
  }  */

  .crawlButton {
    margin: 0 12px;
  }
</style>

<main>
  <section class="hero is-small is-light is-bold">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Add crawl</h1>
        <h2 class="subtitle">
          Crawl xPath or relative elements with children. For detailed
          information see
          <Link to="/documentation">documentation</Link>
        </h2>
      </div>
    </div>
  </section>
  {#if loadedUserData.quotaUsed >= loadedUserData.quota}
    <QuotaUsed />
  {/if}
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-3">
          <input
            class="input is-rounded"
            class:is-danger={crawlAlreadyExists.length > 0}
            placeholder="Crawl Name"
            bind:value={crawlName}
            on:input={() => {
              crawlAlreadyExists = '';
            }}
            on:blur={checkIfCrawlExists}
            type="text" />
          <p class="help is-danger">{crawlAlreadyExists}</p>

        </div>
        <div class="column is-7">
          <input
            class="input is-rounded"
            placeholder="URL"
            bind:value={url}
            type="text" />
        </div>
        <div class="column is-2">
          <button
            class="button is-primary crawlButton"
            disabled={url.length === 0 || !elements.some(e => e.value !== '') || loadedUserData.quotaUsed >= loadedUserData.quota || crawlName.length === 0}
            on:click={addCrawl}>
            Crawl
          </button>
        </div>

      </div>
      <div class="columns elements">
        <div class="cloumn is-5 container">

          <CrawlElements
            storeId={crawlsElementsDefault[0].id}
            {elements}
            parentIndeces={[]}
            staticView={false} />
        </div>
        <div class="column is-6 container text">
          {#if $results}
            <!-- {#if !$results[0] || !$results[0].crawlResults || $results[0].crawlResults.length === 0} -->
            {#if $results.length === 0}
              <progress class="progress is-small is-primary" max="100">
                15%
              </progress>
            {:else if $results[0].error}
              <div class="notification is-danger is-light">
                {$results[0].error}
              </div>
            {:else}
              <CrawlResults results={$results[0].crawlResults} />
            {/if}
          {/if}
        </div>

      </div>
    </div>
  </section>
</main>
