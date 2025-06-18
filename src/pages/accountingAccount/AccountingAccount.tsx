import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import IAccountingAccount from "../../interfaces/IAccountingAccount";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { Grid, TextField } from "@mui/material";
import { useAccountingAccountsService } from "../../services/useAccountingAccountsServices";

interface IAccountingAccountProps {
  title: string;
}

const AccountingAccount: React.FC<IAccountingAccountProps> = ({ title }) => {
  window.document.title = title;

  const { listAccountingAccountById } = useAccountingAccountsService();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [classification, setClassification] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListAccountingAccount = useCallback(async () => {
    const accountingAccountId = location.pathname
      .replace("/accounting-account", "")
      .replace("/", "");

    if (accountingAccountId) {
      setLoading(true);

      await listAccountingAccountById(accountingAccountId)
        .then((response) => {
          const accountingAccount: IAccountingAccount = response;

          setCode(accountingAccount.code ? accountingAccount.code : "");
          setDescription(accountingAccount.description);
          setClassification(accountingAccount.classification);
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
    handleListAccountingAccount();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Centro de Custo</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3}>
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
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                required
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Classificação"
                value={classification}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                required
                disabled
              />
            </Grid>
          </Grid>
          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/accounting-accounts")}
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
    </>
  );
};

export default AccountingAccount;
