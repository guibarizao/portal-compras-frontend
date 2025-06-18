import { useCallback, useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useReportService } from "../../services/useReportService";
import { useToastr } from "../../hooks/useToastr";
import IReport from "../../interfaces/IReport";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { CheckboxArea } from "./Report.styles";

interface IReportProps {
  title: string;
}

const Report: React.FC<IReportProps> = ({ title }) => {
  window.document.title = title;

  const { listReportById, updateReport, createReport, deleteReport } =
    useReportService();

  const [reportId, setReportId] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListReport = useCallback(async () => {
    const id = location.pathname.replace("/report", "").replace("/", "");

    setReportId(id);

    if (id) {
      setLoading(true);

      await listReportById(id)
        .then((response) => {
          const report: IReport = response;
          setCode(report.code);
          setDescription(report.description);
          setIsActive(report.isActive);
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
  }, [navigate, signOut, toastr, location.pathname, listReportById]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: IReport = {
        code,
        description,
        isActive,
      };

      const schema = Yup.object().shape({
        code: Yup.string().required("Código é obrigatório"),
        description: Yup.string().required("Descrição é obrigatória"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if (reportId) {
        await updateReport(reportId, data)
          .then(() => {
            toastr.success("Relatório atualizado com sucesso");
            navigate("/reports");
          })
          .catch((error) => {
            if (error.status === 401) {
              signOut();
              navigate("/");
            }
            toastr.error(error?.message || "Contate a equipe de suporte");
          });
      } else {
        await createReport(data)
          .then(() => {
            toastr.success("Relatório criado com sucesso");
            navigate("/reports");
          })
          .catch((error) => {
            if (error.status === 401) {
              signOut();
              navigate("/");
            }
            toastr.error(error?.message || "Contate a equipe de suporte");
          });
      }
    } catch (error: Yup.ValidationError | any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationError(error);
        setFormErrors(errors);
        return;
      }
      toastr.error(error?.message || "Contate a equipe de suporte");
    } finally {
      setLoading(false);
    }
  }, [reportId, code, description, isActive, navigate, signOut, toastr]);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    await deleteReport(reportId)
      .then(async () => {
        toastr.success("Relatório deletada com sucesso");

        navigate("/reports");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reportId, toastr, navigate]);

  const handleChangeIsActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked);
  };

  useEffect(() => {
    handleListReport();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Relatório</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                helperText={formErrors.code}
                error={!!formErrors.code}
                required
                autoFocus
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                helperText={formErrors.description}
                error={!!formErrors.description}
                required
              />
            </Grid>
          </Grid>

          <CheckboxArea>
            <FormControlLabel
              label="Ativo"
              control={
                <Checkbox checked={isActive} onChange={handleChangeIsActive} />
              }
            />
          </CheckboxArea>

          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/reports")}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Cancelar
            </ButtonTheme>
            {reportId && (
              <ButtonTheme
                onClick={handleDelete}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            <ButtonTheme onClick={() => handleSubmit()} disabled={loading}>
              Confirmar
            </ButtonTheme>
          </ButtonGroup>
        </Form>

        {loading && <BackdropCustom />}
      </PageCard>
    </>
  );
};

export default Report;
