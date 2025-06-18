import styled from "styled-components";

interface IProps {}

export const Container = styled.div<IProps>`
  min-width: 350px;
  width: 100%;
  margin: 8px 8px 12px;

  @media (max-width: 600px) {
    display: none;
  }
`;
