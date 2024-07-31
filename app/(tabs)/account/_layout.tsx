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
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen
        name="[discussionList]"
        options={{ headerTitle: "Discussion List" }}
      />
      <Stack.Screen
        name="schedule/[schedule]"
        options={{ headerTitle: "Schedule" }}
      />
    </Stack>
  );
};

export default Layout;
