import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const serviceAccount = require("../service-account.json");
import { crawlUrl } from "./crawler";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://darth-crawl.firebaseio.com"
});

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 30,
  memory: "1GB"
};

export const onCrawlCreate = functions
  .runWith(runtimeOpts)
  .firestore.document("/crawls/{crawlsId}")
  .onCreate(async (snap, context) => {
    return crawlDocument(snap);
    // return snap.ref.set({crawlResults}, {merge: true});
  });

export const onCrawlUpdate = functions
  .runWith(runtimeOpts)
  .firestore.document("/crawls/{crawlsId}")
  .onUpdate(async (snap, context) => {
    return crawlDocument(snap.after);
    // return snap.ref.set({crawlResults}, {merge: true});
  });

export const onCrawlDelete = functions
  .runWith(runtimeOpts)
  .firestore.document("/crawls/{crawlsId}")
  .onDelete(async (snap, context) => {
    const db = admin.firestore();
    const id = snap.ref.id;
    await deleteCollection(db, `/crawls/${id}/results`, 10);

    // return snap.ref.set({crawlResults}, {merge: true});
  });

const crawlDocument = async (snap: functions.firestore.DocumentSnapshot) => {
  console.log("Function called");
  const newValue = snap.data();
  if (!newValue) {
    return;
  }
  const url = newValue.url;
  const crawlElements = newValue.crawlElements;
  const crawlResults = await crawlUrl(url, crawlElements);

  console.log(`URL: ${url}`);
  console.log(`Elements: ${crawlElements}`);
  console.log(`Elements value: ${newValue.crawlElements[0].value}`);
  const result = { date: admin.firestore.Timestamp.now(), crawlResults };
  return snap.ref.collection("results").add(result);
};

function deleteCollection(
  db: FirebaseFirestore.Firestore,
  collectionPath: string,
  batchSize: number
) {
  let collectionRef = db.collection(collectionPath);
  let query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve, reject);
  });
}

function deleteQueryBatch(
  db: FirebaseFirestore.Firestore,
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  resolve: Function,
  reject: (reason?: any) => void
) {
  query
    .get()
    .then((snapshot: FirebaseFirestore.QuerySnapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then(numDeleted => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, resolve, reject);
      });
    })
    .catch(reject);
}
