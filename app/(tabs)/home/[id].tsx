import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet } from "react-native";
import { View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import Colors from "../../../constants/Colors";
import Container from "../../../components/container/Container";
import CustomText from "../../../components/Text/CustomText";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";

const Id = () => {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Container style={styles.container}>
        <View style={styles.wrapper}>
          <Image
            source={require("../../../assets/images/book1.jpg")}
            style={styles.image}
          />
          <CustomText size="large" variant="black">
            Bianca Hobbs
          </CustomText>
          <CustomText variant="black" size="small">
            Bianca Hobbs
          </CustomText>
        </View>
        <CustomText variant="black" style={styles.descriptionTitle}>
          Descriptions
        </CustomText>

        <CustomText size="small" variant="black" style={styles.description}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          alias quidem autem architecto rerum minus, praesentium at illo
          nesciunt non quibusdam mollitia neque nemo magni delectus inventore
          expedita doloremque aut?
        </CustomText>

        <CustomTouchableOpacity size="large" style={styles.button}>
          <CustomText size="medium" style={{ color: Colors.background }}>
            Read this book
          </CustomText>
        </CustomTouchableOpacity>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp("90%"),
  },
  wrapper: {
    backgroundColor: Colors.cardBackground,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    width: "100%",
  },
  image: {
    height: hp("27%"),
    width: wp("45%"),
    borderRadius: 5,
  },
  descriptionTitle: {
    marginTop: 5,
    textAlign: "left",
    fontFamily: "poppins-semibold",
  },
  description: {
    marginTop: 5,
    textAlign: "left",
  },
  button: {
    backgroundColor: Colors.cardBackground,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Id;
