import { functions } from "../conf/firebase";

export const updateQuota = async () => {
  const updateQuotaF = functions.httpsCallable("updateUserQuota");
  await updateQuotaF();
};
