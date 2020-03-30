<script>
  export let result;
  console.log(result);
</script>

<div>
  {#if result.parent}
    {result.parent}
  {:else if result.values}
    {#each result.values as element}{element.element} {element.value}{/each}
  {:else}
    {result.element} {result.value}
  {/if}

</div>
