import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  DocumentData,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClubData, discussionTypes } from "../../../types/types";
import { FIRBASE_DB } from "../../../firebaseConfig";
import Container from "../../../components/container/Container";
import CustomText from "../../../components/Text/CustomText";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import Colors from "../../../constants/Colors";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import { Ionicons } from "@expo/vector-icons";

const DiscussionList = () => {
  const { discussionList: id } = useLocalSearchParams();
  const [discussion, setDisscussins] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(true);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem("@ClubId", `${id}`);
      console.log("Data stored successfully!");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  useEffect(() => {
    const q = query(
      collection(FIRBASE_DB, `Clubs/${id}/discussions`),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (docSnap: DocumentData) => {
      const data = docSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDisscussins(data);
    });
    storeData();
    const delayTimer = setTimeout(() => {
      setLoadingDiscussions(false);
    }, 2000);

    return () => {
      clearTimeout(delayTimer);
      unsubscribe();
    };
  }, []);

  const keyExtractor = (item: discussionTypes, index: number) =>
    item.id.toString();

  const renderVerticalItem = ({ item }: { item: discussionTypes }) => {
    return (
      <TouchableOpacity
        style={styles.books}
        onPress={() => router.push(`/discussionForum/${item.id}`)}
      >
        {/* <Image source={} style={styles.image} /> */}
        <View style={styles.booksDesc}>
          <Text style={styles.title}>{item.bookTitle}</Text>

          <Text style={styles.bookAuther}>By {item.bookAuther}</Text>
          <Text style={styles.bookAuther}>{item.day}</Text>

          <Text style={styles.bookAuther}>Start time: {item.startTime} am</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.continer}>
        <Container>
          <View style={styles.row}>
            <CustomText style={styles.text}>Schedule discussion</CustomText>
            <CustomTouchableOpacity
              variant="secondary"
              onPress={() => router.push(`/(tabs)/account/schedule/${id}`)}
            >
              <Ionicons
                name="add-outline"
                size={24}
                color={Colors.background}
              />
            </CustomTouchableOpacity>
          </View>
        </Container>

        <View style={styles.spareter} />

        <Container style={{ marginBottom: hp("25%") }}>
          {loadingDiscussions ? (
            <ActivityIndicator size={"large"} />
          ) : discussion.length !== 0 ? (
            <CustomFlatList
              data={discussion}
              renderItem={renderVerticalItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <CustomText
              style={{ textAlign: "center", color: Colors.background }}
            >
              There is no discussion
            </CustomText>
          )}
        </Container>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    backgroundColor: Colors.newBackground,
  },
  continer: {
    gap: 15,
    marginTop: hp("1%"),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spareter: {
    height: 1.4,
    backgroundColor: Colors.background,
  },
  books: {
    flexDirection: "row",
    gap: 20,

    borderRadius: 5,
  },
  bookTitle: {
    fontSize: wp("3.5%"),
  },

  booksDesc: {
    display: "flex",
    justifyContent: "center",
    // gap: 2,
  },
  title: {
    textAlign: "left",
  },

  bookAuther: {
    fontFamily: "poppins-regular",
  },
  text: {
    color: Colors.background,
  },
  flatListContainer: {
    gap: 10,
  },
});
export default DiscussionList;
