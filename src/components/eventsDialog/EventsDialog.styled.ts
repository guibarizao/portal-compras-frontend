import { Dialog } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Dialog)``;

export const CustomDialogContent = styled.div`
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

export const EventCard = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 20px 0;
  min-width: 300px;

  div {
    width: 100%;
    font-size: 0.75rem;
    display: flex;
    justify-content: space-between;

    > span {
      font-size: 0.75rem;
    }
  }

  > span {
    font-size: 0.75rem;
    margin-top: 8px;
  }

  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 600px) {
    width: 500px;
    max-height: 500px;
  }
`;

export const NoneEvents = styled.div`
  padding: 36px 0;
  display: flex;
  justify-content: flex-start;
`;
