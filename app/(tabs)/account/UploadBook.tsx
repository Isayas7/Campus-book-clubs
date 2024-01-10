import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import { ImageViewer } from "../../../components/ImageViewer/ImageViewer";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FIRBASE_DB, FIRBASE_STORAGE } from "../../../firebaseConfig";
import { uploadbookType } from "../../../types/types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";

const UploadBook = () => {
  const { user } = useContext(AuthContext);
  const [fileName, setFileName] = useState<string>();
  const [blobFile, setBlobFile] = useState<File>();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<uploadbookType>();

  const pickPdf = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (!result.canceled) {
      // const r = await fetch(result?.assets[0].uri);
      // const b = await r.blob();
      // setFileName(result.assets[0].name);
      // setBlobFile(b);
      //setIsChoosed(true)
      try {
        setFileName(result.assets[0].name);

        const response = await fetch(result.assets[0].uri);

        const blob = await response.blob();

        const fileName = result.assets[0]?.uri.split("/").pop();

        if (fileName) {
          const file = new File([blob], fileName, { type: blob.type });
          setBlobFile(file);
        }
      } catch (error) {
        console.error("Error creating File object:", error);
      }
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
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
    } else {
      alert("You did not select any image.");
    }
  };

  const upLoadBook = async (data: uploadbookType) => {
    setLoading(true);
    try {
      const storageRefPdf = ref(FIRBASE_STORAGE, "Books/Pdf/" + blobFile?.name);
      const storageRefImg = ref(FIRBASE_STORAGE, "Books/Img/" + file?.name);

      if (blobFile) await uploadBytes(storageRefPdf, blobFile);
      if (file) await uploadBytes(storageRefImg, file);

      const pdfURL = await getDownloadURL(storageRefPdf);
      const photoURL = await getDownloadURL(storageRefImg);

      const RequestData = {
        creater: user?.uid,
        photoURL,
        pdfURL,
        createdAt: serverTimestamp(),
        ...data,
      };
      if (photoURL && pdfURL) {
        await addDoc(collection(FIRBASE_DB, "Books"), RequestData);
        console.log("books created successfully.");
        setLoading(false);
        router.push("/(tabs)/account/Books");
      }
    } catch (error) {
      console.log("clubs not created ");
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.wrapper}>
      <Container style={styles.container}>
        <View>
          <CustomText style={styles.text}>Book title</CustomText>
          <CustomTextInput
            placeholder="Enter Book title"
            control={control}
            name="bookTitle"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Author</CustomText>
          <CustomTextInput
            placeholder="Enter Author of the book"
            control={control}
            name="bookAuthor"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Book pdf</CustomText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>{fileName}</Text>
            <CustomTouchableOpacity
              variant="secondary"
              onPress={() => pickPdf()}
            >
              <Ionicons
                name="add-outline"
                size={24}
                color={Colors.background}
              />
            </CustomTouchableOpacity>
          </View>
        </View>
        <View>
          <CustomText style={styles.text}>Book Image</CustomText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ImageViewer selectedImage={selectedImage} />
            <CustomTouchableOpacity
              variant="secondary"
              onPress={() => pickImageAsync()}
            >
              <Ionicons
                name="add-outline"
                size={24}
                color={Colors.background}
              />
            </CustomTouchableOpacity>
          </View>
        </View>

        <CustomTouchableOpacity onPress={handleSubmit(upLoadBook)}>
          {loading ? (
            <ActivityIndicator style={{ padding: 5 }} />
          ) : (
            <CustomText>Upload</CustomText>
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
    marginVertical: hp("3%"),
  },
  image: {
    height: hp("13%"),
    width: hp("11%"),
    borderRadius: 3,
  },
  text: {
    textAlign: "left",
    color: Colors.background,
  },
});
export default UploadBook;
