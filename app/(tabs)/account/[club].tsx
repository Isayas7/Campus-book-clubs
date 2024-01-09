import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import Card from "../../../components/Card/Card";
import { DocumentData, collection, doc, onSnapshot } from "firebase/firestore";
import { FIRBASE_DB } from "../../../firebaseConfig";
import { ClubData } from "../../../types/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomText from "../../../components/Text/CustomText";
import { RandomData } from "../../../types/types";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import { Entypo } from "@expo/vector-icons";
import Container from "../../../components/container/Container";
import Colors from "../../../constants/Colors";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import { data } from "../home";

const Club = () => {
  const { club: id } = useLocalSearchParams();
  const [clubs, setClubs] = useState<ClubData>();
  const [loading, setLoading] = useState(true);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    const clubRef = doc(FIRBASE_DB, `Clubs/${id}`);
    const unsubscribe = onSnapshot(clubRef, (docSnap: DocumentData) => {
      setClubs({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const keyExtractor = (item: RandomData, index: number) => item.id.toString();

  const renderVerticalItem = ({ item }: { item: RandomData }) => {
    return (
      <TouchableOpacity
        style={styles.books}
        onPress={() => router.push(`/home/${item.id}`)}
      >
        <Image source={item.image} style={styles.image} />
        <View style={styles.booksDesc}>
          <Text style={styles.title}>{item.name}</Text>

          <Text style={styles.bookAuther}>By {item.name}</Text>
          <Text style={styles.bookAuther}>Day: 12/4/2024</Text>

          <Text style={styles.bookAuther}>Start time: 8:30 am</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.newBackground, gap: 15 }}>
      <Card style={{ marginTop: 10 }}>
        <View style={styles.cardContainer}>
          <Link href={`/${id}`} asChild>
            <TouchableOpacity style={styles.books}>
              <Image
                source={{ uri: clubs?.photoURL }}
                style={styles.groupImage}
              />
              <View style={styles.booksDesc}>
                <CustomText variant="black" size="medium" style={styles.title}>
                  {clubs?.clubName}
                </CustomText>

                <Text style={styles.bookAuther}>
                  {clubs?.members?.length} members
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
          <View style={{ zIndex: 1 }}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => setHide(!hide)}
            >
              <Entypo name="dots-three-vertical" size={24} color="black" />
            </TouchableOpacity>
            {!hide && (
              <View
                style={{
                  position: "absolute",
                  width: 90,
                  top: 25,
                  right: 10,
                  backgroundColor: Colors.background,
                  borderRadius: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                }}
              >
                <TouchableOpacity>
                  <Text style={styles.text}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.text}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.text}>Schedule</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Card>
      <Container>
        {/* <View style={styles.spareter} /> */}
        <CustomText style={{ textAlign: "left", color: Colors.background }}>
          Disscussions
        </CustomText>
        <CustomFlatList
          data={data}
          renderItem={renderVerticalItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContainer}
        />
      </Container>
    </View>
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
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
  },
  spareter: {
    height: 1.4,
    backgroundColor: Colors.background,
  },

  groupImage: {
    height: wp("19%"),
    width: wp("19%"),
    borderRadius: 10,
  },
  image: {
    height: "auto",
    width: wp("25%"),
    borderRadius: 10,
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
    fontFamily: "poppins-regular",
    color: Colors.white,
  },
});
export default Club;
