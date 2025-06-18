import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useStockRequestTypeService } from "../../services/useStockRequestTypeService";
import { useToastr } from "../../hooks/useToastr";
import IStockRequestType from "../../interfaces/IStockRequestType";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";

interface IStockRequestTypeProps {
  title: string;
}

const StockRequestType: React.FC<IStockRequestTypeProps> = ({ title }) => {
  window.document.title = title;

  const {
    deleteStockRequestType,
    listStockRequestTypeById,
    updateStockRequestType,
    createStockRequestType,
  } = useStockRequestTypeService();

  const [stockRequestTypeId, setStockRequestTypeId] = useState("");

  const [id, setId] = useState("");
  const [description, setDescription] = useState("");

  const [stockRequestProjectRequired, setStockRequestProjectRequired] =
    useState(false);
  const [stockRequestWalletRequired, setStockRequestWalletRequired] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListStockRequestType = useCallback(async () => {
    const id = location.pathname
      .replace("/stock-request-type", "")
      .replace("/", "");

    setStockRequestTypeId(id);

    if (id) {
      setLoading(true);

      await listStockRequestTypeById(id)
        .then((response) => {
          const stockRequestType: IStockRequestType = response;

          setId(stockRequestType.id ? stockRequestType.id : "");
          setDescription(stockRequestType.description);
          setStockRequestProjectRequired(
            Boolean(stockRequestType.stockRequestProjectRequired)
          );
          setStockRequestWalletRequired(
            Boolean(stockRequestType.stockRequestWalletRequired)
          );
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");

          navigate("/stock-request-types");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate, signOut, toastr, location.pathname]);

  const handleDeleteStockRequestType = useCallback(async () => {
    setLoading(true);
    await deleteStockRequestType(stockRequestTypeId)
      .then(async () => {
        toastr.success("Tipo de requisição de estoque deletada com sucesso");

        navigate("/stock-request-types");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stockRequestTypeId, toastr, navigate]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: IStockRequestType = {
        description,
        stockRequestProjectRequired,
        stockRequestWalletRequired,
      };

      const schema = Yup.object().shape({
        description: Yup.string().required("Descrição obrigatória"),
      });

      if (stockRequestTypeId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updateStockRequestType(stockRequestTypeId, data)
          .then(async () => {
            await handleListStockRequestType();

            navigate("/stock-request-types");
          })
          .catch((error) => {
            if (error.status === 401) {
              signOut();
              navigate("/");
            }

            toastr.error(error?.message || "Contate a equipe de suporte");
          });
      } else {
        await schema.validate(data, {
          abortEarly: false,
        });

        await createStockRequestType(data)
          .then(async () => {
            await handleListStockRequestType();

            toastr.success("Tipo de requisição de estoque criada com sucesso");

            navigate("/stock-request-types");
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
  }, [
    stockRequestTypeId,
    description,
    stockRequestProjectRequired,
    stockRequestWalletRequired,
    navigate,
    signOut,
    handleListStockRequestType,
  ]);

  useEffect(() => {
    handleListStockRequestType();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Tipo de requisição de estoque</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="id"
                value={id}
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
                helperText={formErrors.description}
                error={!!formErrors.description}
                autoFocus
                required
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                sx={{ m: 3, marginLeft: "8px" }}
                component="fieldset"
                variant="standard"
              >
                <FormGroup>
                  <FormControlLabel
                    label="Campo Projeto obrigatório"
                    control={
                      <Checkbox
                        onChange={(e) =>
                          setStockRequestProjectRequired(e.target.checked)
                        }
                        checked={stockRequestProjectRequired}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                sx={{ m: 3, marginLeft: "8px" }}
                component="fieldset"
                variant="standard"
              >
                <FormGroup>
                  <FormControlLabel
                    label="Campo Wallet obrigatório"
                    control={
                      <Checkbox
                        onChange={(e) =>
                          setStockRequestWalletRequired(e.target.checked)
                        }
                        checked={stockRequestWalletRequired}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            {stockRequestTypeId && (
              <ButtonTheme
                onClick={handleDeleteStockRequestType}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            <ButtonTheme
              onClick={() => navigate("/stock-request-types")}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Cancelar
            </ButtonTheme>
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

export default StockRequestType;
