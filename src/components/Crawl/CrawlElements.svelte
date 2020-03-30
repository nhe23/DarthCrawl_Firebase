<script>
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import CrawlElementEditable from "./CrawlElementEditable.svelte";
  import CrawlElement from "./CrawlElement.svelte";

  export let elements;
  export let parentIndeces;
  export let staticView = false;

  console.log(elements);
  const dispatch = createEventDispatcher();

  function addElement(event) {
    dispatch("addElement", {
      parentIndeces: event.detail.parentIndeces
        ? event.detail.parentIndeces
        : parentIndeces
    });
  }

  function addChildElement(event) {
    console.log("dispatch add child root");
    dispatch("addChildElement", {
      parentIndeces: event.detail.parentIndeces,
      elementId: event.detail.elementId
    });
    // const parent = elements.find(e => e.id == elementId);
    // const ids = parent.children.map(c => c.id);
    // const id = Math.max(...ids) + 1;
    // parent.children = [...parent.children, { id, value: "" }];
    // elements = [...elements.filter(e => e.id !== elementId), parent];
    // console.log(elements);
  }

  function removeElement(event) {
    console.log(`Element id ${event.detail.elementId}`);
    dispatch("removeElement", {
      parentIndeces: event.detail.parentIndeces,
      elementId: event.detail.elementId
    });
  }

  function reassign(event) {
    dispatch("reassign", {});
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
            on:removeElement={removeElement}
            on:addChildElement={addChildElement}
            on:reassign={reassign}
            {parentIndeces} />
        {/if}
        {#if element.children && element.children.length > 0}
          <ul class="has-text-grey-lighter">
            <svelte:self
              on:addElement={addElement}
              on:removeElement={removeElement}
              on:addChildElement={addChildElement}
              on:reassign={reassign}
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
