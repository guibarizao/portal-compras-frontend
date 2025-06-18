import { Dialog } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Dialog)``;

export const CustomDialogContent = styled.div`
  width: auto;
  padding: 0px;
  h1 {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    max-height: 400px;
  }
`;

export const Label = styled.label`
  border: none;
  display: flex;
  align-items: center;
  margin-top: 5px;

  cursor: pointer;

  input {
    display: none;
  }

  color: #3fa110;

  transition: color 0.2s;

  &:hover {
    color: #33820d;
  }

  svg {
    margin-right: 8px;
  }
`;
