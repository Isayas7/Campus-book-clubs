import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { AuthContext } from "../../context/AuthContext";
import {
  DocumentData,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { FIRBASE_DB } from "../../firebaseConfig";
import Colors from "../../constants/Colors";
import MessageHeader from "../../components/MessageHeader";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import CustomText from "../../components/Text/CustomText";
import { ClubType } from "../../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Message = () => {
  const { user } = useContext(AuthContext);
  const { id } = useLocalSearchParams<{ id: string }>();

  const [clubs, setClubs] = useState<ClubType>();
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState<boolean>(true);

  const flatListRef = useRef<FlatList | null>(null);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem("@ClubId", `${id}`);
      console.log("Data stored successfully!");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  /// Fetch new messages
  useEffect(() => {
    setMessageLoading(true);
    const q = query(
      collection(FIRBASE_DB, `Clubs/${id}/conversations`),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (docSnap: DocumentData) => {
      const data = docSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      storeData();
      setMessages(data);
    });

    const delayTimer = setTimeout(() => {
      setMessageLoading(false);
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 200);

    return () => {
      clearTimeout(delayTimer);
      unsubscribe();
    };
  }, [id]);

  const lastMessage = async (lastMessage: any) => {
    const docRef = doc(FIRBASE_DB, "Clubs", id);

    try {
      await updateDoc(docRef, {
        lastMessage,
      });
      console.log("last message updating successfully");
    } catch (error) {
      console.error("Error updating user :", error);
    }
  };

  /// Send Messages
  const sendMessage = async () => {
    setMessage("");
    const msg = message.trim();
    if (msg.length === 0) return;
    const docRef = collection(FIRBASE_DB, `Clubs/${id}/conversations`);
    try {
      const docSnap = await addDoc(docRef, {
        message,
        sender: user?.uid,
        createdAt: serverTimestamp(),
      });
      lastMessage(message);

      console.log("message sent successfully.");
    } catch (error) {
      console.log(error);
    }
    // if (ref.current) {
    //   ref.current.scrollToEnd({ animated: true });
    // }
  };

  /// Fetch Clubs Data
  useEffect(() => {
    const clubRef = doc(FIRBASE_DB, `Clubs/${id}`);
    const unsubscribe = onSnapshot(clubRef, (docSnap: DocumentData) => {
      setClubs({ id: docSnap.id, ...docSnap.data() });
    });
    return () => unsubscribe();
  }, []);

  //// Jions clubs
  const joinClubs = async () => {
    setLoading(true);
    try {
      const clubsRef = doc(FIRBASE_DB, `Clubs/${id}`);
      const bookDoc = await getDoc(clubsRef);
      const currentmember = bookDoc.data()?.member || 0;

      await updateDoc(clubsRef, {
        members: arrayUnion(user?.uid),
        member: currentmember + 1,
      });

      console.log("Joined  successfully.");
    } catch (error) {
      console.error("Error uploading profile photo:", error);
    }
    setLoading(false);
  };

  const renderMessage = ({ item }: { item: DocumentData }) => {
    const myMessage = item.sender === user?.uid;
    return (
      <View
        style={[
          styles.messageContainer,
          myMessage
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      style={{ flex: 1, backgroundColor: Colors.newBackground, marginTop: 57 }}
    >
      <Stack.Screen
        options={{
          header: () => (
            <MessageHeader
              name={clubs?.clubName}
              members={clubs?.members}
              from="message"
              id={clubs?.creater}
              clubsId={clubs?.id}
            />
          ),
        }}
      />

      <View style={styles.container}>
        {messageLoading ? (
          <ActivityIndicator
            size={"large"}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            onContentSizeChange={() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
              }
            }}
          />
        )}

        {(clubs && clubs?.creater === user?.uid) ||
        (user &&
          clubs?.members !== null &&
          clubs?.members?.includes(user?.uid)) ? (
          <View style={styles.inputContainer}>
            <Entypo
              name="emoji-happy"
              size={hp("4.5%")}
              color={Colors.background}
            />
            <TextInput
              value={message}
              style={styles.messageInput}
              placeholder="Type a message"
              multiline
              onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity>
              {message !== "" ? (
                <FontAwesome
                  disabled={message === ""}
                  onPress={sendMessage}
                  name="send"
                  size={hp("4.5%")}
                  color={Colors.background}
                />
              ) : (
                <Entypo
                  name="attachment"
                  size={hp("4.5%")}
                  color={Colors.background}
                />
              )}
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <TouchableOpacity
            style={styles.joinContainer}
            onPress={() => joinClubs()}
          >
            <CustomText style={{ color: Colors.background }}>join</CustomText>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    height: hp("9%"),
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  messageInput: {
    flex: 1,

    borderRadius: 10,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessageContainer: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    backgroundColor: "#ddd",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  joinContainer: {
    backgroundColor: "#fff",
    height: hp("9%"),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default Message;
