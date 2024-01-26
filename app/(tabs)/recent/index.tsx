import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { FIRBASE_DB } from "../../../firebaseConfig";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { bookType } from "../../../types/types";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import { StatusBar } from "expo-status-bar";
import Container from "../../../components/container/Container";
import Colors from "../../../constants/Colors";
import CustomText from "../../../components/Text/CustomText";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";

const Recent = () => {
  const { user } = useContext(AuthContext);
  const [recentBooks, setRecentBooks] = useState<bookType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRef = doc(FIRBASE_DB, `users/${user?.uid}`);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      const recentReadings = docSnap.data()?.recent || [];

      const booksRef = collection(FIRBASE_DB, "Books");
      onSnapshot(booksRef, (querySnapshot) => {
        const booksData = recentReadings.map((bookId: string) => {
          const bookDoc = querySnapshot.docs.find((doc) => doc.id === bookId);
          return bookDoc ? { id: bookDoc.id, ...bookDoc.data() } : null;
        });

        const filteredBooksData = booksData.filter(
          (book: string) => book !== null
        );

        setLoading(false);
        setRecentBooks(filteredBooksData);
      });
    });

    return () => unsubscribe();
  }, [user]);

  const keyExtractor = (item: bookType, index: number) => item.id.toString();

  const renderVerticalItem = ({ item }: { item: bookType }) => {
    return (
      <Pressable
        style={styles.books}
        // onPress={() => router.push(`/home/${item.id}`)}
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

      <Container style={{ gap: 10, marginTop: 12 }}>
        {recentBooks?.length !== 0 ? (
          <CustomText
            size="large"
            style={{ textAlign: "center", color: Colors.background }}
          >
            Your recent reading
          </CustomText>
        ) : (
          <CustomText style={{ textAlign: "center", color: Colors.background }}>
            You are not read a books yet
          </CustomText>
        )}

        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <CustomFlatList
            data={recentBooks}
            renderItem={renderVerticalItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContainer}
          />
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

export default Recent;
