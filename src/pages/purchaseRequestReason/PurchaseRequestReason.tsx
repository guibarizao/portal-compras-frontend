import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import IPurchaseRequestReason from "../../interfaces/IPurchaseRequestReason";
import { usePurchaseRequestReasonService } from "../../services/usePurchaseRequestReasonService";
import { Grid, TextField } from "@mui/material";

interface IPurchaseRequestReasonProps {
  title: string;
}

const PurchaseRequestReason: React.FC<IPurchaseRequestReasonProps> = ({
  title,
}) => {
  window.document.title = title;

  const {
    deletePurchaseRequestReason,
    listPurchaseRequestReasonById,
    updatePurchaseRequestReason,
    createPurchaseRequestReason,
  } = usePurchaseRequestReasonService();

  const [purchaseRequestReasonId, setPurchaseRequestReasonId] = useState("");

  const [id, setId] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListPurchaseRequestReason = useCallback(async () => {
    const id = location.pathname
      .replace("/purchase-request-reason", "")
      .replace("/", "");

    setPurchaseRequestReasonId(id);

    if (id) {
      setLoading(true);

      await listPurchaseRequestReasonById(id)
        .then((response) => {
          const purchaseRequestReason: IPurchaseRequestReason = response;

          setId(purchaseRequestReason.id ? purchaseRequestReason.id : "");
          setDescription(purchaseRequestReason.description);
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");

          navigate("/purchase-request-reasons");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate, signOut, toastr, location.pathname]);

  const handleDeletePurchaseRequestReason = useCallback(async () => {
    setLoading(true);
    await deletePurchaseRequestReason(purchaseRequestReasonId)
      .then(async () => {
        toastr.success("Motivo de solicitação de compra deletada com sucesso");

        navigate("/purchase-request-reasons");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [purchaseRequestReasonId, toastr, navigate]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: IPurchaseRequestReason = {
        description,
      };

      const schema = Yup.object().shape({
        description: Yup.string().required("Descrição obrigatória"),
      });

      if (purchaseRequestReasonId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updatePurchaseRequestReason(purchaseRequestReasonId, data)
          .then(async () => {
            await handleListPurchaseRequestReason();

            navigate("/purchase-request-reasons");
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

        await createPurchaseRequestReason(data)
          .then(async () => {
            await handleListPurchaseRequestReason();

            toastr.success(
              "Motivo de solicitação de compra criada com sucesso"
            );

            navigate("/purchase-request-reasons");
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
    purchaseRequestReasonId,
    description,
    navigate,
    signOut,
    handleListPurchaseRequestReason,
  ]);

  useEffect(() => {
    handleListPurchaseRequestReason();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Motivo de solicitação de Compra</h1>
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
          </Grid>

          <ButtonGroup justformobilie>
            {purchaseRequestReasonId && (
              <ButtonTheme
                onClick={handleDeletePurchaseRequestReason}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            <ButtonTheme
              onClick={() => navigate("/purchase-request-reasons")}
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

export default PurchaseRequestReason;
