import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Container from "../components/container/Container";
import CustomText from "../components/Text/CustomText";
import CustomTextInput from "../components/TextInput/CustomTextInput";
import CustomTouchableOpacity from "../components/TouchableOpacity/CustomTouchableOpacity";
import Colors from "../constants/Colors";
import { useForm } from "react-hook-form";
import { userType } from "../types/types";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIRBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const { control, handleSubmit, watch } = useForm<userType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const repeatPaasword = watch("password");

  const Signup = async (userData: userType) => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        userData.email,
        userData.password
      );
      const data = {
        userName: userData.userName,
        photoUrl: [],
      };
      await setDoc(doc(FIRBASE_DB, "users", response.user?.uid), data);
      setLoading(false);
      router.replace("/(tabs)/home");
    } catch (error) {
      setError("try again");
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.wrapper}
      showsVerticalScrollIndicator={false}
    >
      <Container style={styles.container}>
        <CustomText variant="brand" size="medium">
          Register
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
          name="userName"
          rules={{ required: "email is required" }}
          style={styles.input}
          placeholder="username"
        />
        <CustomTextInput
          control={control}
          name="password"
          rules={{ required: "password is required" }}
          style={styles.input}
          placeholder="password"
          secureTextEntry
        />
        <CustomTextInput
          control={control}
          name="repeatPassword"
          rules={{
            validate: (value: any) =>
              value === repeatPaasword || "password does not match",
          }}
          style={styles.input}
          placeholder="repeat password"
          secureTextEntry
        />
        {error && (
          <CustomText size="small" style={{ color: Colors.color_red_700 }}>
            try again
          </CustomText>
        )}

        <CustomTouchableOpacity
          style={styles.button}
          onPress={handleSubmit(Signup)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator style={{ padding: 5 }} />
          ) : (
            <CustomText>Sign up</CustomText>
          )}
        </CustomTouchableOpacity>

        <View style={styles.loginConatiner}>
          <CustomText variant="black" size="small">
            Already have an account?
          </CustomText>
          <Pressable onPress={() => router.back()}>
            <CustomText size="small" variant="brand">
              Login here
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
  },
  input: {
    borderColor: Colors.background,
  },
  button: {
    marginTop: 15,
  },
  loginConatiner: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 10,
  },
});

export default Register;
