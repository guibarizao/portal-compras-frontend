import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import * as Yup from "yup";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import IProductRequest from "../../interfaces/IProductRequest";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { useProductRequestService } from "../../services/useProductRequestService";
import IFormError from "../../interfaces/IFormError";
import getValidationError from "../../util/getValidationError";
import ProductRequestAttachments from "./productRequestAttachments/ProductRequestAttachments";
import { ConfirmationArea } from "../../components/confirmationArea/ConfirmationArea";

interface IProductRequestProps {
  title: string;
}

const ProductRequest: React.FC<IProductRequestProps> = ({ title }) => {
  window.document.title = title;

  const {
    listProductRequestById,
    createProductRequest,
    updateProductRequest,
    deleteProductRequest,
    closeProductRequest,
  } = useProductRequestService();
  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const [productRequestId, setProductRequestId] = useState("");
  const [type, setType] = useState("PRODUCT");
  const [protocol, setProtocol] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetail] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formErrors, setFormErrors] = useState<IFormError>({});

  const handleListProductRequest = useCallback(async () => {
    const id = location.pathname
      .replace("/product-request", "")
      .replace("/", "");

    setProductRequestId(id);

    if (id) {
      setLoading(true);

      await listProductRequestById(id)
        .then((response) => {
          const product: IProductRequest = response;

          setProtocol(product.protocol || "");
          setType(product.type);
          setDescription(product.description);
          setDetail(product.details);
          setIsDraft(!!product.isDraft);
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

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: IProductRequest = {
        type: type === "PRODUCT" ? "PRODUCT" : "SERVICE",
        description,
        details,
      };

      const schema = Yup.object().shape({
        description: Yup.string().required("Descrição obrigatória"),
      });

      if (productRequestId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updateProductRequest(productRequestId, data)
          .then(async () => {
            await handleListProductRequest();
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

        await createProductRequest(data)
          .then(async (response) => {
            toastr.success("Solicitação de produto criada com sucesso");

            setProductRequestId(response.id || "");
            navigate(`/product-request/${response.id}`);
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
  }, [productRequestId, type, description, details, navigate, signOut]);

  const handleDeleteProductRequest = useCallback(async () => {
    setLoading(true);
    await deleteProductRequest(productRequestId)
      .then(async () => {
        toastr.success("Solicitação de produto deletada com sucesso");

        navigate("/product-requests");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productRequestId, toastr, navigate]);

  const handleCloseProductRequest = useCallback(async () => {
    setLoading(true);

    try {
      await closeProductRequest(productRequestId).then(async () => {
        toastr.success(
          "Cadastro de solicitação de produto finalizado com sucesso"
        );
        handleListProductRequest();
      });
    } catch (error: Yup.ValidationError | any) {
      toastr.error(error?.message || "Contate a equipe de suporte");
    } finally {
      setLoading(false);
    }
  }, [productRequestId, toastr, navigate, handleListProductRequest]);

  useEffect(() => {
    handleListProductRequest();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Solicitação de Produto</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Protocolo"
                value={protocol}
                autoFocus
                required
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="select-filter">Tipo</InputLabel>
                <Select
                  label="Tipo"
                  value={`${type}`}
                  onChange={(e) => {
                    setType(`${e.target.value}`);
                  }}
                  disabled={!isDraft}
                >
                  <MenuItem key={"PRODUCT"} value={"PRODUCT"}>
                    {"Produto"}
                  </MenuItem>
                  <MenuItem key={"SERVICE"} value={"SERVICE"}>
                    {"Serviço"}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Descrição do Produto/Serviço"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                required
                placeholder="Forneça uma descrição completa sobre o item"
                error={!!formErrors.description}
                helperText={formErrors.description}
                disabled={!isDraft}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Observação Complementar"
                value={details}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Informe uma observação complementar sobre o item se necessário"
                disabled={!isDraft}
              />
            </Grid>
          </Grid>
          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/product-requests")}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>

            {productRequestId && isDraft && (
              <ButtonTheme
                onClick={handleDeleteProductRequest}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            {isDraft && (
              <ButtonTheme onClick={() => handleSubmit()} disabled={loading}>
                Confirmar
              </ButtonTheme>
            )}

            {productRequestId && isDraft && (
              <ButtonTheme
                onClick={() => {
                  setCloseDialogOpen(true);
                }}
                disabled={loading}
                color="info"
                title="Finaliza o cadastro, tornando-o disponível para integração com ERP"
              >
                Finalizar
              </ButtonTheme>
            )}
          </ButtonGroup>
        </Form>

        {productRequestId && (
          <ConfirmationArea
            id={productRequestId}
            dialogOpen={closeDialogOpen}
            handleConfirmation={handleCloseProductRequest}
            title="Deseja realmente finalizar o cadastro da solicitação de produto?"
            message="Essa ação não poderá ser desfeita. Ao finalizar a solicitação, ela ficará disponível para a integração com o ERP."
            deny={() => {
              setCloseDialogOpen(false);
            }}
          />
        )}

        {loading && <BackdropCustom />}
      </PageCard>

      {productRequestId && (
        <>
          <ProductRequestAttachments
            productRequestId={productRequestId}
            title="Anexos"
            productRequestDisableEdit={!isDraft}
          />
        </>
      )}
    </>
  );
};

export default ProductRequest;
