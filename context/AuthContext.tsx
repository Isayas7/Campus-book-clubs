import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { FIRBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { DocumentData, doc, getDoc, onSnapshot } from "firebase/firestore";

interface AuthContextType {
  user?: User | null;
  data?: userProps;
  isLoading?: boolean;
  authenticated?: boolean;
  setAuthenticated?: () => void;
}

interface userProps {
  photoUrl: string[];
  userName: string;
}

export const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<userProps | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const docRef = doc(FIRBASE_DB, "users", user?.uid);

      const unsubscribe = onSnapshot(docRef, (docSnap: DocumentData) => {
        setData({ id: docSnap.id, ...docSnap.data() });
      });

      const delayTimer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => {
        clearTimeout(delayTimer);
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      if (authUser) {
        setUser(authUser);
        setAuthenticated(true);
        setIsLoading(false);
      } else if (!authUser) {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authUser: AuthContextType = {
    user,
    isLoading,
    data,
    authenticated,
  };

  return (
    <AuthContext.Provider value={authUser}>{children}</AuthContext.Provider>
  );
};
