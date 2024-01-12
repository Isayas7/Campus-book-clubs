import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, ScrollView, StyleSheet } from "react-native";
import { View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import Colors from "../../../constants/Colors";
import Container from "../../../components/container/Container";
import CustomText from "../../../components/Text/CustomText";
import CustomTouchableOpacity from "../../../components/TouchableOpacity/CustomTouchableOpacity";
import {
  DocumentData,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FIRBASE_DB } from "../../../firebaseConfig";
import { bookType } from "../../../types/types";
import * as OpenAnything from "react-native-openanything";
import { AuthContext } from "../../../context/AuthContext";

const Id = () => {
  const { id } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<bookType>();

  useEffect(() => {
    const clubRef = doc(FIRBASE_DB, `Books/${id}`);
    const unsubscribe = onSnapshot(clubRef, (docSnap: DocumentData) => {
      setBook({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRecent = async () => {
    OpenAnything.Pdf(book?.pdfURL);
    if (user) {
      const docRef = doc(FIRBASE_DB, "users", user.uid);
      const userDoc = await getDoc(docRef);

      const recentArray = userDoc.data()?.recent || [];
      const index = recentArray.indexOf(book?.id);

      if (index !== -1) {
        const updatedRecentArray = [
          book?.id,
          ...recentArray.slice(0, index),
          ...recentArray.slice(index + 1),
        ];
        try {
          await updateDoc(docRef, { recent: updatedRecentArray });
          console.log("Recent array updated successfully");
          await increaseView();
        } catch (error) {
          console.log(error);
        }
      } else {
        const updatedRecentArray = [book?.id, ...recentArray];
        try {
          await updateDoc(docRef, { recent: updatedRecentArray });
          console.log("Recent array added successfully");
          await increaseView();
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const increaseView = async () => {
    const bookDocRef = doc(FIRBASE_DB, `Books/${book?.id}`);
    const bookDoc = await getDoc(bookDocRef);
    const currentViews = bookDoc.data()?.view || 0;
    try {
      await updateDoc(bookDocRef, { view: currentViews + 1 });
      console.log("view updated successfully");
    } catch (error) {
      console.log("view not updated successfully");
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          // style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <Container style={styles.container}>
          <View style={styles.wrapper}>
            <Image source={{ uri: book?.photoURL }} style={styles.image} />
            <CustomText size="large" variant="black">
              {book?.bookTitle}
            </CustomText>
            <CustomText variant="black" size="small">
              {book?.bookAuthor}
            </CustomText>
          </View>
          <CustomText variant="black" style={styles.descriptionTitle}>
            Descriptions
          </CustomText>

          <CustomText size="small" variant="black" style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
            alias quidem autem architecto rerum minus, praesentium at illo
            nesciunt non quibusdam mollitia neque nemo magni delectus inventore
            expedita doloremque aut?
          </CustomText>

          <CustomTouchableOpacity
            onPress={() => handleRecent()}
            size="large"
            style={styles.button}
          >
            <CustomText size="medium" style={{ color: Colors.background }}>
              Read this book
            </CustomText>
          </CustomTouchableOpacity>
        </Container>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp("90%"),
  },
  wrapper: {
    backgroundColor: Colors.cardBackground,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    width: "100%",
  },
  image: {
    height: hp("27%"),
    width: wp("45%"),
    borderRadius: 5,
  },
  descriptionTitle: {
    marginTop: 5,
    textAlign: "left",
    fontFamily: "poppins-semibold",
  },
  description: {
    marginTop: 5,
    textAlign: "left",
  },
  button: {
    backgroundColor: Colors.cardBackground,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Id;
