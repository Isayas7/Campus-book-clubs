import React from "react";
import styled from "styled-components/native";
import { CardProps } from "./types";
import Colors from "../../constants/Colors";

const StyledCard = styled.View`
  border-radius: 12px;
  background-color: ${Colors.cardColor};
  padding: 15px;
`;

const Card: React.FC<CardProps> = (props) => {
  return <StyledCard style={props.style}>{props.children}</StyledCard>;
};

export default Card;
