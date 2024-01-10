import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../../../../context/AuthContext";
import { clubProps } from "../../../../types/types";
import { FIRBASE_DB, FIRBASE_STORAGE } from "../../../../firebaseConfig";
import Container from "../../../../components/container/Container";
import CustomText from "../../../../components/Text/CustomText";
import CustomTextInput from "../../../../components/TextInput/CustomTextInput";
import { ImageViewer } from "../../../../components/ImageViewer/ImageViewer";
import CustomTouchableOpacity from "../../../../components/TouchableOpacity/CustomTouchableOpacity";
import Colors from "../../../../constants/Colors";
import { ScrollView } from "react-native-gesture-handler";

const ScheduleDiscussion = () => {
  const { sechedule: id } = useLocalSearchParams();
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
        discussions: [{}],
        createdAt: serverTimestamp(),
        ...data,
      };
      if (photoURL) {
        await addDoc(collection(FIRBASE_DB, "Clubs"), RequestData);
        console.log("clubs created successfully.");
        setLoading(false);
        router.push("/(tabs)/account/clubs");
      }
    } catch (error) {
      console.log("clubs not created ");
      console.error(error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.wrapper}>
      <Container style={styles.container}>
        <View>
          <CustomText style={styles.text}>Book title</CustomText>
          <CustomTextInput
            placeholder="Enter book title for discussion"
            control={control}
            name="clubName"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Book Auther</CustomText>
          <CustomTextInput
            placeholder="Enter Book Auther"
            control={control}
            name="about"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Day</CustomText>
          <CustomTextInput
            placeholder="Enter day of the discussion"
            control={control}
            name="about"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Time</CustomText>
          <CustomTextInput
            placeholder="Enter start time of the discussion"
            control={control}
            name="about"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Book pdf</CustomText>
          <TouchableOpacity onPress={pickImageAsync}>
            <ImageViewer selectedImage={selectedImage} />
          </TouchableOpacity>
        </View>

        <CustomTouchableOpacity onPress={handleSubmit(crateClubs)}>
          {loading ? (
            <ActivityIndicator style={{ padding: 5 }} />
          ) : (
            <CustomText>Schedule</CustomText>
          )}
        </CustomTouchableOpacity>
      </Container>
    </ScrollView>
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
    marginTop: hp("3%"),
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
export default ScheduleDiscussion;
