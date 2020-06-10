<script>
  import { crawlElements } from "../../store";
  export let element;
  export let parentIndeces;

  let elements;
  let elementName;
  let elementValue;
  const crawlElements$ = crawlElements.subscribe(c => {
    elements = c;
  });
  console.log(element.id);

  function setElement() {
    let elementCopy = [...elements];
    let ref = elementCopy;
    for (const i of parentIndeces) {
      ref = ref[i].children;
    }

    const parentElement = ref.find(r => r.id === element.id);
    const index = ref.indexOf(parentElement);
    ref[index].value = element.value;
    ref[index].name = element.name;
    crawlElements.set([...elementCopy]);
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
    console.log(parentIndeces);
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
          on:input={setElement}
          bind:value={element.value} />
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
          on:input={setElement}
          bind:value={element.name} />
      </div>
    </div>
  </div>
</main>
