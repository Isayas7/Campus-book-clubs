import React from "react";
import { FlatList } from "react-native";
import { CustomFlatListProps } from "./type";

const CustomFlatList: React.FC<CustomFlatListProps> = (props) => {
  const { data, renderItem, keyExtractor, style, ...rest } = props;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={style}
      {...rest}
    />
  );
};

export default CustomFlatList;
