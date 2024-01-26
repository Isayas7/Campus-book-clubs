import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
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
import { AuthContext } from "../../../context/AuthContext";
import { passwordChangeProps } from "../../../types/types";
import { doc, updateDoc } from "firebase/firestore";
import { FIRBASE_DB } from "../../../firebaseConfig";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const { control, handleSubmit } = useForm<passwordChangeProps>();

  // const updateUserName = async (data: passwordChangeProps) => {
  //   if (user) {
  //     setLoading(true);
  //     const docRef = doc(FIRBASE_DB, "users", user.uid);

  //     try {
  //       await updateDoc(docRef, {
  //         userName: data.newPassword,
  //       });
  //       setLoading(false);
  //       router.push("/(tabs)/account");
  //       console.log("user updating successfully");
  //     } catch (error) {
  //       console.error("Error updating user :", error);
  //     }
  //   }
  // };

  return (
    <ScrollView style={styles.wrapper}>
      <Container style={styles.container}>
        <View>
          <CustomText style={styles.text}>Old Password</CustomText>
          <CustomTextInput
            placeholder="Enter old password"
            control={control}
            name="oldPassword"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>New Password</CustomText>
          <CustomTextInput
            placeholder="Enter new password"
            control={control}
            name="newPassword"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Confirm Password</CustomText>
          <CustomTextInput
            placeholder="Enter new password"
            control={control}
            name="repeatNewPassword"
          ></CustomTextInput>
        </View>

        <CustomTouchableOpacity>
          <CustomText>Change</CustomText>
        </CustomTouchableOpacity>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    backgroundColor: Colors.newBackground,
  },
  container: {
    flex: 1,
    gap: 25,
    // justifyContent: "center",
    marginTop: hp("7%"),
  },
  text: {
    textAlign: "left",
    color: Colors.background,
  },
});
export default ChangePassword;
