import { View, Image, StyleSheet } from "react-native";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen-font";
import CustomText from "../Text/CustomText";
import Colors from "../../constants/Colors";

const ImageCard = () => {
  return (
    <View>
      <Image
        style={styles.image}
        source={require("../../assets/images/book1.jpg")}
      />
      <CustomText size="small" style={styles.text}>
        lorem
      </CustomText>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    height: hp("15%"),
    width: hp("13%"),
    borderRadius: 1,
  },
  text: {
    color: Colors.background,
  },
});

export default ImageCard;
