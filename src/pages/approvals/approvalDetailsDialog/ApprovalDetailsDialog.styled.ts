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

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #222;
  box-sizing: border-box;
  gap: 8px;
  & > h1 {
    font-size: 1.25rem;
    font-weight: 500;
    color: #333;
  }
  & > p {
    font-size: 0.875rem;
    color: #666;
  }
`;
