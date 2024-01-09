import React, { ReactNode, createContext, useContext } from "react";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { useQuery, QueryKey, UseQueryResult } from "@tanstack/react-query";
import { getUser } from "../services/users";
import { AuthContext } from "./AuthContext";

interface UserContextType {
  isLoading?: boolean;
  data?: userProps;
}

interface userProps {
  photoUrl: string[];
  userName: string;
}

export const UserContext = createContext<UserContextType>({});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = FIREBASE_AUTH;

  const { data, isLoading, error }: UseQueryResult<userProps | undefined> =
    useQuery({
      queryKey: ["user"],
      queryFn: () => currentUser && getUser(currentUser.uid),
    });

  return (
    <UserContext.Provider value={{ data, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
