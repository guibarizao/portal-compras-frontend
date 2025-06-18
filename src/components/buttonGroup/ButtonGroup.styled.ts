import styled, { css } from "styled-components";

interface IButtonGroupProps {
  justformobilie?: boolean;
}

export const Container = styled.div<IButtonGroupProps>`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;

  svg {
    color: #092758;
  }

  font-weight: 600;

  ${(props) =>
    props.justformobilie &&
    css`
      @media (max-width: 600px) {
        flex-direction: column;
        justify-content: center;
        width: 100%;
        padding: 8px 0;
      }
    `}
`;
