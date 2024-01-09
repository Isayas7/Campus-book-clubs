import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Container from "../../../components/container/Container";
import CustomTextInput from "../../../components/TextInput/CustomTextInput";
import { useForm } from "react-hook-form";
import Colors from "../../../constants/Colors";
import CustomText from "../../../components/Text/CustomText";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const UploadBook = () => {
  const { control } = useForm();
  return (
    <View style={styles.wrapper}>
      <Container style={styles.container}>
        <View>
          <CustomText style={styles.text}>Book title</CustomText>
          <CustomTextInput
            placeholder="Enter Book title"
            control={control}
            name="book_title"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Author</CustomText>
          <CustomTextInput
            placeholder="Enter Author of the book"
            control={control}
            name="author"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Book</CustomText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Image
              style={styles.image}
              source={require("../../../assets/images/book1.jpg")}
            />
            <CustomTouchableOpacity
              variant="secondary"
              onPress={() => router.push("/(tabs)/account/UploadBook")}
            >
              <Ionicons
                name="add-outline"
                size={24}
                color={Colors.background}
              />
            </CustomTouchableOpacity>
          </View>
        </View>

        <CustomTouchableOpacity>
          <CustomText>Upload</CustomText>
        </CustomTouchableOpacity>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    backgroundColor: Colors.newBackground,
  },
  container: {
    flex: 1,
    gap: 20,
    marginTop: hp("5%"),
  },
  image: {
    height: hp("13%"),
    width: hp("11%"),
    borderRadius: 3,
  },
  text: {
    textAlign: "left",
    color: Colors.background,
  },
});
export default UploadBook;
