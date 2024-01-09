import { ReactNode } from "react";
import {
  GestureResponderEvent,
  StyleProp,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type Variant = "brand" | "secondary" | "danger";

export type Size = "small" | "medium" | "large";

export type CustomTouchableOpacityProps = TouchableOpacityProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: Variant;
  size?: Size;

  // onPress: (event: GestureResponderEvent) => void | undefined;
};
