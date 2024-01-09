import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCd-63YTpafLWw4p7IKZ-VikDksAqXCULE",
  authDomain: "campus-book-club-d22cb.firebaseapp.com",
  projectId: "campus-book-club-d22cb",
  storageBucket: "campus-book-club-d22cb.appspot.com",
  messagingSenderId: "770005337616",
  appId: "1:770005337616:web:915c26a84ffadac4ff6c95",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRBASE_DB = getFirestore(FIREBASE_APP);
export const FIRBASE_STORAGE = getStorage(FIREBASE_APP);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
