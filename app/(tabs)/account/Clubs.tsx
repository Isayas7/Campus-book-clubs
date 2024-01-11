import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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

interface ClubType {
  id: string;
  url: string;
  clubName: string;
  photoURL: string[];
  members: string[];
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

  const createGroup = async () => {
    try {
      await AsyncStorage.setItem("@ClubId", `null`);
      router.push(`/(tabs)/account/CreateClub`);
      console.log("Data stored!");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const updateGroup = async (id: string) => {
    try {
      await AsyncStorage.setItem("@ClubId", `${id}`);
      router.push(`/(tabs)/account/CreateClub`);
      console.log("Data stored!");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };
  const deleteGroup = async (id: string) => {
    // const clubDoc = doc(FIRBASE_DB, "Clubs", id);
    // try {
    //   await deleteDoc(clubDoc);
    //   console.log("clubs successfully deleted");
    // } catch (error) {
    //   console.log("clubs not deleted");
    // }
  };

  const clubItems = clubs.map((club) => ({
    id: club.id,
    url: club.photoURL,
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
          <Image source={{ uri: item?.url }} style={styles.groupImage} />
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
            onPress={() => deleteGroup(item.id)}
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
          ) : (
            <CustomFlatList
              data={validClubItems}
              renderItem={renderVerticalItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.flatListContainer}
            />
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
