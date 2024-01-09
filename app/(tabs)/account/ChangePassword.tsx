import { View, Text, StyleSheet } from "react-native";
import React, { useContext } from "react";
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

const ChangePassword = () => {
  const { user } = useContext(AuthContext);

  const { control, handleSubmit } = useForm<passwordChangeProps>();
  // const onSubmit = (data: passwordChangeProps) => {
  //   if (user) {
  //     console.log("from usename", data.userName);

  //     mutate({ id: user?.uid, username: data.userName });
  //   }
  // };

  // const { mutate } = useMutation(updateUserName);
  return (
    <View style={styles.wrapper}>
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
