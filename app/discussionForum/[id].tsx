import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import MessageHeader from "../../components/MessageHeader";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { FIRBASE_DB } from "../../firebaseConfig";
import { ClubType } from "../../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen-font";
import Colors from "../../constants/Colors";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { AuthContext } from "../../context/AuthContext";
import { StyleSheet } from "react-native";

const DiscussionForum = () => {
  const { user } = useContext(AuthContext);

  const { id } = useLocalSearchParams();
  const [clubs, setClubs] = useState<ClubType>();
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [message, setMessage] = useState<string>("");

  let storedData: string = "";
  const flatListRef = useRef<FlatList | null>(null);

  const retrieveData = async () => {
    try {
      storedData = (await AsyncStorage?.getItem("@ClubId")) || "";
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      await retrieveData();
      setMessageLoading(true);
      const q = query(
        collection(
          FIRBASE_DB,
          `Clubs/${storedData}/discussions/${id}/conversations`
        ),
        orderBy("createdAt")
      );
      const unsubscribe = onSnapshot(q, (docSnap: DocumentData) => {
        const data = docSnap.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
        setMessageLoading(false);
      });

      return () => {
        unsubscribe();
      };
    };

    fetchData();
  }, [id, storedData]);

  const sendMessage = async () => {
    await retrieveData();
    setMessage("");
    const docRef = collection(
      FIRBASE_DB,
      `Clubs/${storedData}/discussions/${id}/conversations`
    );
    try {
      const docSnap = await addDoc(docRef, {
        message,
        sender: user?.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {}
    // if (ref.current) {
    //   ref.current.scrollToEnd({ animated: true });
    // }
  };

  useEffect(() => {
    const fetchData = async () => {
      await retrieveData();
      const clubRef = doc(FIRBASE_DB, `Clubs/${storedData}`);
      const unsubscribe = onSnapshot(clubRef, (docSnap: DocumentData) => {
        setClubs({ id: docSnap.id, ...docSnap.data() });
      });
      return () => unsubscribe();
    };

    fetchData();
  }, []);

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
      style={{ flex: 1, backgroundColor: Colors.newBackground }}
    >
      <Stack.Screen
        options={{
          header: () => (
            <MessageHeader name={clubs?.clubName} members={clubs?.members} />
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

export default DiscussionForum;
