import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { backendClubProps } from "../../../types/types";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { FIRBASE_DB } from "../../../firebaseConfig";

const Clubs = () => {
  const { control } = useForm();
  const [clubs, setClubs] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = collection(FIRBASE_DB, "Clubs");

    const unsubscribe = onSnapshot(docRef, (docSnap: DocumentData) => {
      const data = docSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClubs(data);
    });
    setLoading(false);
    return () => unsubscribe();
  }, []);

  const keyExtractor = (item: backendClubProps, index: number) => item.id;

  const renderHorizontaItem = ({ item }: { item: backendClubProps }) => {
    const photoUrl = item?.photoURl;
    const imageSource = photoUrl
      ? { uri: photoUrl }
      : require("../../../assets/images/book1.jpg");
    return (
      <View>
        <Image source={imageSource} style={styles.image} />
        <CustomText variant="black" size="small" style={styles.bookTitle}>
          {item.clubName}
        </CustomText>
      </View>
    );
  };
  const renderVerticalItem = ({ item }: { item: backendClubProps }) => {
    const photoUrl = item?.photoURl;
    const imageSource = photoUrl
      ? { uri: photoUrl }
      : require("../../../assets/images/book1.jpg");
    return (
      <Link key={item.id} href={`/${item.id}`} asChild>
        <TouchableOpacity style={styles.books}>
          <Image source={imageSource} style={styles.image} />
          <View style={styles.booksDesc}>
            <CustomText variant="black" size="medium" style={styles.title}>
              {item.clubName}
            </CustomText>

            <Text style={styles.bookAuther}>123 Members</Text>
          </View>
        </TouchableOpacity>
      </Link>
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
          placeholder="Search Clubs here"
        />

        <CustomText variant="black" style={styles.recomendText}>
          Recommended
        </CustomText>

        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <CustomFlatList
            data={clubs}
            renderItem={renderHorizontaItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContainer}
            horizontal
          />
        )}

        <CustomText variant="black" style={styles.recomendText}>
          Clubs
        </CustomText>

        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <CustomFlatList
            data={clubs}
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
    height: hp("6%"),
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
    height: wp("19%"),
    width: wp("19%"),
    borderRadius: 200,
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
});

export default Clubs;
