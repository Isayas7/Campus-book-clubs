import {
  DocumentData,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { FIRBASE_DB, FIRBASE_STORAGE } from "../firebaseConfig";
import { router } from "expo-router";
import { ClubData, bClubProps, clubProps } from "../types/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const { user } = useContext(AuthContext);

export const crateClubs = async ({
  creater,
  photoUrl,
  data,
}: {
  creater: string;
  photoUrl: File;
  data: bClubProps;
}) => {
  try {
    const storageRef = ref(FIRBASE_STORAGE, "Clubs/" + photoUrl.name);
    await uploadBytes(storageRef, photoUrl);

    const photoURL = await getDownloadURL(storageRef);
    const RequestData = { creater, photoURL, members: [], ...data };
    if (photoUrl) {
      await addDoc(collection(FIRBASE_DB, "Clubs"), RequestData);
      console.log("clubs created successfully.");
    }
  } catch (error) {
    console.log("clubs not created ");
    console.error(error);
  }
};

export const getClubs = async () => {
  const docRef = collection(FIRBASE_DB, "Clubs");

  const docSnap = await getDocs(docRef);

  if (docSnap) {
    const data = docSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data;
  } else {
    console.log("No documents found!");
    return [];
  }
};

export const sendMessage = async ({
  userId,
  id,
  text,
}: {
  userId: string;
  id: string;
  text: string;
}) => {
  const docRef = collection(FIRBASE_DB, `Clubs/${id}/conversations`);

  try {
    const docSnap = await addDoc(docRef, {
      message: text,
      sender: userId,
      createdAt: serverTimestamp(),
    });
    console.log("message sent successfully.");
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (id: string) => {
  const docRef = collection(FIRBASE_DB, `Clubs/${id}/conversations`);
  const q = query(docRef, orderBy("createdAt", "asc"));
  try {
    const docSnap = await getDocs(q);
    const data = docSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const joinClubs = async ({
  docId,
  userId,
}: {
  docId: string;
  userId: string;
}) => {
  try {
    const clubsRef = doc(FIRBASE_DB, `Clubs/${docId}`);

    await updateDoc(clubsRef, { members: arrayUnion(userId) });
    console.log("Joined  successfully.");
  } catch (error) {
    console.error("Error uploading profile photo:", error);
  }
};

export const fetchClubData = async (
  id: string
): Promise<ClubData | undefined> => {
  const clubRef = doc(FIRBASE_DB, `Clubs/${id}`);
  try {
    const clubSnapshot = await getDoc(clubRef);

    if (clubSnapshot.exists()) {
      return { id: clubSnapshot.id, ...clubSnapshot.data() } as ClubData;
    }
  } catch (error) {
    console.error("Error fetching club data:", error);
  }
};
