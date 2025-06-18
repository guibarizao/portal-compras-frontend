import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import ICostCenter from "../../interfaces/ICostCenter";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { useCostCenterService } from "../../services/useCostCentersServices";
import { Grid, TextField } from "@mui/material";

interface ICostCenterProps {
  title: string;
}

const CostCenter: React.FC<ICostCenterProps> = ({ title }) => {
  window.document.title = title;

  const { listCostCenterById } = useCostCenterService();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [classification, setClassification] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListCostCenter = useCallback(async () => {
    const costCenterId = location.pathname
      .replace("/cost-center", "")
      .replace("/", "");

    if (costCenterId) {
      setLoading(true);

      await listCostCenterById(costCenterId)
        .then((response) => {
          const costCenter: ICostCenter = response;

          setCode(costCenter.code ? costCenter.code : "");
          setDescription(costCenter.description);
          setClassification(costCenter.classification);
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
    handleListCostCenter();
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
              onClick={() => navigate("/cost-centers")}
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

export default CostCenter;
