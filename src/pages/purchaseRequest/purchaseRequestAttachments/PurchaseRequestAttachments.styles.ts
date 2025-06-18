import styled, { css } from "styled-components";

interface ILablePropos {
  disabled: boolean;
}

export const Label = styled.label<ILablePropos>`
  border: none;
  color: #3fa110;
  padding: 4px;
  border-radius: 50%;
  display: flex;

  transition: background 0.2s;

  &:hover {
    background: #fff;
  }

  cursor: pointer;

  input {
    display: none;
  }

  ${(props) =>
    props.disabled
      ? css`
          cursor: default;
          color: #bdbdbd;
        `
      : css``}
`;

export const ButtonCustom = styled.a`
  && {
    text-decoration: none;
    height: 28px;
    display: flex;
    align-items: center;
    color: #3fa110;

    transition: color 0.2s;

    &:hover {
      color: #33820d;
    }

    svg {
      margin-right: 8px;
    }
  }
`;
