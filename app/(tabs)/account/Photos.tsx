import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import Container from "../../../components/container/Container";
import CustomText from "../../../components/Text/CustomText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen-font";
import Colors from "../../../constants/Colors";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import { router } from "expo-router";
import CustomFlatList from "../../../components/FlatList/CustomFlatList";
import { AuthContext } from "../../../context/AuthContext";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { ImageViewer } from "../../../components/ImageViewer/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FIRBASE_DB, FIRBASE_STORAGE } from "../../../firebaseConfig";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

interface PhotoItem {
  id: string;
  url: string;
}

interface PhotosProps {
  data: {
    photoUrl?: PhotoItem[];
  };
}

const Photos: React.FC<PhotosProps> = () => {
  const { data: userData, user, isLoading } = useContext(AuthContext);
  // const [selectedImage, setSelectedImage] = useState<string>("");

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
          console.log("Profile photo uploaded successfully.");
          router.push("/(tabs)/account");
        }
      } catch (error) {
        console.error("Error uploading profile photo:", error);
      }
      setLoading(false);
    }
  };

  const keyExtractor = (item: PhotoItem, index: number) => index.toString();

  const numColumns = 2;

  const renderVerticalItem = ({ item }: { item: PhotoItem }) => {
    const columnWidth = wp(100) / numColumns - 7;
    return (
      <TouchableOpacity>
        <View
          style={{
            width: columnWidth,
            justifyContent: "center",
          }}
        >
          <Image style={styles.image} source={{ uri: item.url }} />
        </View>
      </TouchableOpacity>
    );
  };
  const photoItems = userData?.photoUrl.map((url, index) => ({
    id: index.toString(),
    url: url,
  }));
  const reversedPhotoItems = photoItems ? [...photoItems].reverse() : [];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: Colors.newBackground }}
    >
      <Container style={styles.container}>
        <View style={styles.row}>
          <CustomText style={styles.text}>Profile pictures</CustomText>
          <CustomTouchableOpacity
            onPress={() => uploadUserProfile()}
            variant="secondary"
          >
            {loading ? (
              <ActivityIndicator style={{ padding: 5 }} />
            ) : (
              <CustomText style={styles.text}>Upload</CustomText>
            )}
          </CustomTouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImageAsync}>
            <ImageViewer selectedImage={selectedImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        {isLoading ? (
          <ActivityIndicator size={"large"} />
        ) : reversedPhotoItems.length !== 0 ? (
          <CustomFlatList
            style={{ marginBottom: 151 }}
            data={reversedPhotoItems}
            renderItem={renderVerticalItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            contentContainerStyle={styles.flatListContainer}
          />
        ) : (
          <CustomText style={{ textAlign: "center", color: Colors.background }}>
            You have not a photos yet
          </CustomText>
        )}
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
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
    height: hp("20%"),
    width: hp("20%"),
    borderRadius: 10,
    // objectFit: "",
  },
  text: {
    color: Colors.background,
  },
  separator: {
    height: 1.4,
    backgroundColor: Colors.background,
  },
  flatListContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,

    justifyContent: "flex-end",
    gap: 10,
  },
});

export default Photos;
