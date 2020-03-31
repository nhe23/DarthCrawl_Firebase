<script>
  import { createEventDispatcher } from "svelte";
  export let element;
  export let parentIndeces;
  console.log(element.id);
  const dispatch = createEventDispatcher();

  function addChildElement() {
    console.log("dispatch add child");
    dispatch("addChildElement", {
      elementId: element.id,
      parentIndeces
    });
  }

  function removeElement() {
    console.log(`Crawl element dispatches removal of ${element.id}`);
    dispatch("removeElement", {
      elementId: element.id,
      parentIndeces
    });
  }

  function reassign() {
    console.log("Reassign");
    dispatch("reassign", {});
  }
</script>

<style>
  .icon {
    pointer-events: initial !important;
  }
</style>

<main>
  <div class="columns">
    <div class="column is-8">
      <div class="field control has-icons-left has-icons-right">
        <input
          class="input"
          type="text"
          placeholder="xPath"
          bind:value={element.value} 
          on:blur={reassign}/>
        <span
          on:click={removeElement}
          class="icon is-small is-left has-text-danger">
          <i class="fas fa-minus-circle" />
        </span>
        {#if !element.children || element.children.length === 0 && element.value !== ""}
          <span
            on:click={addChildElement}
            class="icon is-small is-right has-text-success">
            <i class="fas fa-plus-circle" />
          </span>
        {/if}
      </div>
    </div>
    <div class="column is-4">
      <div class="field control">
        <input class="input" type="text" placeholder="Name" bind:value={element.name} on:blur={reassign}>
      </div>
    </div>
  </div>
</main>
