import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Container from "../../../components/container/Container";
import CustomText from "../../../components/Text/CustomText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen-font";
import Colors from "../../../constants/Colors";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import { router } from "expo-router";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import { AuthContext } from "../../../context/AuthContext";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { FIRBASE_DB } from "../../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClubType } from "../../../types/types";

const Clubs = () => {
  const [clubs, setClubs] = useState<ClubType[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string>();
  const [deleteloading, setDeleteloading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(FIRBASE_DB, "Clubs"),
      where("creater", "==", user?.uid),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (docSnap: DocumentData) => {
      const data = docSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClubs(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createGroup = async () => {
    try {
      await AsyncStorage.setItem("@ClubId", `null`);
      router.push(`/(tabs)/account/CreateClub`);
    } catch (error) {}
  };

  const updateGroup = async (id: string) => {
    try {
      await AsyncStorage.setItem("@ClubId", `${id}`);
      router.push(`/(tabs)/account/CreateClub`);
    } catch (error) {}
  };

  const deleteGroup = async () => {
    setDeleteloading(true);
    const clubDoc = doc(FIRBASE_DB, `Clubs/${deleteId}`);

    try {
      await deleteDoc(clubDoc);
      setDeleteloading(false);
    } catch (error) {}
    setDeleteloading(false);
    setVisible(false);
  };

  const handleModal = (id: string) => {
    setVisible(true);
    setDeleteId(id);
  };

  const clubItems = clubs.map((club) => ({
    id: club.id,
    photoURL: club.photoURL,
    clubName: club.clubName,
    members: club.members,
  }));

  const validClubItems = clubItems ? [...clubItems].reverse() : [];

  const keyExtractor = (item: ClubType, index: number) => item.id.toString();

  const renderVerticalItem = ({ item }: { item: ClubType }) => {
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
          onPress={() => router.push(`/message/${item.id}`)}
          style={styles.books}
        >
          <Image source={{ uri: item?.photoURL }} style={styles.groupImage} />
          <View style={styles.booksDesc}>
            <CustomText variant="black" size="medium" style={styles.title}>
              {item?.clubName}
            </CustomText>

            <Text style={styles.bookAuther}>
              {item?.members?.length} members
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ display: "flex", gap: 10, marginRight: 10 }}>
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/account/${item.id}`)}
            style={{ paddingHorizontal: 4 }}
          >
            <MaterialIcons name="schedule" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateGroup(item.id)}
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
                  <TouchableOpacity onPress={() => deleteGroup()}>
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
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.continer}>
        <Container style={styles.continer}>
          <View style={styles.row}>
            <CustomText style={styles.text}>Create Club</CustomText>
            <CustomTouchableOpacity
              variant="secondary"
              onPress={() => createGroup()}
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
          {loading ? (
            <ActivityIndicator size={"large"} />
          ) : clubs.length !== 0 ? (
            <CustomFlatList
              data={validClubItems}
              renderItem={renderVerticalItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <CustomText
              style={{ textAlign: "center", color: Colors.background }}
            >
              You have not a clubs yet
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

  image: {
    height: hp("14%"),
    width: hp("14%"),
    borderRadius: 200,
  },
  text: {
    color: Colors.background,
  },
  spareter: {
    height: 1.4,
    backgroundColor: Colors.background,
  },
  flatListContainer: {
    gap: 10,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    alignItems: "center",
  },
  books: {
    flexDirection: "row",
    gap: 20,

    borderRadius: 5,
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
  groupImage: {
    height: wp("19%"),
    width: wp("19%"),
    borderRadius: 10,
  },
});

export default Clubs;
