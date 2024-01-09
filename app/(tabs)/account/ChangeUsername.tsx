import { View, StyleSheet, ActivityIndicator } from "react-native";
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
import { usenameChangeProps } from "../../../types/types";
import { FIRBASE_DB } from "../../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";

const ChangeUsername = () => {
  const { user } = useContext(AuthContext);

  const { control, handleSubmit } = useForm<usenameChangeProps>();
  const [loading, setLoading] = useState(false);

  const updateUserName = async (data: usenameChangeProps) => {
    if (user) {
      setLoading(true);
      const docRef = doc(FIRBASE_DB, "users", user.uid);

      try {
        await updateDoc(docRef, {
          userName: data.userName,
        });
        setLoading(false);
        router.push("/(tabs)/account");
        console.log("user updating successfully");
      } catch (error) {
        console.error("Error updating user :", error);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <Container style={styles.container}>
        <View>
          <CustomText style={styles.text}>Username</CustomText>
          <CustomTextInput
            placeholder="Enter new username"
            control={control}
            name="userName"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Password</CustomText>
          <CustomTextInput
            placeholder="Enter password"
            secureTextEntry
            control={control}
            name="password"
          ></CustomTextInput>
        </View>
        <CustomTouchableOpacity onPress={handleSubmit(updateUserName)}>
          {loading ? (
            <ActivityIndicator style={{ padding: 5 }} />
          ) : (
            <CustomText>Change</CustomText>
          )}
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
    gap: 30,
    marginTop: hp("7%"),
  },
  text: {
    textAlign: "left",
    color: Colors.background,
  },
});
export default ChangeUsername;
