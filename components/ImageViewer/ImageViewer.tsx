import { Image, StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import Colors from "../../constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

interface ImageViewerProps {
  selectedImage: string | null;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ selectedImage }) => {
  let imageSource = selectedImage
    ? { uri: selectedImage }
    : require("../../assets/images/book1.jpg");

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: hp("15%"),
        width: hp("15%"),
        backgroundColor: Colors.tintBackground,
        borderRadius: 200,
      }}
    >
      {selectedImage ? (
        <Image style={styles.image} source={{ uri: selectedImage }} />
      ) : (
        <MaterialCommunityIcons
          name="camera-plus"
          size={wp("11%")}
          color="white"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: hp("15%"),
    width: hp("15%"),
    borderRadius: 200,
  },
});
