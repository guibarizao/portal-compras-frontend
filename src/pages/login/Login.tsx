import React, { useState } from "react";
import IPage from "../../interfaces/IPage";
import IFormError from "../../interfaces/IFormError";
import { Alert, IconButton, InputAdornment } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import { useToastr } from "../../hooks/useToastr";
import { validateSchema } from "../../util/validateSchema";
import ILogin from "../../interfaces/ILogin";
import { useAuth } from "../../hooks/auth";

import {
  AccessMessage,
  EmailTextFiled,
  Form,
  LoginButton,
  LoginFormContainer,
  LoginImage,
  LoginStyled,
  PasswordTextTextField,
  SecondaryTitle,
} from "./Login.styles";
import logoImg from "../../assets/logo-sicredi.svg";

const Login = (props: IPage) => {
  window.document.title = props.title;
  const navigate = useNavigate();

  const toastr = useToastr();
  const [errors, setErrors] = useState<IFormError | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const [messageError, setMessageError] = useState("");

  const schema = yup.object({
    username: yup
      .string()
      .required("E-mail não informado")
      .matches(/.+@.+\..+/, "Informe um e-mail válido"),
    password: yup.string().required("Senha não informada"),
  });
  const [login, setLogin] = useState<ILogin>({ username: "", password: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const validation = validateSchema();
    event.preventDefault();
    const result = await validation.validate(schema, login).then((result) => {
      return result;
    });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    } else {
      setErrors(null);
    }

    setLoading(true);
    await signIn(login.username.toLowerCase(), login.password)
      .then(() => {
        setLoading(false);
        navigate("dashboard");
      })
      .catch((error) => {
        if (error.status === 423) {
          setMessageError(error.message);
        } else {
          toastr.error(error.message);
        }
        setLoading(false);
      });
  };

  return (
    <LoginStyled isDark={false}>
      <LoginImage />
      <LoginFormContainer>
        <img
          src={logoImg}
          alt="Senior"
          style={{ marginBottom: "32px", width: "250px" }}
        />
        <SecondaryTitle>Portal Suprimentos</SecondaryTitle>
        <span style={{ marginTop: "12px" }}>(Compras e Almoxarifado)</span>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <AccessMessage>Acesse sua conta</AccessMessage>
          {messageError && (
            <Alert severity="error" style={{ marginTop: "16px" }}>
              {messageError}{" "}
              <a
                href="https://platform.senior.com.br/login/"
                target="__blank"
                style={{ textDecoration: "none" }}
              >
                <strong style={{ color: "#5F2120" }}>Clique Aqui!</strong>
              </a>
            </Alert>
          )}
          <EmailTextFiled
            variant="outlined"
            value={login.username}
            onChange={(e) =>
              setLogin({
                ...login,
                username: String(e.target.value).toLowerCase(),
              })
            }
            label="E-mail"
            placeholder="usuario@dominio.com.br"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            error={Boolean(errors?.username)}
            helperText={Boolean(errors?.username) ? errors?.username : ""}
          />
          <PasswordTextTextField
            variant="outlined"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            label="Senha"
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(errors?.password)}
            helperText={Boolean(errors?.password) ? errors?.password : ""}
          />

          <LoginButton
            type="submit"
            variant="contained"
            size="large"
            loading={loading}
            loadingPosition="start"
            startIcon={<i />}
          >
            Autenticar
          </LoginButton>

          <a
            href={
              process.env.REACT_APP_FORGOT_URL ||
              "https://platform.senior.com.br/login/forgot.html"
            }
            id="forgot-password"
            target="__blank"
          >
            Esqueceu a senha?
          </a>
        </Form>
      </LoginFormContainer>
    </LoginStyled>
  );
};

export default Login;
