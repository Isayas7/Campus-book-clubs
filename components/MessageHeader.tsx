import { View, Text, StyleSheet, Image } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import CustomText from "./Text/CustomText";
import CustomTouchableOpacity from "./TouchableOpacity/CustomTouchableOpacity";
import Colors from "../constants/Colors";
import { router } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import Container from "./container/Container";
import { TouchableOpacity } from "react-native-gesture-handler";

type ClubDataInfo = {
  name?: string;
  members?: number;
};

const MessageHeader: React.FC<ClubDataInfo> = (props) => {
  const { data } = useContext(AuthContext);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Container>
          <View style={styles.headerContainer}>
            <TouchableOpacity>
              <Ionicons
                name="arrow-back"
                size={26}
                color="white"
                onPress={() => router.back()}
              />
            </TouchableOpacity>
            <Image
              style={styles.image}
              source={require("../assets/images/book1.jpg")}
            />
            <View style={{ alignItems: "flex-start" }}>
              <CustomText>{props.name}</CustomText>
              <CustomText size="small">{props.members} members </CustomText>
            </View>
          </View>
        </Container>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 55,
    width: 55,
    borderRadius: 200,
  },
  wrapper: {
    backgroundColor: Colors.background,
    height: 57,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});

export default MessageHeader;
