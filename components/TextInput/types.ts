import { ComponentProps, ReactNode } from "react";
import { StyleProp, ViewStyle, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type CustomTextInputProps = TextInputProps & {
  icon?: ComponentProps<typeof Ionicons>["name"];
  control: any;
  name: string;
  rules?: object;
  value?: any;
};
