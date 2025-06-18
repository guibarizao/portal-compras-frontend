import React from "react";
import styled from "styled-components";
import { Grid, GridProps } from "@mui/material";

export const Container = styled(Grid)`
  && {
    display: flex;
    padding: 0px 8px;
    margin-bottom: 20px;
  }
`;

interface IGridFilterAreaProps extends GridProps {}

const GridFilterArea: React.FC<IGridFilterAreaProps> = ({
  children,
  ...rest
}) => {
  return <Container {...rest}>{children}</Container>;
};

export { GridFilterArea };
