import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  DocumentData,
  collection,
  deleteDoc,
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
import { discussionTypes } from "../../../types/types";
import { FIRBASE_DB } from "../../../firebaseConfig";
import Container from "../../../components/container/Container";
import CustomText from "../../../components/Text/CustomText";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import Colors from "../../../constants/Colors";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

const DiscussionList = () => {
  const { discussionList: id } = useLocalSearchParams();
  const [discussion, setDisscussins] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(true);
  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string>();
  const [deleteloading, setDeleteloading] = useState(false);
  const storeData = async () => {
    try {
      await AsyncStorage.setItem("@ClubId", `${id}`);
      console.log("ClubId stored successfully! ", id);
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

  const scheduleDiscussion = async () => {
    try {
      await AsyncStorage.setItem("@ClubId", `null`);
      router.push(`/(tabs)/account/schedule/${id}`);
      console.log("Data stored!");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const updateDiscussion = async (did: string) => {
    try {
      await AsyncStorage.setItem("@ClubId", `${id}`);
      router.push(`/(tabs)/account/schedule/${did}`);
      console.log("Data stored!");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };
  const deleteDiscussion = async () => {
    setDeleteloading(true);
    const discussionDoc = doc(
      FIRBASE_DB,
      `Clubs/${id}/discussions/${deleteId}`
    );
    try {
      await deleteDoc(discussionDoc);
      setDeleteloading(false);
      console.log("clubs successfully deleted");
    } catch (error) {
      console.log("clubs not deleted");
    }
    setDeleteloading(false);
    setVisible(false);
  };

  const handleModal = (id: string) => {
    setVisible(true);
    setDeleteId(id);
  };

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

        <View style={{ display: "flex", gap: 10, marginRight: 10 }}>
          <TouchableOpacity
            onPress={() => updateDiscussion(item.id)}
            style={{ paddingHorizontal: 4 }}
          >
            <Entypo name="edit" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleModal(item.id)}
            style={{ paddingHorizontal: 4 }}
          >
            <AntDesign name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
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
              onPress={() => scheduleDiscussion()}
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
        <Modal transparent visible={visible}>
          <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.background,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <CustomText>Are you sure?</CustomText>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 6,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <CustomText>No</CustomText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteDiscussion()}>
                    {deleteloading ? (
                      <ActivityIndicator size={"small"} />
                    ) : (
                      <CustomText>Yes</CustomText>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    alignItems: "center",

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
  groupImage: {
    height: wp("19%"),
    width: wp("19%"),
    borderRadius: 10,
  },
});
export default DiscussionList;
