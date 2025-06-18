import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import IWallet from "../../interfaces/IWallet";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { useWalletService } from "../../services/useWalletService";
import { Grid, TextField } from "@mui/material";

interface IWalletProps {
  title: string;
}

const Wallet: React.FC<IWalletProps> = ({ title }) => {
  window.document.title = title;

  const { listWalletById } = useWalletService();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListWallet = useCallback(async () => {
    const walletId = location.pathname.replace("/wallet", "").replace("/", "");

    if (walletId) {
      setLoading(true);

      await listWalletById(walletId)
        .then((response) => {
          const wallet: IWallet = response;

          setCode(wallet.code ? wallet.code : "");
          setDescription(wallet.description);
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
    handleListWallet();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Ordem Estatística / Wallet</h1>
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
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                required
                disabled
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/wallets")}
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

export default Wallet;
