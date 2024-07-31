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
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
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
import { bookType } from "../../../types/types";

const Books = () => {
  const [books, setBooks] = useState<bookType[]>([]);
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string>();
  const [deleteloading, setDeleteloading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(FIRBASE_DB, "Books"),
      where("creater", "==", user?.uid),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (docSnap: DocumentData) => {
      const data = docSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const uploadBook = async () => {
    try {
      await AsyncStorage.setItem("@bookId", `null`);
      router.push(`/(tabs)/account/UploadBook`);
    } catch (error) {}
  };

  const updateBook = async (id: string) => {
    try {
      await AsyncStorage.setItem("@bookId", `${id}`);
      router.push(`/(tabs)/account/UploadBook`);
    } catch (error) {}
  };

  const deletebook = async () => {
    setDeleteloading(true);
    const bookDoc = doc(FIRBASE_DB, `Books/${deleteId}`);

    try {
      await deleteDoc(bookDoc);
      setDeleteloading(false);
    } catch (error) {}
    setDeleteloading(false);
    setVisible(false);
  };

  const handleModal = (id: string) => {
    setVisible(true);
    setDeleteId(id);
  };

  const clubItems = books.map((book) => ({
    id: book.id,
    photoURL: book.photoURL,
    bookAuthor: book.bookAuthor,
    bookTitle: book.bookTitle,
  }));

  const validClubItems = clubItems ? [...clubItems].reverse() : [];

  const keyExtractor = (item: bookType, index: number) => item.id.toString();

  const renderVerticalItem = ({ item }: { item: bookType }) => {
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
              {item?.bookTitle}
            </CustomText>

            <Text style={styles.bookAuther}>by {item?.bookAuthor}</Text>
          </View>
        </TouchableOpacity>

        <View style={{ display: "flex", gap: 10, marginRight: 10 }}>
          <TouchableOpacity
            onPress={() => updateBook(item.id)}
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
        <Container style={styles.continer}>
          <View style={styles.row}>
            <CustomText style={styles.text}>Upload book</CustomText>
            <CustomTouchableOpacity
              variant="secondary"
              onPress={() => uploadBook()}
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
          ) : validClubItems.length !== 0 ? (
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
              You have not a books yet
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
                  <TouchableOpacity onPress={() => deletebook()}>
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
    borderRadius: 5,
  },
});

export default Books;
