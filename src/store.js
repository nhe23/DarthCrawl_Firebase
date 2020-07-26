import { writable } from "svelte/store";

export const userDbData = writable(null);

export const crawlsElementsDefault = [
  {
    id: 0,
    elements: [
      {
        id: 0,
        value: "",
        name: "",
        children: [],
      },
    ],
  },
];

export const crawlElements = writable(crawlsElementsDefault);

export const myCrawls = writable(null);
