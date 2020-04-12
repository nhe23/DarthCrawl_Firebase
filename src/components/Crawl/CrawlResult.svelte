<script>
  import { fade } from 'svelte/transition';
  export let result;
  console.log(result);
</script>

<div>
  {#if result.parent}
    {result.parent}
  {:else if result.values}
    {#each result.values as element}<p in:fade>{element.name? element.name : element.element} {element.value}</p>{/each}
  {:else}
  <p in:fade>
    {result.name ? result.name : result.element} {result.value}
    </p>
  {/if}

</div>
