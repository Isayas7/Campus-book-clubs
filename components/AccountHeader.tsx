import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { heightPercentageToDP as hp } from "react-native-responsive-screen-font";
import CustomText from "./Text/CustomText";
import CustomTouchableOpacity from "./TouchableOpacity/CustomTouchableOpacity";
import Colors from "../constants/Colors";
import { router } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import { AntDesign } from "@expo/vector-icons";

const AccountHeader = () => {
  const { data, isLoading } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: hp("15%"),
            width: hp("15%"),
            backgroundColor: Colors.newBackground,
            borderRadius: 200,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} />
          ) : data?.photoUrl.slice(-1)[0] ? (
            <Image
              style={styles.image}
              source={{ uri: data?.photoUrl.slice(-1)[0] }}
            />
          ) : (
            <AntDesign name="user" size={hp("7%")} color={Colors.background} />
          )}
        </View>

        <CustomText variant="white" size="medium">
          {data?.userName}
        </CustomText>
        <CustomTouchableOpacity
          onPress={() => router.push("/account/EditProfile")}
          style={{
            paddingVertical: 5,
            paddingHorizontal: 15,
            backgroundColor: Colors.cardBackground,
          }}
        >
          <CustomText size="medium" style={{ color: Colors.background }}>
            Edit
          </CustomText>
        </CustomTouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: hp("15%"),
    width: hp("15%"),
    borderRadius: 200,
  },
  container: {
    backgroundColor: Colors.background,
    alignItems: "center",
    height: hp("28%"),
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});

export default AccountHeader;
