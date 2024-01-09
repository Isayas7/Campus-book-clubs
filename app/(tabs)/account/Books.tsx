import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
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
import { RandomData } from "../../../types/types";

const Books = () => {
  const keyExtractor = (item: RandomData, index: number) => item.id.toString();
  const numColumns = 3;

  const renderVerticalItem = ({ item }: { item: RandomData }) => {
    const columnWidth = wp(100) / numColumns - 10;
    return (
      <Pressable onPress={() => router.push(`/home/${item.id}`)}>
        <View
          style={{
            width: columnWidth,
            marginHorizontal: 5,
            justifyContent: "center",
          }}
        >
          <Image
            style={styles.image}
            source={require("../../../assets/images/book1.jpg")}
          />
          <CustomText size="small" style={styles.text}>
            lorem
          </CustomText>
        </View>
      </Pressable>
    );
  };
  return (
    <View style={styles.wrapper}>
      <Container style={styles.continer}>
        <View style={styles.row}>
          <CustomText style={styles.text}>Upload Book</CustomText>
          <CustomTouchableOpacity
            variant="secondary"
            onPress={() => router.push("/(tabs)/account/UploadBook")}
          >
            <Ionicons name="add-outline" size={24} color={Colors.background} />
          </CustomTouchableOpacity>
        </View>

        <View style={styles.spareter} />

        <CustomFlatList
          style={{ marginBottom: 74 }}
          data={data}
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
    height: hp("15%"),
    width: hp("13%"),
    borderRadius: 1,
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

export default Books;
