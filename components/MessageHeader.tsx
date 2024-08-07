import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToFonts as wf } from "react-native-responsive-screen-font";
import CustomText from "./Text/CustomText";
import Colors from "../constants/Colors";
import { router } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Container from "./container/Container";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { FIRBASE_DB } from "../firebaseConfig";
import CustomTouchableOpacity from "./TouchableOpacity/CustomTouchableOpacity";

type ClubDataInfo = {
  clubsId?: string;
  id?: string;
  name?: string;
  members?: string[];
  from?: string;
};

const MessageHeader: React.FC<ClubDataInfo> = (props) => {
  const { user } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  //// Jions clubs
  const joinClubs = async () => {
    setLoading(true);
    try {
      const clubsRef = doc(FIRBASE_DB, `Clubs/${props.clubsId}`);
      const bookDoc = await getDoc(clubsRef);
      const currentmember = bookDoc.data()?.member || 0;

      await updateDoc(clubsRef, {
        members: arrayUnion(user?.uid),
        member: currentmember + 1,
      });
    } catch (error) {}
    setLoading(false);
  };

  const leaveGroup = async () => {
    setLoading(true);
    try {
      const clubsRef = doc(FIRBASE_DB, `Clubs/${props.clubsId}`);
      const bookDoc = await getDoc(clubsRef);
      const currentmember = bookDoc.data()?.member || 0;

      await updateDoc(clubsRef, {
        members: arrayRemove(user?.uid),
        member: currentmember - 1,
      });
    } catch (error) {}
    setLoading(false);
  };

  const deleteGroup = async () => {
    const clubDoc = doc(FIRBASE_DB, `Clubs/${props.clubsId}`);
    try {
      await deleteDoc(clubDoc);

      router.push("/(tabs)/Clubs");
    } catch (error) {}
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Container>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.headerContainer}>
              <TouchableOpacity>
                <Ionicons
                  name="arrow-back"
                  size={26}
                  color="white"
                  onPress={() => router.back()}
                />
              </TouchableOpacity>
              <Image
                style={styles.image}
                source={require("../assets/images/book1.jpg")}
              />
              <View style={{ alignItems: "flex-start" }}>
                <CustomText>{props.name}</CustomText>
                <CustomText size="small">
                  {props.members?.length} members
                </CustomText>
              </View>
            </View>

            {props.from === "message" && (
              <TouchableOpacity>
                <Entypo
                  name="dots-three-vertical"
                  size={26}
                  color="white"
                  onPress={() => setVisible(true)}
                />
              </TouchableOpacity>
            )}

            <Modal transparent visible={visible}>
              <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
                <View style={{ flex: 1 }}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setVisible(!visible);
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 63,
                        right: 10,
                        backgroundColor: Colors.background,
                        borderRadius: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 8,
                      }}
                    >
                      <CustomTouchableOpacity
                        size="small"
                        onPress={() =>
                          router.push(`/DiscussionList/${props.clubsId}`)
                        }
                        style={styles.lists}
                      >
                        <Feather
                          name="message-circle"
                          size={24}
                          color="white"
                        />
                        <Text style={styles.text}>Discussions</Text>
                      </CustomTouchableOpacity>

                      {props.id === user?.uid && (
                        <CustomTouchableOpacity
                          size="small"
                          // onPress={() => router.push(`/(tabs)/account/${id}`)}
                          style={styles.lists}
                        >
                          <AntDesign name="adduser" size={24} color="white" />
                          <Text style={styles.text}>Add members</Text>
                        </CustomTouchableOpacity>
                      )}

                      {props.id === user?.uid ? (
                        <CustomTouchableOpacity
                          size="small"
                          onPress={() => deleteGroup()}
                          style={styles.lists}
                        >
                          <AntDesign name="delete" size={24} color="red" />
                          <Text style={[styles.text, styles.delete]}>
                            Delete group
                          </Text>
                        </CustomTouchableOpacity>
                      ) : (
                        <>
                          {user &&
                          props.members !== null &&
                          props.members?.includes(user?.uid) ? (
                            <CustomTouchableOpacity
                              size="small"
                              onPress={() => leaveGroup()}
                              style={styles.lists}
                            >
                              <AntDesign name="delete" size={20} color="red" />
                              {loading ? (
                                <ActivityIndicator />
                              ) : (
                                <Text style={[styles.text]}>Leave group</Text>
                              )}
                            </CustomTouchableOpacity>
                          ) : (
                            <CustomTouchableOpacity
                              onPress={() => joinClubs()}
                              size="small"
                              style={styles.lists}
                            >
                              <MaterialIcons
                                name="group-add"
                                size={24}
                                color="white"
                              />
                              {loading ? (
                                <ActivityIndicator />
                              ) : (
                                <Text style={[styles.text]}>Join group</Text>
                              )}
                            </CustomTouchableOpacity>
                          )}
                        </>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </Container>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 55,
    width: 55,
    borderRadius: 200,
  },
  wrapper: {
    backgroundColor: Colors.background,
    height: 57,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  text: {
    fontFamily: "poppins-medium",
    color: Colors.white,
    fontSize: wf("4.5%"),
  },
  delete: {
    color: "red",
  },
  lists: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
});

export default MessageHeader;
