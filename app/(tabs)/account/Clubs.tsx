import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Container from "../../../components/container/Container";
import CustomText from "../../../components/Text/CustomText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import Colors from "../../../constants/Colors";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ImageCard from "../../../components/imageCard/ImageCard";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import { data } from "../home";
import { AuthContext } from "../../../context/AuthContext";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { FIRBASE_DB } from "../../../firebaseConfig";

interface ClubType {
  id: string;
  url: string;
  clubName: string;
  photoURL: string[];
}

const Clubs = () => {
  const [clubs, setClubs] = useState<ClubType[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: userData, user } = useContext(AuthContext);

  useEffect(() => {
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

  const keyExtractor = (item: ClubType, index: number) => item.id.toString();
  const numColumns = 3;

  const renderVerticalItem = ({ item }: { item: ClubType }) => {
    const columnWidth = wp(100) / numColumns - 10;
    return (
      <TouchableOpacity
        onPress={() => router.push(`/(tabs)/account/${item.id}`)}
      >
        <View
          style={{
            width: columnWidth,
            marginHorizontal: 5,
            justifyContent: "center",
          }}
        >
          <Image style={styles.image} source={{ uri: item.url }} />
          <CustomText size="small" style={styles.text}>
            {item.clubName}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };
  const clubItems = clubs.map((club) => ({
    id: club.id,
    url: club.photoURL,
    clubName: club.clubName,
  }));
  const validClubItems = clubItems ? [...clubItems].reverse() : [];

  return (
    <View style={styles.wrapper}>
      <Container style={styles.continer}>
        <View style={styles.row}>
          <CustomText style={styles.text}>Create Club</CustomText>
          <CustomTouchableOpacity
            variant="secondary"
            onPress={() => router.push("/(tabs)/account/CreateClub")}
          >
            <Ionicons name="add-outline" size={24} color={Colors.background} />
          </CustomTouchableOpacity>
        </View>

        <View style={styles.spareter} />

        <CustomFlatList
          style={{ marginBottom: 74 }}
          data={validClubItems}
          renderItem={renderVerticalItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          numColumns={numColumns}
          contentContainerStyle={styles.flatListContainer}
        />
      </Container>
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
    gap: 20,
  },
});

export default Clubs;
