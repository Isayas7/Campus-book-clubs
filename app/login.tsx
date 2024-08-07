import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen-font";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Image } from "react-native";
import Colors from "../constants/Colors";
import { router } from "expo-router";
import CustomText from "../components/Text/CustomText";
import CustomTouchableOpacity from "../components/TouchableOpacity/CustomTouchableOpacity";
import CustomTextInput from "../components/TextInput/CustomTextInput";
import Container from "../components/container/Container";
import { useForm } from "react-hook-form";
import { userType } from "../types/types";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";

const Login = () => {
  const { control, handleSubmit } = useForm<userType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const Signin = async (userData: userType) => {
    setLoading(true);
    try {
      const data = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        userData.email,
        userData.password
      );
      if (data) {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      setError("try again");
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.wrapper}>
      <Image
        source={require("../assets/images/logo2.png")}
        style={styles.man_image}
      />

      <Container style={styles.conntainer}>
        <CustomText variant="brand" size="medium">
          Login
        </CustomText>
        <CustomTextInput
          control={control}
          name="email"
          rules={{ required: "email is required" }}
          style={styles.input}
          placeholder="email"
        />
        <CustomTextInput
          control={control}
          name="password"
          rules={{ required: "password is required" }}
          style={styles.input}
          secureTextEntry
          placeholder="password"
        />
        {error && (
          <CustomText size="small" style={{ color: Colors.color_red_700 }}>
            try again
          </CustomText>
        )}
        <CustomTouchableOpacity
          disabled={loading}
          onPress={handleSubmit(Signin)}
        >
          {loading ? (
            <ActivityIndicator style={{ padding: 5 }} />
          ) : (
            <CustomText>Login</CustomText>
          )}
        </CustomTouchableOpacity>

        <View style={styles.signupConatiner}>
          <CustomText variant="black" size="small">
            Don't have an account?
          </CustomText>
          <Pressable onPress={() => router.push(`/register`)}>
            <CustomText size="small" variant="brand">
              Sign up here
            </CustomText>
          </Pressable>
        </View>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.cardBackground,
    height: "100%",
  },
  man_image: {
    height: hp("30%"),
    width: wp("100%"),
    marginVertical: 12,
  },
  conntainer: {
    backgroundColor: "#fff",
    paddingHorizontal: hp("2%"),
    paddingVertical: hp("4%"),
    gap: 8,
    borderRadius: 15,
  },
  input: {
    borderColor: Colors.background,
  },

  signupConatiner: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: 5,
    marginTop: 10,
  },
  red: {
    backgroundColor: "#000",
  },
  green: {
    backgroundColor: "#fff",
  },
});

export default Login;
