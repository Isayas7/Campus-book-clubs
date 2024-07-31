import React, { useContext } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import { ActivityIndicator } from "react-native";

const index = () => {
  const { isLoading, authenticated } = useContext(AuthContext);
  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ justifyContent: "center", alignItems: "center" }}
        size={"large"}
      />
    );
  } else if (authenticated) {
    return <Redirect href="/(tabs)/home" />;
  } else if (!authenticated) {
    return <Redirect href="/login" />;
  }
};

export default index;
