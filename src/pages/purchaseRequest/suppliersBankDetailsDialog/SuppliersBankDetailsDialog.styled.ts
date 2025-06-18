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
