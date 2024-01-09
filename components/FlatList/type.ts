import { FlatListProps, StyleProp, ViewStyle } from "react-native";
import { RandomData } from "../../types/types";

export type CustomFlatListProps = FlatListProps<RandomData> & {
  style?: StyleProp<ViewStyle>;
};
