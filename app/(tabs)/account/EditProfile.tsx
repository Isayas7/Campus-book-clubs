import { View, StyleSheet, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import Container from "../../../components/container/Container";
import CustomText from "../../../components/Text/CustomText";
import { heightPercentageToDP as hp } from "react-native-responsive-screen-font";
import Colors from "../../../constants/Colors";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ImageViewer } from "../../../components/ImageViewer/ImageViewer";
import { AuthContext } from "../../../context/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FIRBASE_DB, FIRBASE_STORAGE } from "../../../firebaseConfig";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const EditProfile = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File>();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);

      if (user) {
        try {
          const response = await fetch(result.assets[0].uri);

          const blob = await response.blob();

          const fileName = result.assets[0]?.uri.split("/").pop();

          if (fileName) {
            const file = new File([blob], fileName, { type: blob.type });
            setFile(file);
          }
        } catch (error) {}
      }
    } else {
      alert("You did not select any image.");
    }
  };

  const uploadUserProfile = async () => {
    if (user && file) {
      setLoading(true);
      try {
        const storageRef = ref(FIRBASE_STORAGE, "profile_photos/" + file.name);
        await uploadBytes(storageRef, file);

        const photoUrl = await getDownloadURL(storageRef);
        if (photoUrl) {
          const userDoc = doc(FIRBASE_DB, "users", user?.uid);
          await updateDoc(userDoc, { photoUrl: arrayUnion(photoUrl) });

          router.push("/(tabs)/account");
        }
      } catch (error) {}
      setLoading(false);
    }
  };

  return (
    <View style={{ height: "100%", backgroundColor: Colors.newBackground }}>
      <Container style={styles.continer}>
        <View>
          <View style={styles.row}>
            <CustomText style={styles.text}>Profile picture</CustomText>
            <CustomTouchableOpacity
              variant="secondary"
              onPress={() => uploadUserProfile()}
            >
              {loading ? (
                <ActivityIndicator style={{ padding: 5 }} />
              ) : (
                <CustomText style={styles.text}>Upload</CustomText>
              )}
            </CustomTouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={pickImageAsync}
          >
            <ImageViewer selectedImage={selectedImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.spareter} />
        <View style={styles.row}>
          <CustomText style={styles.text}>Username</CustomText>
          <CustomTouchableOpacity
            variant="secondary"
            onPress={() => router.push("/(tabs)/account/ChangeUsername")}
          >
            <CustomText style={styles.text}>Change</CustomText>
          </CustomTouchableOpacity>
        </View>
        <View style={styles.spareter} />
        <View style={styles.row}>
          <CustomText style={styles.text}>Password</CustomText>
          <CustomTouchableOpacity
            onPress={() => router.push("/(tabs)/account/ChangePassword")}
            variant="secondary"
          >
            <CustomText style={styles.text}>Change</CustomText>
          </CustomTouchableOpacity>
        </View>
        <View style={styles.spareter} />
      </Container>
    </View>
  );
};
const styles = StyleSheet.create({
  continer: {
    gap: 30,
    marginTop: hp("1%"),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: hp("15%"),
    width: hp("15%"),
    borderRadius: 200,
  },
  text: {
    color: Colors.background,
  },
  spareter: {
    height: 1.4,
    backgroundColor: Colors.background,
  },
});

export default EditProfile;
