import { FormControl, FormControlLabel } from "@mui/material";
import styled from "styled-components";

export const FormControlLabelCustom = styled(FormControlLabel)`
  margin-left: 4px;
`;

export const CheckboxArea = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-left: 8px;
  margin-bottom: 32px;
`;

export const FormControlCustom = styled(FormControl)`
  && {
    margin: 8px;
    width: 100%;
  }
`;

export const FormParameters = styled.div`
  display: flex;
  justify-content: space-between;
  color: #3fa110;
  font-size: 15px;
  margin-left: -4px;
  margin-bottom: 24px;
  width: 100%;

  @media screen and (max-width: 1140px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 600px) {
    margin-bottom: 34px;
    grid-template-columns: 1fr;
  }
`;
