import { LoadingButton } from "@mui/lab";
import styled from "styled-components";

export const Container = styled(LoadingButton)`
  && {
    text-transform: none;
    min-width: 100px;
    margin-right: 8px;

    font-weight: 600;

    @media (max-width: 600px) {
      margin-bottom: 8px;
      margin-right: 0;
    }
  }
`;
