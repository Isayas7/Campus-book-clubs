import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
} from "react-native-responsive-screen-font";
import { StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";
import Container from "../../../components/container/Container";
import CustomText from "../../../components/Text/CustomText";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import { router } from "expo-router";
import {
  DocumentData,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { FIRBASE_DB } from "../../../firebaseConfig";
import { bookType } from "../../../types/types";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [recommendloading, setRecommendloading] = useState(false);

  const [text, setText] = useState<string>();
  const [books, setBooks] = useState<bookType[]>([]);
  const [topViewedBooks, setTopViewedBooks] = useState<bookType[]>([]);

  useEffect(() => {
    setLoading(true);
    const docRef = collection(FIRBASE_DB, "Books");

    const unsubscribe = onSnapshot(docRef, (docSnap: DocumentData) => {
      const data = docSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setRecommendloading(true);
    const booksCollection = collection(FIRBASE_DB, "Books");

    const queryBooks = query(
      booksCollection,
      orderBy("view", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(queryBooks, (querySnapshot) => {
      const books = querySnapshot.docs.map((doc: DocumentData) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTopViewedBooks(books);
      setRecommendloading(false);
      return () => {
        unsubscribe();
      };
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const keys = ["bookTitle", "bookAuthor"];

  const handleSearch = (books: any) => {
    return books?.filter((item: any) =>
      keys.some((key) =>
        item[key].toLowerCase().includes(text?.toLocaleLowerCase())
      )
    );
  };

  const keyExtractor = (item: bookType, index: number) => item.id.toString();

  const renderHorizontaItem = ({ item }: { item: bookType }) => {
    return (
      <Pressable onPress={() => router.push(`/home/${item.id}`)}>
        <Image source={{ uri: item.photoURL }} style={styles.image} />
        <CustomText variant="black" size="small" style={styles.bookTitle}>
          {item.bookTitle}
        </CustomText>
      </Pressable>
    );
  };
  const renderVerticalItem = ({ item }: { item: bookType }) => {
    return (
      <Pressable
        style={styles.books}
        onPress={() => router.push(`/home/${item.id}`)}
      >
        <Image source={{ uri: item.photoURL }} style={styles.image} />
        <View style={styles.booksDesc}>
          <Text style={styles.title}>{item.bookTitle}</Text>

          <Text style={styles.bookAuthor}>By {item.bookAuthor}</Text>
        </View>
      </Pressable>
    );
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Container>
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderRadius: 14,
            padding: 5,
            marginTop: 5,
            borderColor: Colors.background,
            height: hp("7%"),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={{ flex: 1, height: "auto" }}
            placeholder="Search book here"
            onChangeText={(text) => setText(text)}
          />
          <AntDesign name="search1" size={24} color={Colors.background} />
        </View>

        <CustomText variant="black" style={styles.recomendText}>
          Recommended
        </CustomText>

        {recommendloading ? (
          <ActivityIndicator size={"large"} />
        ) : topViewedBooks?.length !== 0 ? (
          <CustomFlatList
            data={topViewedBooks}
            renderItem={renderHorizontaItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContainer}
            horizontal
          />
        ) : (
          <CustomText style={{ textAlign: "center", color: Colors.background }}>
            There is no recommended book for you yet.
          </CustomText>
        )}

        <CustomText variant="black" style={styles.recomendText}>
          Books
        </CustomText>

        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : books?.length !== 0 ? (
          <CustomFlatList
            data={text ? handleSearch(books) : books}
            renderItem={renderVerticalItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContainer}
          />
        ) : (
          <CustomText style={{ textAlign: "center", color: Colors.background }}>
            There is no books
          </CustomText>
        )}
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  search: {
    height: 35,
    width: "100%",
  },
  recomendText: {
    textAlign: "left",
    marginTop: 5,
  },
  flatListContainer: {
    gap: 10,
  },

  image: {
    height: hp("16%"),
    width: wp("26%"),
    borderRadius: 5,
  },
  books: {
    flexDirection: "row",
    gap: 20,
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: wp("3.5%"),
  },

  booksDesc: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },
  title: {
    fontFamily: "poppins-bold",
    fontSize: wf("5.5"),
  },

  bookAuthor: {
    fontFamily: "poppins-regular",
  },
});

export default Home;
