import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components/native";
import Colors from "../../constants/Colors";
import { CustomTextInputProps } from "./types";
import { Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { heightPercentageToDP as hp } from "react-native-responsive-screen-font";

const InputWrapper = styled.View`
  width: "100%";
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-width: 1px;
  border-color: #ccc;
  margin-top: 8px;
  height: ${hp("7%")}px;
  padding: 2px;
  border-radius: 10px;
`;
const StyledTextInput = styled.TextInput`
  flex: 1;
`;

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  icon,
  control,
  name,
  rules = {},
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <InputWrapper style={props.style}>
          <Ionicons name={icon} size={hp("3.5%")} color={Colors.background} />
          <StyledTextInput
            {...props}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
          />
          {error && (
            <Text style={{ color: "red", marginRight: 12 }}>
              {error.message || "Something went wrong"}
            </Text>
          )}
        </InputWrapper>
      )}
    />
  );
};

export default CustomTextInput;
