import { TextField } from "@mui/material";
import styled from "styled-components";
import { LoadingButton } from "@mui/lab";

interface ILoginStyle {
  isDark: boolean;
}

export const LoginStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px
      ${(props: ILoginStyle) => (props.isDark ? "#121212" : "#fff")} inset !important;
    box-shadow: 0 0 0px 1000px
      ${(props: ILoginStyle) => (props.isDark ? "#121212" : "#fff")} inset !important;
  }
`;

export const LoginImage = styled.div`
  width: 100%;
  height: 100%;
  margin: 0px;
  overflow: hidden;
  background-image: url(${require("../../assets/img_login.png")});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  @media screen and (max-width: 600px) {
    visibility: hidden;
    width: 0px;
  }
`;

export const LoginFormContainer = styled.div`
  width: 700px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SecondaryTitle = styled.div`
  font-size: 1.5rem;
  color: dimgrey;
  font-weight: 400;
  letter-spacing: 3px;
  font-family: "Exo 2", sans-serif;
`;

export const AccessMessage = styled.div`
  font-size: 15px;
  color: dimgrey;
  font-weight: 100;
  margin-top: 30px;
`;

export const Form = styled.form`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  #forgot-password {
    color: #3fa110;
    text-decoration: none;
    margin-top: 34px;
  }
`;

export const LoginButton = styled(LoadingButton)`
  && {
    width: 100%;
    height: 56px;
    text-transform: none;
    font-size: 1.2rem;

    background-color: #3fa110;

    transition: background-color 0.2s;

    &:hover {
      background-color: #33820d;
    }
  }
`;

export const EmailTextFiled = styled(TextField)`
  width: 100%;
  margin: 32px 0px 10px 0px !important;
  box-sizing: content-box;
`;

export const PasswordTextTextField = styled(TextField)`
  width: 100%;
  margin: 10px 0px 25px 0px !important;
  box-sizing: content-box;
`;
