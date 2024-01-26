import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import { bookType } from "../../../types/types";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UploadBook = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState<bookType>();

  const [selectedFileName, setSelectedFileName] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<string | null>();

  const [blobPdfFile, setBlobPdfFile] = useState<File>();
  const [blobImgFile, setBlobImgFile] = useState<File>();

  const [loading, setLoading] = useState(false);

  const { control, setValue, handleSubmit } = useForm<bookType>();

  let bookId: string = "";

  const retrieveData = async () => {
    try {
      bookId = (await AsyncStorage?.getItem("@bookId")) || "";
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (bookId !== null) {
        await retrieveData();
        const clubRef = doc(FIRBASE_DB, `Books/${bookId}`);
        const unsubscribe = onSnapshot(clubRef, (docSnap: DocumentData) => {
          setBooks({ id: docSnap.id, ...docSnap.data() });
        });
        return () => unsubscribe();
      }
    };
    fetchData();
  }, [bookId]);

  useEffect(() => {
    if (books) {
      setValue("bookAuthor", books.bookAuthor || "");
      setValue("bookTitle", books.bookTitle || "");
      setValue("aboutBook", books.aboutBook || "");
    }
  }, [books, setValue]);

  const pickPdf = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (!result.canceled) {
      try {
        setSelectedFileName(result.assets[0].name);

        const response = await fetch(result.assets[0].uri);

        const blob = await response.blob();

        const fileName = result.assets[0]?.uri.split("/").pop();

        if (fileName) {
          const file = new File([blob], fileName, { type: blob.type });
          setBlobPdfFile(file);
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
          setBlobImgFile(file);
        }
      } catch (error) {
        console.error("Error creating File object:", error);
      }
    } else {
      alert("You did not select any image.");
    }
  };

  const upLoadBook = async (data: bookType) => {
    setLoading(true);
    try {
      const storageRefPdf = ref(
        FIRBASE_STORAGE,
        "Books/Pdf/" + blobPdfFile?.name
      );
      const storageRefImg = ref(
        FIRBASE_STORAGE,
        "Books/Img/" + blobImgFile?.name
      );

      if (blobPdfFile) await uploadBytes(storageRefPdf, blobPdfFile);
      if (blobImgFile) await uploadBytes(storageRefImg, blobImgFile);

      const pdfURL = await getDownloadURL(storageRefPdf);
      const photoURL = await getDownloadURL(storageRefImg);

      const RequestData = {
        createdAt: serverTimestamp(),
        ...data,
        creater: user?.uid,
        photoURL,
        pdfURL,
      };
      if (photoURL && pdfURL) {
        await addDoc(collection(FIRBASE_DB, "Books"), RequestData);
        console.log("books created successfully.");
        setLoading(false);
        router.push("/(tabs)/account/Books");
      }
    } catch (error) {
      console.log("Books not created ");
      console.error(error);
    }
  };

  const updateBook = async (data: bookType) => {
    setLoading(true);
    if (blobImgFile && blobPdfFile) {
      const storageRefPdf = ref(FIRBASE_STORAGE, "Books/" + blobPdfFile?.name);
      const storageRefImg = ref(FIRBASE_STORAGE, "Books/" + blobImgFile?.name);

      if (blobPdfFile) await uploadBytes(storageRefPdf, blobPdfFile);
      if (blobImgFile) await uploadBytes(storageRefImg, blobImgFile);

      const pdfURL = await getDownloadURL(storageRefPdf);
      const photoURL = await getDownloadURL(storageRefImg);
      await retrieveData();
      const bookDoc = doc(FIRBASE_DB, "Books", bookId);
      try {
        await updateDoc(bookDoc, {
          ...data,
          photoURL,
          pdfURL,
        });
        console.log("books successfully updated");
        setLoading(false);
        router.push("/(tabs)/account/Books");
      } catch (error) {
        console.log("books not updated");
        setLoading(false);
      }
    } else if (blobImgFile) {
      const storageRefImg = ref(FIRBASE_STORAGE, "Books/" + blobImgFile?.name);

      if (blobImgFile) await uploadBytes(storageRefImg, blobImgFile);

      const photoURL = await getDownloadURL(storageRefImg);
      await retrieveData();
      const bookDoc = doc(FIRBASE_DB, "Books", bookId);
      try {
        await updateDoc(bookDoc, {
          ...data,
          photoURL,
        });
        console.log("books successfully updated");
        setLoading(false);
        router.push("/(tabs)/account/Books");
      } catch (error) {
        console.log("books not updated");
        setLoading(false);
      }
    } else if (blobPdfFile) {
      const storageRefPdf = ref(FIRBASE_STORAGE, "Books/" + blobPdfFile?.name);

      if (blobPdfFile) await uploadBytes(storageRefPdf, blobPdfFile);

      const pdfURL = await getDownloadURL(storageRefPdf);

      await retrieveData();

      const bookDoc = doc(FIRBASE_DB, "Books", bookId);

      try {
        await updateDoc(bookDoc, {
          ...data,
          pdfURL,
        });
        console.log("books successfully updated");
        setLoading(false);
        router.push("/(tabs)/account/Books");
      } catch (error) {
        console.log("books not updated");
        setLoading(false);
      }
    } else {
      await retrieveData();
      const bookDoc = doc(FIRBASE_DB, "Books", bookId);
      try {
        await updateDoc(bookDoc, data);
        console.log("books successfully updated");
        setLoading(false);
        router.push("/(tabs)/account/Books");
      } catch (error) {
        console.log("books not updated");
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.wrapper}>
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
          <CustomText style={styles.text}>About</CustomText>
          <CustomTextInput
            placeholder="Write about the book"
            control={control}
            name="aboutBook"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Book pdf</CustomText>
          <View
            style={{
              flexDirection: "row",

              alignItems: "center",
            }}
          >
            <Text style={{ flex: 11 }}>
              {selectedFileName ? selectedFileName : books?.pdfURL}
            </Text>
            <CustomTouchableOpacity
              variant="secondary"
              onPress={() => pickPdf()}
              style={{ flex: 1 }}
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
            <ImageViewer
              selectedImage={selectedImage ?? books?.photoURL ?? ""}
            />
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

        {books?.bookTitle ? (
          <CustomTouchableOpacity onPress={handleSubmit(updateBook)}>
            {loading ? (
              <ActivityIndicator style={{ padding: 5 }} />
            ) : (
              <CustomText>update</CustomText>
            )}
          </CustomTouchableOpacity>
        ) : (
          <CustomTouchableOpacity onPress={handleSubmit(upLoadBook)}>
            {loading ? (
              <ActivityIndicator style={{ padding: 5 }} />
            ) : (
              <CustomText>Upload</CustomText>
            )}
          </CustomTouchableOpacity>
        )}
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
