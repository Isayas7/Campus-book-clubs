import React from "react";
import styled from "styled-components/native";
import { ContainerProps } from "./types";

const StyledContainer = styled.View`
  margin-left: auto;
  margin-right: auto;
  width: 95%;
`;

const Container: React.FC<ContainerProps> = (props) => {
  return (
    <StyledContainer style={props.style}>{props.children}</StyledContainer>
  );
};

export default Container;
