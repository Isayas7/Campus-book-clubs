import React from "react";
import styled, { css } from "styled-components/native";
import { CustomTouchableOpacityProps, Size, Variant } from "./types";
import Colors from "../../constants/Colors";

const sizes = {
  small: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  medium: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  large: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
};

const variations = {
  brand: {
    backgroundColor: Colors.color_brand,
  },
  secondary: {
    backgroundColor: Colors.color_secondary,
    borderColor: Colors.color_grey_200,
  },
  danger: {
    backgroundColor: Colors.color_red_700,
  },
};

const StyledButton = styled.TouchableOpacity<{
  variant: Variant;
  size: Size;
}>`
  border: none;
  border-radius: ${Colors.border_radius_lg};
  box-shadow: ${Colors.shadow_sm};
  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variant]}
`;

const CustomTouchableOpacity: React.FC<CustomTouchableOpacityProps> = (
  props
) => {
  return (
    <StyledButton
      size={props.size || "medium"}
      variant={props.variant || "brand"}
      {...props}
      style={props.style}
    >
      {props.children}
    </StyledButton>
  );
};

export default CustomTouchableOpacity;
