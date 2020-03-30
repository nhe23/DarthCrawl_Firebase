<script>
  import CrawlResult from "./CrawlResult.svelte";
  export let results;
  console.log(results)
</script>

<style>
  ul {
    padding: 0.2em 0 0 0.5em;
    margin: 0 0 0 0.5em;
    list-style: none;
    border-left: 1px solid #eee;
  }

  li {
    padding: 0.2em 0;
  }
</style>

<div>
  <ul>
    {#each results as result}
      <li>
        <CrawlResult {result} />
        {#if result.parent}
          <ul>
            <svelte:self results={result.result} />
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
</div>
