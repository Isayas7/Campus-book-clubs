import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { FIRBASE_DB, FIRBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const getUser = async (id: string) => {
  const docRef = doc(FIRBASE_DB, "users", id);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    console.log(error);
  }
};

export const uploadUserProfile = async ({
  id,
  photo,
}: {
  id: string;
  photo: File;
}) => {
  try {
    const storageRef = ref(FIRBASE_STORAGE, "profile_photos/" + photo.name);
    await uploadBytes(storageRef, photo);

    const photoUrl = await getDownloadURL(storageRef);
    if (photoUrl) {
      const userDoc = doc(FIRBASE_DB, "users", id);
      await updateDoc(userDoc, { photoUrl: arrayUnion(photoUrl) });
      console.log("Profile photo uploaded successfully.");
    }
  } catch (error) {
    console.error("Error uploading profile photo:", error);
  }
};

export const updateUserName = async ({
  id,
  username,
}: {
  id: string;
  username: string;
}) => {
  const docRef = doc(FIRBASE_DB, "users", id);

  try {
    await updateDoc(docRef, {
      userName: username,
    });
    console.log("user updating successfully");
  } catch (error) {
    console.error("Error updating user :", error);
  }
};
