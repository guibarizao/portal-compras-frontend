import React, { HTMLAttributes } from "react";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

interface IFilterButtonGroupProps extends HTMLAttributes<HTMLDivElement> {}

const FilterButtonGroup: React.FC<IFilterButtonGroupProps> = ({
  children,
  ...rest
}) => {
  return <Container {...rest}>{children}</Container>;
};

export { FilterButtonGroup };
