import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import { StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";
import { RandomData } from "../../../types/types";
import Container from "../../../components/container/Container";
import CustomTextInput from "../../../components/TextInput/CustomTextInput";
import CustomText from "../../../components/Text/CustomText";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import { Redirect, router } from "expo-router";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../context/AuthContext";

export const data: RandomData[] = [
  {
    id: 1,
    name: "Bianca Hobbs",
    phone: "(427) 690-7565",
    email: "imperdiet@outlook.net",
    region: "Kirovohrad oblast",
    country: "Belgium",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 2,
    name: "Nolan Hill",
    phone: "1-292-448-3486",
    email: "blandit.mattis@aol.net",
    region: "Sląskie",
    country: "United States",
    image: require("../../../assets/images/book3.jpg"),
  },
  {
    id: 3,
    name: "Alfreda Leonard",
    phone: "1-632-333-3456",
    email: "mollis.vitae@outlook.org",
    region: "Cordillera Administrative Region",
    country: "United Kingdom",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 4,
    name: "Cairo Mann",
    phone: "1-316-788-6768",
    email: "proin@protonmail.ca",
    region: "Antwerpen",
    country: "China",
    image: require("../../../assets/images/book3.jpg"),
  },
  {
    id: 5,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 6,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 7,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 8,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 9,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 10,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 11,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 12,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 13,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 14,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
  {
    id: 15,
    name: "Alyssa Mueller",
    phone: "1-142-727-5041",
    email: "auctor@icloud.org",
    region: "Västra Götalands län",
    country: "France",
    image: require("../../../assets/images/book1.jpg"),
  },
];

const Home = () => {
  const { isLoading, authenticated } = useContext(AuthContext);

  // if (!authenticated) {
  //   return <Redirect href="/login" />;
  // }

  if (isLoading)
    return (
      <ActivityIndicator
        size={"large"}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  const { control } = useForm();
  const keyExtractor = (item: RandomData, index: number) => item.id.toString();

  const renderHorizontaItem = ({ item }: { item: RandomData }) => {
    return (
      <View>
        <Image source={item.image} style={styles.image} />
        <CustomText variant="black" size="small" style={styles.bookTitle}>
          {item.name}
        </CustomText>
      </View>
    );
  };
  const renderVerticalItem = ({ item }: { item: RandomData }) => {
    return (
      <Pressable
        style={styles.books}
        onPress={() => router.push(`/home/${item.id}`)}
      >
        <Image source={item.image} style={styles.image} />
        <View style={styles.booksDesc}>
          <Text style={styles.title}>{item.name}</Text>

          <Text style={styles.bookAuther}>By {item.name}</Text>
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
          data={data}
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
          data={data}
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

  bookAuther: {
    fontFamily: "poppins-regular",
  },
});

export default Home;
