import { Stack } from "expo-router";
import React from "react";
import Colors from "../../../constants/Colors";

import { Ionicons } from "@expo/vector-icons";

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
          headerTitle: "Home",

          headerRight: () => (
            <Ionicons
              name="notifications-circle-outline"
              size={30}
              color="white"
            />
          ),
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Id",
        }}
      />
    </Stack>
  );
};

export default Layout;
