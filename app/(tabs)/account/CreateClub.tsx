import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Container from "../../../components/container/Container";
import CustomTextInput from "../../../components/TextInput/CustomTextInput";
import { useForm } from "react-hook-form";
import Colors from "../../../constants/Colors";
import CustomText from "../../../components/Text/CustomText";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import { heightPercentageToDP as hp } from "react-native-responsive-screen-font";
import { router } from "expo-router";
import { AuthContext } from "../../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { ClubType } from "../../../types/types";
import { ImageViewer } from "../../../components/ImageViewer/ImageViewer";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FIRBASE_DB, FIRBASE_STORAGE } from "../../../firebaseConfig";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateClub = () => {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState<ClubType>();
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setValue } = useForm<ClubType>();

  let clubId: string = "";

  const retrieveData = async () => {
    try {
      clubId = (await AsyncStorage?.getItem("@ClubId")) || "";
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      if (clubId !== null) {
        await retrieveData();
        const clubRef = doc(FIRBASE_DB, `Clubs/${clubId}`);
        const unsubscribe = onSnapshot(clubRef, (docSnap: DocumentData) => {
          setClubs({ id: docSnap.id, ...docSnap.data() });
        });
        return () => unsubscribe();
      }
    };
    fetchData();
  }, [clubId]);

  useEffect(() => {
    if (clubs) {
      setValue("clubName", clubs.clubName || "");
      setValue("about", clubs.about || "");
    }
  }, [clubs, setValue]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
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
        } catch (error) {}
      }
    } else {
      alert("You did not select any image.");
    }
  };

  const crateClubs = async (data: ClubType) => {
    setLoading(true);
    try {
      const storageRef = ref(FIRBASE_STORAGE, "Clubs/" + file?.name);
      if (file) await uploadBytes(storageRef, file);

      const photoURL = await getDownloadURL(storageRef);
      const RequestData = {
        ...data,
        creater: user?.uid,
        photoURL,
        members: [],
        createdAt: serverTimestamp(),
      };
      if (photoURL) {
        await addDoc(collection(FIRBASE_DB, "Clubs"), RequestData);

        setLoading(false);
        router.push("/(tabs)/account/clubs");
      }
    } catch (error) {
      setError("try again");
    }
  };

  const updateGroup = async (data: ClubType) => {
    setLoading(true);
    if (file) {
      const storageRef = ref(FIRBASE_STORAGE, "Clubs/" + file?.name);
      if (file) await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await retrieveData();

      const clubDoc = doc(FIRBASE_DB, "Clubs", clubId);
      try {
        await updateDoc(clubDoc, {
          photoURL,
          about: data.about,
          clubName: data.clubName,
        });

        setLoading(false);
        router.push("/(tabs)/account/clubs");
      } catch (error) {
        setLoading(false);
      }
    } else {
      await retrieveData();
      const clubDoc = doc(FIRBASE_DB, "Clubs", clubId);
      try {
        await updateDoc(clubDoc, {
          about: data.about,
          clubName: data.clubName,
        });

        setLoading(false);
        router.push("/(tabs)/account/clubs");
      } catch (error) {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.wrapper}>
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
            <ImageViewer
              selectedImage={selectedImage ? selectedImage : clubs?.photoURL}
            />
          </TouchableOpacity>
        </View>

        {clubs?.clubName ? (
          <CustomTouchableOpacity onPress={handleSubmit(updateGroup)}>
            {loading ? (
              <ActivityIndicator style={{ padding: 5 }} />
            ) : (
              <CustomText>update</CustomText>
            )}
          </CustomTouchableOpacity>
        ) : (
          <CustomTouchableOpacity onPress={handleSubmit(crateClubs)}>
            {loading ? (
              <ActivityIndicator style={{ padding: 5 }} />
            ) : (
              <CustomText>Create</CustomText>
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
