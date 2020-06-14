<script>
  import { crawlElements } from "../../store";
  export let element;
  export let parentIndeces;
  export let storeId;

  let elementName = element.name;
  let elementValue = element.value;
  let elements;
  const crawlElements$ = crawlElements.subscribe(c => {
    const storedCrawl = c.find(e => e.id === storeId);
    if (storedCrawl) elements = storedCrawl.elements;
  });

  function setElement() {
    let elementCopy = [...elements];
    let ref = elementCopy;
    for (const i of parentIndeces) {
      ref = ref[i].children;
    }

    const parentElement = ref.find(r => r.id === element.id);
    const index = ref.indexOf(parentElement);
    ref[index].value = elementValue;
    ref[index].name = elementName;
    crawlElements.update(c => {
      const crawlEdit = c.find(e => e.id === storeId);
      crawlEdit.elements = [...elementCopy];
      return c;
    });
  }

  function addChildElement() {
    let elementCopy = [...elements];
    let ref = elementCopy;
    for (const i of parentIndeces) {
      ref = ref[i].children;
    }
    const parentElement = ref.find(r => r.id === element.id);
    const index = ref.indexOf(parentElement);
    ref[index].children.push({
      id: Date.now(),
      value: "",
      name: "",
      children: []
    });
    crawlElements.set([...elementCopy]);
  }

  function removeElement() {
    let elementCopy = [...elements];
    let ref = elementCopy;
    for (const i of parentIndeces) {
      ref = ref[i].children;
    }
    const elementToRemove = ref.find(r => r.id === element.id);
    const index = ref.indexOf(elementToRemove);
    if (index !== -1) {
      ref.splice(index, 1);
    }
    crawlElements.set([...elementCopy]);
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
          bind:value={elementValue}
          on:input={setElement} />
        <span
          on:click={removeElement}
          class="icon is-small is-left has-text-danger">
          <i class="fas fa-minus-circle" />
        </span>
        {#if !element.children || (element.children.length === 0 && element.value !== '')}
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
        <input
          class="input"
          type="text"
          placeholder="Name"
          bind:value={elementName}
          on:input={setElement} />
      </div>
    </div>
  </div>
</main>
