import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import MessageHeader from "../../components/MessageHeader";
import { ClubType, discussionTypes } from "../../types/types";
import {
  DocumentData,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { FIRBASE_DB } from "../../firebaseConfig";
import Container from "../../components/container/Container";
import CustomFlatList from "../../components/FlatList/CustomFlatList";
import Colors from "../../constants/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen-font";
import CustomText from "../../components/Text/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

const DiscussionList = () => {
  const { id } = useLocalSearchParams();
  const [clubs, setClubs] = useState<ClubType>();
  const [discussion, setDisscussins] = useState();

  const [loadingDiscussions, setLoadingDiscussions] = useState(false);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem("@ClubId", `${id}`);
    } catch (error) {}
  };

  /// Fetch Clubs Data
  useEffect(() => {
    const clubRef = doc(FIRBASE_DB, `Clubs/${id}`);
    const unsubscribe = onSnapshot(clubRef, (docSnap: DocumentData) => {
      setClubs({ id: docSnap.id, ...docSnap.data() });
    });
    storeData();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoadingDiscussions(true);
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
    setLoadingDiscussions(false);
    return () => unsubscribe();
  }, []);

  const keyExtractor = (item: discussionTypes, index: number) =>
    item.id.toString();

  const renderVerticalItem = ({ item }: { item: discussionTypes }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(`/discussionForum/${item.id}`)}
          style={styles.books}
        >
          <Image source={{ uri: item?.photoURL }} style={styles.groupImage} />
          <View style={styles.booksDesc}>
            <Text style={styles.title}>{item?.bookTitle}</Text>
            <Text style={styles.title}>by {item?.bookAuther}</Text>
            <Text style={styles.title}>{item?.day}</Text>
            <Text style={styles.title}>{item?.startTime}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Stack.Screen
        options={{
          header: () => (
            <MessageHeader name={clubs?.clubName} members={clubs?.members} />
          ),
        }}
      />
      <Container style={{ marginTop: 80 }}>
        {discussion?.length !== 0 ? (
          <CustomText style={{ textAlign: "center", color: Colors.background }}>
            Disscussions
          </CustomText>
        ) : (
          <CustomText style={{ textAlign: "center", color: Colors.background }}>
            There is no discussion scheduled yet
          </CustomText>
        )}

        {loadingDiscussions ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <CustomFlatList
            data={discussion}
            renderItem={renderVerticalItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContainer}
          />
        )}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  books: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: wp("3.5%"),
  },

  booksDesc: {
    display: "flex",
    justifyContent: "center",
  },
  title: {
    textAlign: "left",
  },

  bookAuther: {
    fontFamily: "poppins-regular",
  },
  text: {
    fontFamily: "poppins-regular",
    color: Colors.white,
  },
  flatListContainer: {
    gap: 10,
  },
  groupImage: {
    height: wp("19%"),
    width: wp("19%"),
    borderRadius: 10,
  },
});
export default DiscussionList;
