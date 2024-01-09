import { View, Text } from "react-native";
import React from "react";
import { Redirect, router } from "expo-router";
import CustomTouchableOpacity from "../components/TouchableOpacity/CustomTouchableOpacity";
import CustomText from "../components/Text/CustomText";

const index = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CustomTouchableOpacity onPress={() => router.push("/login")}>
        <CustomText>Login</CustomText>
      </CustomTouchableOpacity>
      <CustomTouchableOpacity onPress={() => router.push("/(tabs)/home")}>
        <CustomText>Home</CustomText>
      </CustomTouchableOpacity>
    </View>
  );
};

export default index;
