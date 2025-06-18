import { Button, DialogContent } from "@mui/material";
import styled from "styled-components";

export const DialogContentCustom = styled(DialogContent)`
  && {
    h1 {
      font-size: 1rem;
      font-weight: 500;
    }

    p {
      font-size: 0.85rem;
    }
  }
`;

export const ButtonCustom = styled(Button)`
  && {
    text-transform: none;
  }
`;
