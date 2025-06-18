import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import IPage from "../../interfaces/IPage";
import IFormError from "../../interfaces/IFormError";
import { useToastr } from "../../hooks/useToastr";
import { useAuth } from "../../hooks/auth";
import { useConfigureApplicationService } from "../../services/useConfigureApplicationServices";
import { IConfigureApplication } from "../../interfaces/IConfigureApplication";
import getValidationError from "../../util/getValidationError";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { PageCard } from "../../components/pageCard/PageCard";
import { Form } from "../../components/form/Form";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { ConfirmationArea } from "../../components/confirmationArea/ConfirmationArea";

const ConfigureApplication: React.FC<IPage> = ({ title }) => {
  window.document.title = title;

  const { signOut } = useAuth();
  const toastr = useToastr();
  const navigate = useNavigate();
  const location = useLocation();

  const [configureApplicationId, setConfigureApplicationId] = useState<
    string | null
  >(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [port, setPort] = useState("");
  const [database, setDatabase] = useState("");
  const [token, setToken] = useState("");
  const [payloadData, setPayload] = useState("");
  const [bearer, setBearer] = useState("");
  const [key, setKey] = useState("");
  const [secret, setSecret] = useState("");
  const [developerApplicationKey, setDeveloperApplicationKey] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const {
    createConfigureApplication,
    updateConfigureApplication,
    deleteConfigureApplication,
    listConfigureApplicationById,
  } = useConfigureApplicationService();

  const handleToConfigureApplication = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    setLoading(true);
    setFormErrors({});

    try {
      const data = {
        name,
        username,
        password,
        url,
        port,
        database,
        token,
        payloadData,
        bearer,
        key,
        secret,
        developerApplicationKey,
        clientId,
        clientSecret,
      };

      const schema = Yup.object().shape({
        name: Yup.string().required("Nome é obrigatório"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const body: IConfigureApplication = {
        name,
        username,
        password,
        url,
        port: Number(port),
        database,
        token,
        bearer,
        key,
        secret,
        developerApplicationKey,
        clientId,
        clientSecret,
      };

      if (configureApplicationId) {
        await updateConfigureApplication(configureApplicationId, body)
          .then(() => {
            toastr.success("Configuração da aplicação alterada com sucesso");

            handleToConfigureApplication();
          })
          .catch((error) => {
            if (error.statusCode === 401) {
              signOut();
              navigate("/");
            }

            toastr.error(
              error?.message || "Erro ao alterar configurações da aplicação"
            );
          });
      } else {
        await createConfigureApplication(body)
          .then(() => {
            toastr.success("Configuração da aplicação cadastrada com sucesso");

            handleToConfigureApplication();
          })
          .catch((error) => {
            if (error.statusCode === 401) {
              signOut();
            }

            toastr.error(
              error?.message || "Erro ao cadastrar configurações da aplicação"
            );
          });
      }
    } catch (error: Yup.ValidationError | any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationError(error);
        setFormErrors(errors);
        return;
      }

      toastr.error("Ocorreu um erro ao cadastrar/atualizar o registro");
    } finally {
      setLoading(false);
    }
  }, [
    configureApplicationId,
    name,
    username,
    password,
    url,
    port,
    database,
    token,
    payloadData,
    bearer,
    key,
    secret,
    developerApplicationKey,
    clientId,
    clientSecret,
    signOut,
    navigate,
    handleToConfigureApplication,
  ]);

  const handleDeleteConfigureApplication = useCallback(async () => {
    if (configureApplicationId) {
      setLoading(true);

      await deleteConfigureApplication(configureApplicationId)
        .then(async () => {
          toastr.success("Configuração da aplicação deletada com sucesso");

          navigate("/configure-applications");
        })
        .catch((error) => {
          if (error.statusCode === 401) {
            signOut();
          }

          toastr.error("Erro ao deletar registro");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate, signOut, configureApplicationId]);

  const handleListConfigureApplication = useCallback(async () => {
    const id = location.pathname
      .replace("/configure-application", "")
      .replace("/", "");

    setConfigureApplicationId(id);

    if (id) {
      setLoading(true);
      await listConfigureApplicationById(id)
        .then((response) => {
          const configureApplication: IConfigureApplication = response;

          setName(configureApplication.name);
          configureApplication.username &&
            setUsername(configureApplication.username);

          configureApplication.password &&
            setPassword(configureApplication.password);

          configureApplication.url && setUrl(configureApplication.url);

          setPort(String(configureApplication.port));

          configureApplication.database &&
            setDatabase(configureApplication.database);

          configureApplication.token && setToken(configureApplication.token);

          configureApplication.payload &&
            setPayload(configureApplication.payload);

          configureApplication.bearer && setBearer(configureApplication.bearer);

          configureApplication.key && setKey(configureApplication.key);

          configureApplication.secret && setSecret(configureApplication.secret);

          configureApplication.developerApplicationKey &&
            setDeveloperApplicationKey(
              configureApplication.developerApplicationKey
            );

          configureApplication.clientId &&
            setClientId(configureApplication.clientId);

          configureApplication.clientSecret &&
            setClientSecret(configureApplication.clientSecret);
        })
        .catch((error) => {
          if (error.statusCode === 401) {
            signOut();
          }

          toastr.error(error?.message || "Contate a equipe de suporte");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [signOut, location.pathname]);

  useEffect(() => {
    handleListConfigureApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Configuração de aplicação</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          {loading && <BackdropCustom />}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                helperText={formErrors.name}
                error={!!formErrors.name}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                helperText={formErrors.username}
                error={!!formErrors.username}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel size="small" htmlFor="outlined-adornment-password">
                  Senha
                </InputLabel>
                <OutlinedInput
                  size="small"
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Senha"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoComplete="off"
                helperText={formErrors.url}
                error={!!formErrors.url}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <InputMask
                mask={"9999999"}
                value={port}
                onChange={(e) => setPort(e.target.value)}
                maskPlaceholder={null}
              >
                <TextField
                  sx={{ width: "100%" }}
                  size="small"
                  label="Porta"
                  autoComplete="off"
                  helperText={formErrors.port}
                  error={!!formErrors.port}
                />
              </InputMask>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Database"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                autoComplete="off"
                helperText={formErrors.database}
                error={!!formErrors.database}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                autoComplete="off"
                helperText={formErrors.token}
                error={!!formErrors.token}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Payload"
                value={payloadData}
                onChange={(e) => setPayload(e.target.value)}
                autoComplete="off"
                helperText={formErrors.payloadData}
                error={!!formErrors.payloadData}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Bearer"
                value={bearer}
                onChange={(e) => setBearer(e.target.value)}
                autoComplete="off"
                helperText={formErrors.bearer}
                error={!!formErrors.bearer}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                autoComplete="off"
                helperText={formErrors.key}
                error={!!formErrors.key}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                autoComplete="off"
                helperText={formErrors.secret}
                error={!!formErrors.secret}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Developer Application Key"
                value={developerApplicationKey}
                onChange={(e) => setDeveloperApplicationKey(e.target.value)}
                autoComplete="off"
                helperText={formErrors.developerApplicationKey}
                error={!!formErrors.developerApplicationKey}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Client Id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                autoComplete="off"
                helperText={formErrors.clientId}
                error={!!formErrors.clientId}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Client Secret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                autoComplete="off"
                helperText={formErrors.clientSecret}
                error={!!formErrors.clientSecret}
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/settings")}
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>

            {configureApplicationId && (
              <ButtonTheme
                onClick={() => {
                  setDeleteDialogOpen(true);
                }}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            <ButtonTheme
              onClick={() => handleSubmit()}
              disabled={loading}
              title="Confirma o cadastro ou alteração"
            >
              Confirmar
            </ButtonTheme>

            {configureApplicationId && (
              <ConfirmationArea
                id={configureApplicationId}
                dialogOpen={deleteDialogOpen}
                handleConfirmation={handleDeleteConfigureApplication}
                title="Deseja realmente excluir a configuração de aplicação?"
                message=""
                deny={() => {
                  setDeleteDialogOpen(false);
                }}
              />
            )}
          </ButtonGroup>
        </Form>
      </PageCard>
    </>
  );
};

export default ConfigureApplication;
