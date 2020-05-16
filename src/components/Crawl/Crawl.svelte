<script>
  // import { db } from "../firebase";
  import { setCrawl, newestCrawlResult } from "../../services/firestore";
  import { Link } from "../Router";
  import firebase from "firebase/app";
  import { fade } from "svelte/transition";
  import { slide } from "svelte/transition";
  import CrawlElements from "./CrawlElements.svelte";
  import CrawlResults from "./CrawlResults.svelte";
  import QuotaUsed from "./QuotaUsed.svelte";
  import md5 from "md5";

  export let uid;
  export let loadedUserData;
  let url = "";

  let elements = [
    {
      id: 0,
      value: "",
      name: "",
      children: []
    }
  ];

  let results;
  async function addCrawl() {
    console.log(loadedUserData);
    console.log(elements);
    const id = md5(`${url}_${uid}`);
    try {
      const createTime = firebase.firestore.Timestamp.now();
      const ref = await setCrawl({ id, uid, createTime, url, elements });
      results = newestCrawlResult(id, createTime);
    } catch (err) {
      console.log(err);
    }
  }

  function removeElement(event) {
    console.log(event.detail.parentIndeces);
    let elementCopy = [...elements];
    let ref = elementCopy;
    for (const i of event.detail.parentIndeces) {
      ref = ref[i].children;
    }
    const elementToRemove = ref.find(r => r.id == event.detail.elementId);
    const index = ref.indexOf(elementToRemove);
    if (index !== -1) {
      ref.splice(index, 1);
    }
    elements = [...elementCopy];
  }

  function addElement(event) {
    console.log(loadedUserData);
    let elementCopy = [...elements];
    let ref = elementCopy;
    console.log(event.detail.parentIndeces);
    for (const i of event.detail.parentIndeces) {
      ref = ref[i].children;
    }
    ref.push({ id: Date.now(), value: "", name: "", children: [] });
    console.log("Elements before add");
    console.log(elements);
    elements = [...elementCopy];
    console.log(elements);
  }

  function addChildElement(event) {
    let elementCopy = [...elements];
    let ref = elementCopy;
    for (const i of event.detail.parentIndeces) {
      ref = ref[i].children;
    }
    const parentElement = ref.find(r => r.id == event.detail.elementId);
    const index = ref.indexOf(parentElement);
    ref[index].children.push({
      id: Date.now(),
      value: "",
      name: "",
      children: []
    });
    elements = [...elementCopy];
  }

  function reassign() {
    console.log(elements);
    console.log(elements.some(e => e.value !== ""));
    elements = [...elements];
  }
</script>

<style>
  /* .elements { */
  /* display: flex;
    flex-direction: column;
  }
  .crawl {
    display: flex;
    align-items: center;
  } */

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

    <div class="columns">
      <div class="column is-10">

        <input
          class="input is-rounded"
          placeholder="URL"
          bind:value={url}
          type="text" />
      </div>
      <div class="column is-2">
        <button
          class="button is-primary crawlButton"
          disabled={url.length === 0 || !elements.some(e => e.value !== '') || loadedUserData.quotaUsed >= loadedUserData.quota}
          on:click={addCrawl}>
          Crawl
        </button>

      </div>
    </div>
    <div class="columns">
      <div class="cloumn is-two-fifths container">

        <CrawlElements
          on:removeElement={removeElement}
          on:addElement={addElement}
          on:addChildElement={addChildElement}
          on:reassign={reassign}
          {elements}
          parentIndeces={[]} />
      </div>
      <div class="column is-three-fifths container text">
        {#if $results}
          <!-- {#if !$results[0] || !$results[0].crawlResults || $results[0].crawlResults.length === 0} -->
          {#if $results.length === 0}
            <progress class="progress is-small is-primary" max="100">
              15%
            </progress>
          {:else if $results[0].error}
            <div class="notification is-danger is-light">{$results[0].error}</div>
          {:else}
            <CrawlResults results={$results[0].crawlResults} />
          {/if}
        {/if}
      </div>

    </div>
  </section>
</main>
