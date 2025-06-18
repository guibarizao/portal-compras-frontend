import React, { HTMLAttributes } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  font-size: 1rem;
  padding: 0 16px;
  justify-content: center;
`;

interface ICustomNoContentTableBodyProps
  extends HTMLAttributes<HTMLDivElement> {}

const CustomNoContentTableBody: React.FC<ICustomNoContentTableBodyProps> = ({
  children,
}) => {
  return (
    <Container>
      <div>{children}</div>
    </Container>
  );
};

export { CustomNoContentTableBody };
