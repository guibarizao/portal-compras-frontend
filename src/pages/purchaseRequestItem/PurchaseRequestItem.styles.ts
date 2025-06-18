import styled from "styled-components";

export const Span = styled.span`
  color: #3fa110;
  font-size: 15px;
  margin-left: 8px;
  width: 100%;
  @media screen and (max-width: 600px) {
    margin-bottom: 34px;
  }
`;

export const InfoProduct = styled.div`
  display: flex;
  width: 100%;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
