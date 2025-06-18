import { LoadingButton } from "@mui/lab";
import styled from "styled-components";

export const Container = styled(LoadingButton)`
  && {
    text-transform: none;
    min-width: 100px;

    & + & {
      margin-left: 8px;
    }

    font-weight: 600;

    @media (max-width: 600px) {
      & + & {
        margin-top: 8px;
        margin-left: 0;
      }
    }
  }
`;
