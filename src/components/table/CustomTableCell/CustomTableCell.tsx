import { TableCell, TableCellProps } from "@mui/material";
import React from "react";
import styled, { css } from "styled-components";

interface IContainerPropos {
  width?: number;
}
export const Container = styled(TableCell)<IContainerPropos>`
  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ${(props) =>
      props.width && props.width > 0
        ? css`
            width: ${props.width}px;
          `
        : css`
            width: 50px;
          `}
  }
`;

interface ICustomTableCellProps extends TableCellProps {
  width?: number;
}

const CustomTableCell: React.FC<ICustomTableCellProps> = ({
  width = 30,
  children,
  ...rest
}) => {
  return (
    <Container width={width} {...rest}>
      <div>{children}</div>
    </Container>
  );
};

export { CustomTableCell };
