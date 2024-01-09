import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToFonts as wf,
  heightPercentageToFonts as hf,
} from "react-native-responsive-screen-font";
import { AuthContext } from "../../context/AuthContext";
import { Redirect } from "expo-router";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarActiveBackgroundColor: Colors.tintBackground,
        tabBarLabelStyle: {
          fontFamily: "poppins-medium",
          color: Colors.white,
        },
        tabBarStyle: {
          backgroundColor: Colors.background,
          height: hp("7%"),
        },

        headerTitleStyle: {
          fontWeight: "400",
          fontFamily: "poppins-regular",
        },
        headerStyle: {
          backgroundColor: Colors.background,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
        },
        headerTintColor: Colors.white,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-analytics"
              size={hp("4.5%")}
              color={Colors.white}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Clubs"
        options={{
          tabBarLabel: "Clubs",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              size={hp("4.5%")}
              color={Colors.white}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recent"
        options={{
          tabBarLabel: "Recent",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="history"
              size={hp("4.5%")}
              color={Colors.white}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: "Account",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={hp("4.5%")}
              color={Colors.white}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
