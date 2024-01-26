import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
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
import CustomText from "../../../components/Text/CustomText";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import { Link } from "expo-router";
import { ClubType, bookType } from "../../../types/types";
import {
  DocumentData,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { FIRBASE_DB } from "../../../firebaseConfig";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../../context/AuthContext";

const Clubs = () => {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState<bookType[]>([]);
  const [topClubs, setTopClubs] = useState<bookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendloading, setRecommendloading] = useState(true);
  const [text, setText] = useState<string>();

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

  useEffect(() => {
    const clubCollection = collection(FIRBASE_DB, "Clubs");

    const queryBooks = query(
      clubCollection,
      orderBy("member", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(queryBooks, (querySnapshot) => {
      const clubs = querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTopClubs(clubs);
    });
    setRecommendloading(false);
    return () => unsubscribe();
  }, []);

  const keyExtractor = (item: ClubType, index: number) => item.id;

  const renderHorizontaItem = ({ item }: { item: ClubType }) => {
    return (
      <View>
        {item.photoURL ? (
          <Image source={{ uri: item.photoURL }} style={styles.image} />
        ) : (
          <MaterialIcons name="group" size={24} color="black" />
        )}

        <CustomText variant="black" size="small" style={styles.bookTitle}>
          {item.clubName}
        </CustomText>
      </View>
    );
  };
  const renderVerticalItem = ({ item }: { item: ClubType }) => {
    return (
      <Link key={item.id} href={`/message/${item.id}`} asChild>
        <TouchableOpacity style={styles.books}>
          {item.photoURL ? (
            <Image source={{ uri: item.photoURL }} style={styles.image} />
          ) : (
            <MaterialIcons name="group" size={24} color="black" />
          )}
          <View style={styles.booksDesc}>
            <CustomText variant="black" size="medium" style={styles.title}>
              {item.clubName}
            </CustomText>
            {user && (
              <Text style={styles.bookAuther}>
                {item?.members?.includes(user?.uid) ||
                user?.uid === item.creater
                  ? item.lastMessage
                  : item.members?.length + " members"}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  const keys = ["clubName", "about"];

  const handleSearch = (clubs: any) => {
    return clubs?.filter((item: any) =>
      keys.some((key) =>
        item[key].toLowerCase().includes(text?.toLocaleLowerCase())
      )
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
            placeholder="Search clubs here"
            onChangeText={(text) => setText(text)}
          />
          <AntDesign name="search1" size={24} color={Colors.background} />
        </View>
        {topClubs?.length !== 0 ? (
          <CustomText variant="black" style={styles.recomendText}>
            Recommended
          </CustomText>
        ) : (
          clubs?.length !== 0 && (
            <CustomText
              style={{ textAlign: "center", color: Colors.background }}
            >
              There is no recommended club for you yet.
            </CustomText>
          )
        )}

        {recommendloading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <CustomFlatList
            data={topClubs}
            renderItem={renderHorizontaItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContainer}
            horizontal
          />
        )}
        {clubs?.length !== 0 ? (
          <CustomText variant="black" style={styles.recomendText}>
            Clubs
          </CustomText>
        ) : (
          <CustomText style={{ textAlign: "center", color: Colors.background }}>
            There is no clubs
          </CustomText>
        )}

        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <CustomFlatList
            data={text ? handleSearch(clubs) : clubs}
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
