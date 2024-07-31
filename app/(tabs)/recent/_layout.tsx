import { Stack } from "expo-router";
import React from "react";
import Colors from "../../../constants/Colors";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "400",
          fontFamily: "poppins-regular",
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.white,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Recent",
        }}
      />
    </Stack>
  );
};

export default Layout;
