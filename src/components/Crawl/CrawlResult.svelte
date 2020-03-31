<script>
  export let result;
  console.log(result);
</script>

<div>
  {#if result.parent}
    {result.parent}
  {:else if result.values}
    {#each result.values as element}{element.name? element.name : element.element} {element.value}{/each}
  {:else}
    {result.name ? result.name : result.element} {result.value}
  {/if}

</div>
