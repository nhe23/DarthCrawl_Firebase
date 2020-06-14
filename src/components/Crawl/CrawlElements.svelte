<script>
  import { fade } from "svelte/transition";
  import { crawlElements } from "../../store";
  import CrawlElementEditable from "./CrawlElementEditable.svelte";

  export let elements;
  export let storeId;
  let storedElements;
  const crawlElements$ = crawlElements.subscribe(c => {

     const storedCrawl = c.find(s => s.id === storeId);
     if (storedCrawl) storedElements = storedCrawl.elements;
  });

  export let parentIndeces;
  export let staticView = false;

  function addElement() {
    let elementCopy = [...storedElements];
    let ref = elementCopy;
    for (const i of parentIndeces) {
      ref = ref[i].children;
    }
    ref.push({ id: Date.now(), value: "", name: "", children: [] });
    crawlElements.update(c => {
      const crawlEdit = c.find(e => e.id === storeId)
      crawlEdit.elements = [...elementCopy]
      return c;
      });
  }

</script>

<style>
  ul {
    padding: 0.2em 0 0 0.5em;
    margin: 0 0 0 0.5em;
    list-style: none;
    border-left: 1px solid;
  }

  li {
    padding: 0.2em 0;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

<main>
  <ul class="has-text-grey-lighter">
    {#each elements as element, i (element.id)}
      <li class="has-text-grey-dark">
        {#if staticView}
          {element.value}
        {:else}
          <CrawlElementEditable
            {element}
            {parentIndeces} {storeId} />
        {/if}
        {#if element.children && element.children.length > 0}
          <ul class="has-text-grey-lighter">
            <svelte:self
              on:addElement={addElement}
              elements={element.children}
              parentIndeces={[...parentIndeces, i]}
              {staticView} />
          </ul>
        {/if}

      </li>
    {/each}
    {#if !staticView}
      <button class="button is-secondary" on:click={addElement}>+</button>
    {/if}
  </ul>

</main>
