import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../../../../context/AuthContext";
import { discussionTypes } from "../../../../types/types";
import { FIRBASE_DB, FIRBASE_STORAGE } from "../../../../firebaseConfig";
import Container from "../../../../components/container/Container";
import CustomText from "../../../../components/Text/CustomText";
import CustomTextInput from "../../../../components/TextInput/CustomTextInput";
import { ImageViewer } from "../../../../components/ImageViewer/ImageViewer";
import CustomTouchableOpacity from "../../../../components/TouchableOpacity/CustomTouchableOpacity";
import Colors from "../../../../constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScheduleDiscussion = () => {
  const { schedule: id } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const { control, setValue, handleSubmit } = useForm<discussionTypes>();
  const [discussion, setDiscussion] = useState<discussionTypes>();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

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
        const discussionRef = doc(
          FIRBASE_DB,
          `Clubs/${clubId}/discussions/${id}`
        );
        const unsubscribe = onSnapshot(
          discussionRef,
          (docSnap: DocumentData) => {
            setDiscussion({ id: docSnap.id, ...docSnap.data() });
          }
        );
        return () => unsubscribe();
      }
    };
    fetchData();
  }, [clubId]);

  useEffect(() => {
    if (discussion) {
      setValue("bookAuther", discussion.bookAuther || "");
      setValue("bookTitle", discussion.bookTitle || "");
      setValue("day", discussion.day || "");
      setValue("startTime", discussion.startTime || "");
    }
  }, [discussion, setValue]);

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
        } catch (error) {}
      }
    } else {
      alert("You did not select any image.");
    }
  };

  const scheduleDiscussion = async (data: discussionTypes) => {
    setLoading(true);
    try {
      const storageRef = ref(FIRBASE_STORAGE, `schedule/${id}/` + file?.name);
      if (file) await uploadBytes(storageRef, file);

      const photoURL = await getDownloadURL(storageRef);
      const RequestData = {
        creater: user?.uid,
        members: [],
        createdAt: serverTimestamp(),
        ...data,
        photoURL,
      };
      if (photoURL) {
        await addDoc(
          collection(FIRBASE_DB, `Clubs/${id}/discussions`),
          RequestData
        );
        setLoading(false);
        router.push(`/(tabs)/account/${id}`);
      }
    } catch (error) {}
  };

  const updateDiscussion = async (data: discussionTypes) => {
    setLoading(true);
    if (file) {
      const storageRef = ref(FIRBASE_STORAGE, `schedule/${id}/` + file?.name);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await retrieveData();

      try {
        const discussionDoc = doc(
          FIRBASE_DB,
          `Clubs/${clubId}/discussions/${id}`
        );
        await updateDoc(discussionDoc, {
          ...data,
          photoURL,
        });

        setLoading(false);
        router.push(`/(tabs)/account/${clubId}`);
      } catch (error) {
        setLoading(false);
      }
    } else {
      await retrieveData();
      const discussionDoc = doc(
        FIRBASE_DB,
        `Clubs/${clubId}/discussions/${id}`
      );

      try {
        await updateDoc(discussionDoc, data);

        setLoading(false);
        router.push(`/(tabs)/account/${clubId}`);
      } catch (error) {
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
            placeholder="Enter book title for discussion"
            control={control}
            name="bookTitle"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Book Auther</CustomText>
          <CustomTextInput
            placeholder="Enter Book Auther"
            control={control}
            name="bookAuther"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Day</CustomText>
          <CustomTextInput
            placeholder="Enter day of the discussion"
            control={control}
            name="day"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Time</CustomText>
          <CustomTextInput
            placeholder="Enter start time of the discussion"
            control={control}
            name="startTime"
          ></CustomTextInput>
        </View>
        <View>
          <CustomText style={styles.text}>Book pdf</CustomText>
          <TouchableOpacity onPress={pickImageAsync}>
            <ImageViewer
              selectedImage={selectedImage ?? discussion?.photoURL ?? ""}
            />
          </TouchableOpacity>
        </View>

        {discussion?.bookAuther ? (
          <CustomTouchableOpacity onPress={handleSubmit(updateDiscussion)}>
            {loading ? (
              <ActivityIndicator style={{ padding: 5 }} />
            ) : (
              <CustomText>Update</CustomText>
            )}
          </CustomTouchableOpacity>
        ) : (
          <CustomTouchableOpacity onPress={handleSubmit(scheduleDiscussion)}>
            {loading ? (
              <ActivityIndicator style={{ padding: 5 }} />
            ) : (
              <CustomText>Schedule</CustomText>
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
