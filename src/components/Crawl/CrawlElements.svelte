<script>
  import { fade } from "svelte/transition";
  import { crawlElements } from "../../store";
  import CrawlElementEditable from "./CrawlElementEditable.svelte";
  import CrawlElement from "./CrawlElement.svelte";

  export let elements;
  let storedElements;
  const crawlElements$ = crawlElements.subscribe(c => {
    storedElements = c;
  });
  console.log(elements)
  export let parentIndeces;
  export let staticView = false;

  function addElement() {
    let elementCopy = [...storedElements];
    let ref = elementCopy;
    console.log(parentIndeces);
    for (const i of parentIndeces) {
      ref = ref[i].children;
    }
    ref.push({ id: Date.now(), value: "", name: "", children: [] });
    console.log("Elements before add");
    console.log(storedElements);
    crawlElements.set([...elementCopy]);
    console.log(storedElements);
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
            {parentIndeces} />
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
