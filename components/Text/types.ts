import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";

export type Size = "small" | "medium" | "large";
export type Variant = "brand" | "white" | "black";

export type CustomTextProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: Variant;
  size?: Size;
};
