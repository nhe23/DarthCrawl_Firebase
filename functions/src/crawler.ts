import * as puppeteer from "puppeteer";

// const db = admin.firestore();

export const crawlUrl = async (url: string, elements: any) => {
  try {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil:'networkidle2'});
    const result: any[] = [];
    await crawl(page, elements, result);
    // if (crawlList) {
    //   const allResults = await page.$$("li.block.media._feedPick");
    //   const [title] = await allResults[0].$$("h3>a");
    //   const game = await (await title.getProperty("textContent")).jsonValue();
    //   console.log(game);
    // }
    // const resultsElements: any = await Promise.all(
    //   elements.map((e: any) => {
    //     return page.$x(e.xpath);
    //   })
    // );
    // const elementTarget = await resultsElements[0][0].getProperty("textContent");
    // const result = await elementTarget.jsonValue();
    // await db.collection("CrawlResults").add({
    //   date: Date.now(),
    //   url,
    //   elements: [{ content: result, contentType: "text" }]
    // });

    console.log(result);
    await browser.close();
    return result;
  } catch (err) {
    console.error(err.message)
    return err.message;
  }
};

const crawl = async (
  page: puppeteer.Page,
  elements: any,
  result: any[] = [],
  parent: null | puppeteer.ElementHandle<Element>[] = null
) => {
  console.log("crawl called")
  if (parent) {
    console.log("has parent")
    console.log(parent);
    for (const parentObj of parent) {
      console.log("parent iteration")
      const resultElements:any = {id: result.length, values: []}
      await handleElements(elements, page, result, parentObj, resultElements);
    }
  } else {
    await handleElements(elements,page, result);
  }
};

const handleElements = async (
  elements: any[],
  page: puppeteer.Page,
  result: any[],
  parentObj: null | puppeteer.ElementHandle<Element> = null,
  resultElements: null | any = null
) => {
  console.log("Called handle elements")
  for (const element of elements) {
    if (element.children.length > 0) {
      const newParent = await page.$$(element.value);
      const parentObject: any = { parent: element.value, result: [] };
      result.push(parentObject);
      await crawl(page, element.children, parentObject.result, newParent);
      continue;
    }

    const [pageResult] = parentObj
      ? await parentObj.$$(element.value)
      : await page.$x(element.value);
    const text = await (
      await pageResult.getProperty("textContent")
    ).jsonValue();
    if (!resultElements) {
      result.push({ element: element.value, value: text });
      continue;
    }
    console.log(`Found element ${element.value} with ${text}`)
    resultElements.values.push({ element: element.value, value: text });
  }
  if (resultElements) result.push(resultElements);
};

// const result = [
//   {
//     parent: "li",
//     result: [
  //     {
   //      id: 0,
   //      elements: []
  //      }
//       [
//         { element: "h1 ", value: "text" },
//         { element: "h2", value: "text2" }
//       ],
//       [
//         { element: "h1 ", value: "asdf" },
//         { element: "h2", value: "asdf" }
//       ],
//       {
//         parent: "li2",
//         result: [
//           [
//             { element: "h1 ", value: "text" },
//             { element: "h2", value: "text2" }
//           ],
//           [
//             { element: "h1 ", value: "asdf" },
//             { element: "h2", value: "asdf" }
//           ]
//         ]
//       }
//     ]
//   }
// ];
