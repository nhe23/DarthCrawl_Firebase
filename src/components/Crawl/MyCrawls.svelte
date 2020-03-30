<script>
  // import { db } from "../firebase";
  import { collectionData, docData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  import { userCrawls } from "../../services/firestore";
  import MyCrawl from "./MyCrawl.svelte";
  export let uid;
  // const query = db
  //   .collection("crawls")
  //   .where("uid", "==", uid)
  //   .orderBy("createDate");

  // let crawls = collectionData(query, 'id').pipe(startWith([{ url: "test" }]));
  let crawls = userCrawls(uid);
</script>

<section class="hero is-small is-primary is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">My Crawls</h1>
      <!-- <h2 class="subtitle">
         <Link to="/documentation">documentation</Link>
      </h2> -->
    </div>
  </div>
</section>
<section class="section">
  {#each $crawls as crawl}
    {#if crawl.createDate}
      <MyCrawl {crawl} />
      <!-- <div class="box">
        <div class="columns">
          <div class="column is-one-quarter url">
            <a href={crawl.url} target="_blank">{crawl.url}</a>
          </div>
          <div class="column is-one-fifth">{crawl.createDate.toDate()}</div>
          <div class="column is-one-quarter elements">
            <!-- {crawl.crawlElements[0].value} -->
      <!-- <CrawlElements
              elements={crawl.crawlElements}
              parentIndeces={[]}
              staticView={true} />
          </div>
          <div class="column is-one-quarter"><CrawlResults/></div>
        </div>
      </div> -->
    {/if}
  {/each}
</section>
