<script>
  // import { db } from "../firebase";
  import { collectionData, docData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  import { userCrawls } from "../../services/firestore";
  import MyCrawl from "./MyCrawl.svelte";
  import QuotaUsed from "./QuotaUsed.svelte";
  export let uid;
  export let loadedUserData;
  let crawls = userCrawls(uid);
  $: userHasQuotaLeft = loadedUserData.quotaUsed < loadedUserData.quota;
</script>

<section class="hero is-small is-light is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">My Crawls</h1>
      <!-- <h2 class="subtitle">
         <Link to="/documentation">documentation</Link>
      </h2> -->
    </div>
  </div>
</section>
{#if !userHasQuotaLeft}
  <QuotaUsed />
{/if}
<section class="section">
  {#each $crawls as crawl}
    {#if crawl.createDate}
      <MyCrawl {crawl} {userHasQuotaLeft} />
    {/if}
  {/each}
</section>
