import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import { StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";
import Container from "../../../components/container/Container";
import CustomTextInput from "../../../components/TextInput/CustomTextInput";
import CustomText from "../../../components/Text/CustomText";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import { Redirect, router } from "expo-router";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../context/AuthContext";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { FIRBASE_DB } from "../../../firebaseConfig";
import { bookType } from "../../../types/types";

const Home = () => {
  const { isLoading, authenticated } = useContext(AuthContext);
  const { control } = useForm();
  const [books, setBooks] = useState();
  const [loading, setLoading] = useState(true);

  // if (!authenticated) {
  //   return <Redirect href="/login" />;
  // }

  useEffect(() => {
    const docRef = collection(FIRBASE_DB, "Books");

    const unsubscribe = onSnapshot(docRef, (docSnap: DocumentData) => {
      const data = docSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(data);
    });
    setLoading(false);
    return () => unsubscribe();
  }, []);

  if (isLoading || loading)
    return (
      <ActivityIndicator
        size={"large"}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  const keyExtractor = (item: bookType, index: number) => item.id.toString();

  const renderHorizontaItem = ({ item }: { item: bookType }) => {
    return (
      <View>
        <Image source={{ uri: item.photoURL }} style={styles.image} />
        <CustomText variant="black" size="small" style={styles.bookTitle}>
          {item.bookTitle}
        </CustomText>
      </View>
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
        <CustomTextInput
          control={control}
          name="search"
          icon="search"
          // style={styles.search}
          placeholder="Search book here"
        />

        <CustomText variant="black" style={styles.recomendText}>
          Recommended
        </CustomText>
        <CustomFlatList
          data={books}
          renderItem={renderHorizontaItem}
          showsHorizontalScrollIndicator={false}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContainer}
          horizontal
        />

        <CustomText variant="black" style={styles.recomendText}>
          Books
        </CustomText>
        <CustomFlatList
          data={books}
          renderItem={renderVerticalItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContainer}
        />
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
    // alignItems: "center",
    // justifyContent: "center",
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
