import { getFirestore } from "../util/firebaseImports";

export const getLinkedEmailsByUID = async (uid: string) => {
    const db = getFirestore();
    const snapshot = await db
        .collection("linkedAccounts")
        .where("uid", "==", uid)
        .get();
    const emails: string[] = [];
    snapshot.forEach((doc) => {
        emails.push(doc.id);
    });
    return emails;
};
