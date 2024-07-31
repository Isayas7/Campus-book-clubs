import React from "react";
import Colors from "../../constants/Colors";
import { widthPercentageToFonts as wf } from "react-native-responsive-screen-font";
import { CustomTextProps, Size, Variant } from "./types";
import styled from "styled-components/native";

const sizes = {
  small: {
    fontSize: wf("4.5%"),
    fontFamily: "poppins-regular",
  },

  medium: {
    fontSize: wf("5.5%"),
    fontFamily: "poppins-medium",
  },

  large: {
    fontSize: wf("6%"),
    fontFamily: "poppins-bold",
  },
};

const variations = {
  brand: {
    color: Colors.color_brand,
  },
  white: {
    color: Colors.color_white,
  },
  black: {
    color: Colors.color_black,
  },
};

const StyledText = styled.Text<{
  variant: Variant;
  size: Size;
}>`
  text-align: center;
  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variant]}
`;

const CustomText: React.FC<CustomTextProps> = (props) => {
  return (
    <StyledText
      style={props.style}
      size={props.size || "medium"}
      variant={props.variant || "white"}
    >
      {props.children}
    </StyledText>
  );
};

export default CustomText;
