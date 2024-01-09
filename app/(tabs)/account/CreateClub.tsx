import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import Container from "../../../components/container/Container";
import CustomTextInput from "../../../components/TextInput/CustomTextInput";
import { useForm } from "react-hook-form";
import Colors from "../../../constants/Colors";
import CustomText from "../../../components/Text/CustomText";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import { router } from "expo-router";
import { AuthContext } from "../../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { clubProps } from "../../../types/types";
import { ImageViewer } from "../../../components/ImageViewer/ImageViewer";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FIRBASE_DB, FIRBASE_STORAGE } from "../../../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const CreateClub = () => {
  const { user } = useContext(AuthContext);
  const { control, handleSubmit } = useForm<clubProps>();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File>();
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
        setSelectedImage(result.assets[0].uri);
        try {
          const response = await fetch(result.assets[0].uri);

          const blob = await response.blob();

          const fileName = result.assets[0]?.uri.split("/").pop();

          if (fileName) {
            const file = new File([blob], fileName, { type: blob.type });
            setFile(file);
          }
        } catch (error) {
          console.error("Error creating File object:", error);
        }
      }
    } else {
      alert("You did not select any image.");
    }
  };

  const crateClubs = async (data: clubProps) => {
    setLoading(true);
    try {
      const storageRef = ref(FIRBASE_STORAGE, "Clubs/" + file?.name);
      if (file) await uploadBytes(storageRef, file);

      const photoURL = await getDownloadURL(storageRef);
      const RequestData = {
        creater: user?.uid,
        photoURL,
        members: [],
        createdAt: serverTimestamp(),
        ...data,
      };
      if (photoURL) {
        await addDoc(collection(FIRBASE_DB, "Clubs"), RequestData);
        console.log("clubs created successfully.");
        setLoading(false);
        router.push("/(tabs)/Clubs");
      }
    } catch (error) {
      console.log("clubs not created ");
      console.error(error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Container style={styles.container}>
        <View>
          <CustomText style={styles.text}>Club name</CustomText>
          <CustomTextInput
            placeholder="Enter club name"
            control={control}
            name="clubName"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>About</CustomText>
          <CustomTextInput
            placeholder="Write about your club"
            control={control}
            name="about"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Picture</CustomText>
          <TouchableOpacity onPress={pickImageAsync}>
            <ImageViewer selectedImage={selectedImage} />
          </TouchableOpacity>
        </View>

        <CustomTouchableOpacity onPress={handleSubmit(crateClubs)}>
          {loading ? (
            <ActivityIndicator style={{ padding: 5 }} />
          ) : (
            <CustomText>Create</CustomText>
          )}
        </CustomTouchableOpacity>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    backgroundColor: Colors.newBackground,
  },
  container: {
    flex: 1,
    gap: 20,
    marginTop: hp("5%"),
  },
  image: {
    height: hp("13%"),
    width: hp("13%"),
    borderRadius: 200,
  },
  text: {
    textAlign: "left",
    color: Colors.background,
  },
});
export default CreateClub;
