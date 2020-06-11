<script>
  import CrawlElements from "./CrawlElements.svelte";
  import { setCrawl, newestCrawlResult } from "../../services/firestore";
  import { createEventDispatcher } from "svelte";
  import { crawlElements } from "../../store";
  import firebase from "firebase/app";

  export let elements;
  export let crawl;

  const dispatch = createEventDispatcher();
  let saving = false;
  let editCrawl = true;
  let storedElements;
  const crawlElements$ = crawlElements.subscribe(c => {
    storedElements = c;
  });
  function close() {
    editCrawl = false;
    dispatch("close");
  }

  function cancel() {
    editCrawl = false;
    dispatch("cancel");
  }

  async function save() {
    saving = true;
    const createTime = firebase.firestore.Timestamp.now();
    crawl.elements = storedElements;
    crawl.createTime = createTime;
    await setCrawl(crawl);
    let result = newestCrawlResult(crawl.id, createTime).subscribe(r => {
      if (r.length > 0) {
        saving = false;
        result.unsubscribe();
        close();
      }
    });
  }
</script>

<div class="modal is-active" class:is-active={editCrawl}>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title has-text-white">Edit Crawl</p>
      <button class="delete" aria-label="close" on:click={close} />
    </header>
    <section class="modal-card-body">
      <CrawlElements {elements} parentIndeces={[]} staticView={false} />

    </section>
    <footer class="modal-card-foot">
      <button
        class="button is-primary"
        class:is-loading={saving}
        on:click={save}>
        Save changes
      </button>
      <button class="button" on:click={cancel}>Cancel</button>
    </footer>
  </div>
</div>
