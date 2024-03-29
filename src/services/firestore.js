import { collectionData, docData } from "rxfire/firestore";
import { startWith } from "rxjs/operators";
import { db } from "../conf/firebase";

export const userCrawls = (uid) => {
  const query = db
    .collection("crawls")
    .where("uid", "==", uid)
    .orderBy("createDate");

  return collectionData(query, "id");
};

export const userData = async (uid) => {
  let userDataRef = db.collection("users").doc(uid);
  return docData(userDataRef, "uid");
};

export const crawlResults = (crawlId) => {
  return collectionData(
    db.collection(`crawls/${crawlId}/results`).orderBy("date", "desc")
  );
};

export const newestCrawlResult = (crawlId, createTime) => {
  return collectionData(
    db
      .collection(`crawls/${crawlId}/results`)
      .where("date", ">=", createTime)
      .orderBy("date", "desc")
  );
};

export const setCrawl = async ({
  id,
  uid,
  crawlName,
  createTime,
  url,
  elements,
}) => {
  return await db.collection("crawls").doc(id).set(
    {
      uid,
      createDate: createTime,
      crawlName,
      url,
      crawlElements: elements,
    },
    { merge: true }
  );
};

export const checkCrawlExists = async (id) => {
  return (await db.collection("crawls").doc(id).get()).exists;
};

export const setReCrawl = async (id, createTime) => {
  return await db.collection("crawls").doc(id).set(
    {
      createDate: createTime,
    },
    { merge: true }
  );
};

export const setUserPofilePicture = async (storagePath, uid) => {
  console.log(uid);
  return await db.collection("users").doc(uid).set(
    {
      profilePicture: storagePath,
    },
    { merge: true }
  );
};

export const deleteCrawl = async (crawlId) => {
  return await db.collection("crawls").doc(crawlId).delete();
};
