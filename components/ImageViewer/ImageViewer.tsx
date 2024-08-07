import { Image, StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen-font";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ImageViewerProps {
  selectedImage: string | null;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ selectedImage }) => {
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
