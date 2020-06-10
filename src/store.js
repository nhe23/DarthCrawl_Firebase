import { writable } from "svelte/store";

export const userDbData = writable(null);

export const crawlElementsDefault = [
  {
    id: 0,
    value: "",
    name: "",
    children: [],
  },
];

export const crawlElements = writable(crawlElementsDefault);
