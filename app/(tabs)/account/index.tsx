import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Container from "../../../components/container/Container";
import { Stack, router } from "expo-router";
import AccountHeader from "../../../components/AccountHeader";
import { StatusBar } from "expo-status-bar";
import Colors from "../../../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import CustomText from "../../../components/Text/CustomText";
import Card from "../../../components/Card/Card";
import {
  AntDesign,
  Foundation,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { AuthContext } from "../../../context/AuthContext";
import { signOut } from "firebase/auth";
import { FIRBASE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { bookType, ClubType } from "../../../types/types";
import { TouchableOpacity } from "react-native-gesture-handler";

const Settings = () => {
  const { isLoading, data, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<bookType[]>([]);
  const [clubs, setClubs] = useState<ClubType[]>([]);

  const Logout = async () => {
    setLoading(true);
    try {
      await signOut(FIREBASE_AUTH);
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const bookQuery = query(
      collection(FIRBASE_DB, "Books"),
      where("creater", "==", user?.uid)
    );

    const booksData = onSnapshot(bookQuery, (docSnap: DocumentData) => {
      const data = docSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(data);
    });

    const clubQuery = query(
      collection(FIRBASE_DB, "Clubs"),
      where("creater", "==", user?.uid)
    );

    const clubData = onSnapshot(clubQuery, (docSnap: DocumentData) => {
      const data = docSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClubs(data);
    });

    return () => {
      booksData();
      clubData();
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.newBackground }}>
      <Container>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <Stack.Screen
          options={{
            header: () => <AccountHeader />,
          }}
        />

        <View style={styles.cardContiner}>
          <Card style={{ width: wp("29%") }}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/account/clubs")}
            >
              <CustomText style={styles.cardHeader}>Clubs</CustomText>
              <CustomText size="large" style={styles.cardNumber}>
                {clubs?.length}
              </CustomText>
            </TouchableOpacity>
          </Card>

          <Card style={{ width: wp("29%") }}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/account/Books")}
            >
              <CustomText style={styles.cardHeader}>Books</CustomText>
              <CustomText size="large" style={styles.cardNumber}>
                {books?.length}
              </CustomText>
            </TouchableOpacity>
          </Card>

          <Card style={{ width: wp("29%") }}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/account/Photos")}
            >
              <CustomText style={styles.cardHeader}>Photos</CustomText>
              <CustomText size="large" style={styles.cardNumber}>
                {data?.photoUrl.length}
              </CustomText>
            </TouchableOpacity>
          </Card>
        </View>

        <Card style={styles.cardStyle}>
          <CustomText size="medium" style={styles.cardHeader}>
            Account
          </CustomText>

          <Pressable
            style={styles.list}
            onPress={() => router.push("/account/Books")}
          >
            <Ionicons name="book-outline" size={24} color={Colors.newColor} />
            <CustomText style={styles.text}>Books</CustomText>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.background}
            />
          </Pressable>

          <Pressable
            style={styles.list}
            onPress={() => router.push("/(tabs)/account/clubs")}
          >
            <MaterialIcons
              name="people-outline"
              size={24}
              color={Colors.newColor}
            />
            <CustomText style={styles.text}>Clubs</CustomText>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.background}
            />
          </Pressable>

          <Pressable
            style={styles.list}
            onPress={() => router.push("/(tabs)/account/Photos")}
          >
            <Foundation name="photo" size={24} color={Colors.newColor} />
            <CustomText style={styles.text}>Photos</CustomText>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.background}
            />
          </Pressable>

          <Pressable style={styles.list} onPress={() => Logout()}>
            <AntDesign name="logout" size={24} color={Colors.newColor} />

            {loading ? (
              <ActivityIndicator style={styles.text} />
            ) : (
              <CustomText style={styles.text}>Logout</CustomText>
            )}
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.background}
            />
          </Pressable>
        </Card>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContiner: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-around",
    marginTop: hp("30%"),
  },
  cardStyle: {
    marginTop: wp("5%"),
    gap: wf("4%"),
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  text: {
    textAlign: "left",
    flex: 1,
    color: Colors.background,
  },
  cardHeader: {
    color: Colors.background,
  },
  cardNumber: {
    color: Colors.newColor,
  },
});
export default Settings;
