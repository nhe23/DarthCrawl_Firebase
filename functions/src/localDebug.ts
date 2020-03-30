import { crawlUrl } from "./crawler";
(async () => {
  // const result = await crawl("https://quotenwilly.blogabet.com/", true, [{xpath: '//*[@id="priceblock_ourprice"]'}]);
  const elements = [
    
      {
        id: 0,
        value: "li.block.media._feedPick",
        children: [{ id: 1583502331760, value: "h3>a", children: [] }, { id: 1583502331761, value: "div>span.enable-tooltip", children: [] }]
      }
    
  ];

  // const amazonElements = [{id: 0, value: "//*[@id=\"priceblock_ourprice\"]", children:[]}, {id: 1, value: "//*[@id=\"productTitle\"]", children:[]}]
  const resilt = await crawlUrl("https://dedi22.blogabet.com/", elements);
  // const amazonResult = await crawlUrl("https://www.amazon.de/Anthem-Standard-Edition-PlayStation-4/dp/B071GQT9M7?pf_rd_p=4963bc11-d0a2-4ebd-b0a4-e8f2f89d6fa9&pd_rd_wg=6Hc8V&pf_rd_r=GMEGDMMCA2C4MTMWRS33&ref_=pd_gw_cr_wsim&pd_rd_w=DRdOE&pd_rd_r=4a4f4e0f-2876-41fb-8706-5b480ba2c3f0", amazonElements);
  console.log(`Result`)
  console.log(resilt[0].result.length);
  // console.log(amazonResult);
})();
