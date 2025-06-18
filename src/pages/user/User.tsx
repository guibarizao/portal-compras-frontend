import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import IUser from "../../interfaces/IUser";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { useUserService } from "../../services/useUserService";
import UserCostCenter from "./userCostCenters/UserCostCenters";
import { Grid, TextField } from "@mui/material";

interface IUserProps {
  title: string;
}

const User: React.FC<IUserProps> = ({ title }) => {
  window.document.title = title;

  const { listUserById } = useUserService();

  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListUser = useCallback(async () => {
    const id = location.pathname.replace("/user", "").replace("/", "");

    if (id) {
      setLoading(true);

      await listUserById(id)
        .then((response) => {
          const user: IUser = response;

          setCode(user.code ? user.code : "");
          setUsername(user.username);
          setFullName(user.fullName);
          setEmail(user.email);
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate, signOut, toastr, location.pathname]);

  useEffect(() => {
    handleListUser();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Usuário</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Código ERP"
                value={code}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
                required
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
                disabled
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/settings")}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>
          </ButtonGroup>
        </Form>

        {loading && <BackdropCustom />}
      </PageCard>

      <TitleContainer>
        <h1>Usuário x Centro de Custo</h1>
      </TitleContainer>
      <UserCostCenter />
    </>
  );
};

export default User;
