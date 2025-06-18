import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { usePurchaseRequestTypeService } from "../../services/usePurchaseRequestTypeService";
import { useToastr } from "../../hooks/useToastr";
import IPurchaseRequestType from "../../interfaces/IPurchaseRequestType";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";

interface IPurchaseRequestTypeProps {
  title: string;
}

const PurchaseRequestType: React.FC<IPurchaseRequestTypeProps> = ({
  title,
}) => {
  window.document.title = title;

  const {
    deletePurchaseRequestType,
    listPurchaseRequestTypeById,
    updatePurchaseRequestType,
    createPurchaseRequestType,
  } = usePurchaseRequestTypeService();

  const [purchaseRequestTypeId, setPurchaseRequestTypeId] = useState("");

  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [allowsChangeUnitPrice, setAllowsChangeUnitPrice] = useState(false);
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [requiredAttachments, setRequiredAttachments] = useState(false);
  const [purchaseRequestProjectRequired, setPurchaseRequestProjectRequired] =
    useState(false);
  const [purchaseRequestWalletRequired, setPurchaseRequestWalletRequired] =
    useState(false);

  const [supplierRequired, setSupplierRequired] = useState(false);
  const [reasonRequired, setReasonRequired] = useState(false);
  const [accountingAccountRequired, setAccountingAccountRequired] =
    useState(false);

  const [estimatedDateRequired, setEstimatedDateRequired] = useState(false);

  const [paymentMethodRequired, setPaymentMethodRequired] = useState(false);

  const [showsItemObservation, setShowsItemObservation] = useState(false);

  const [reportPurchaseRequest, setReportPurchaseRequest] = useState("");

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListPurchaseRequestType = useCallback(async () => {
    const id = location.pathname
      .replace("/purchase-request-type", "")
      .replace("/", "");

    setPurchaseRequestTypeId(id);

    if (id) {
      setLoading(true);

      await listPurchaseRequestTypeById(id)
        .then((response) => {
          const purchaseRequestType: IPurchaseRequestType = response;

          setId(purchaseRequestType.id ? purchaseRequestType.id : "");
          setDescription(purchaseRequestType.description);
          setAllowsChangeUnitPrice(!!purchaseRequestType.allowsChangeUnitPrice);
          setShowMoreFields(!!purchaseRequestType.showMoreFields);
          setRequiredAttachments(!!purchaseRequestType.requiredAttachments);
          setPurchaseRequestProjectRequired(
            Boolean(purchaseRequestType.purchaseRequestProjectRequired)
          );
          setPurchaseRequestWalletRequired(
            Boolean(purchaseRequestType.purchaseRequestWalletRequired)
          );
          setSupplierRequired(Boolean(purchaseRequestType.supplierRequired));
          setReasonRequired(Boolean(purchaseRequestType.reasonRequired));
          setAccountingAccountRequired(
            Boolean(purchaseRequestType.accountingAccountRequired)
          );
          setEstimatedDateRequired(
            Boolean(purchaseRequestType.estimatedDateRequired)
          );
          setPaymentMethodRequired(
            Boolean(purchaseRequestType.paymentMethodRequired)
          );
          setReportPurchaseRequest(
            String(purchaseRequestType.reportPurchaseRequest || "")
          );
          setShowsItemObservation(
            Boolean(purchaseRequestType.showsItemObservation)
          );
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");

          navigate("/purchase-request-types");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate, signOut, toastr, location.pathname]);

  const handleDeletePurchaseRequestType = useCallback(async () => {
    setLoading(true);
    await deletePurchaseRequestType(purchaseRequestTypeId)
      .then(async () => {
        toastr.success("Tipo de solicitação de compra deletada com sucesso");

        navigate("/purchase-request-types");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [purchaseRequestTypeId, toastr, navigate]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: IPurchaseRequestType = {
        description,
        allowsChangeUnitPrice,
        showMoreFields,
        requiredAttachments,
        purchaseRequestProjectRequired,
        purchaseRequestWalletRequired,
        supplierRequired,
        reasonRequired,
        accountingAccountRequired,
        estimatedDateRequired,
        paymentMethodRequired,
        reportPurchaseRequest,
        showsItemObservation,
      };

      const schema = Yup.object().shape({
        description: Yup.string().required("Descrição obrigatória"),
      });

      if (purchaseRequestTypeId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updatePurchaseRequestType(purchaseRequestTypeId, data)
          .then(async () => {
            await handleListPurchaseRequestType();

            navigate("/purchase-request-types");
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

        await createPurchaseRequestType(data)
          .then(async () => {
            await handleListPurchaseRequestType();

            toastr.success("Tipo de solicitação de compra criada com sucesso");

            navigate("/purchase-request-types");
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
    purchaseRequestTypeId,
    description,
    allowsChangeUnitPrice,
    showMoreFields,
    requiredAttachments,
    purchaseRequestProjectRequired,
    purchaseRequestWalletRequired,
    supplierRequired,
    reasonRequired,
    accountingAccountRequired,
    estimatedDateRequired,
    paymentMethodRequired,
    reportPurchaseRequest,
    showsItemObservation,
    navigate,
    signOut,
    handleListPurchaseRequestType,
  ]);

  const handleChangeAllowsChangeUnitPrice = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setAllowsChangeUnitPrice(event.target.checked);
  };

  const handleChangeShowMoreFields = (event: ChangeEvent<HTMLInputElement>) => {
    setShowMoreFields(event.target.checked);
  };

  const handleChangeRequiredAttachments = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setRequiredAttachments(event.target.checked);
  };
  useEffect(() => {
    handleListPurchaseRequestType();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Tipo de solicitação de Compra</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              {" "}
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
              <FormControlLabel
                label="Permite alterar o preço unitário da solicitação de compra"
                control={
                  <Checkbox
                    checked={allowsChangeUnitPrice}
                    onChange={handleChangeAllowsChangeUnitPrice}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControlLabel
                label="Mostrar mais campos"
                control={
                  <Checkbox
                    checked={showMoreFields}
                    onChange={handleChangeShowMoreFields}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControlLabel
                label="Anexo obrigatório"
                control={
                  <Checkbox
                    checked={requiredAttachments}
                    onChange={handleChangeRequiredAttachments}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    label="Campo Projeto obrigatório"
                    control={
                      <Checkbox
                        onChange={() =>
                          setPurchaseRequestProjectRequired(
                            !purchaseRequestProjectRequired
                          )
                        }
                        checked={purchaseRequestProjectRequired}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    label="Campo Wallet obrigatório"
                    control={
                      <Checkbox
                        onChange={() =>
                          setPurchaseRequestWalletRequired(
                            !purchaseRequestWalletRequired
                          )
                        }
                        checked={purchaseRequestWalletRequired}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    label="Campo Fornecedor obrigatório"
                    control={
                      <Checkbox
                        onChange={(e) => setSupplierRequired(!supplierRequired)}
                        checked={supplierRequired}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    label="Campo Motivo da Compra obrigatório"
                    control={
                      <Checkbox
                        onChange={(e) => setReasonRequired(!reasonRequired)}
                        checked={reasonRequired}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    label="Conta Contábil obrigatório"
                    control={
                      <Checkbox
                        onChange={(e) =>
                          setAccountingAccountRequired(
                            !accountingAccountRequired
                          )
                        }
                        checked={accountingAccountRequired}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    label="Data de previsão obrigatória"
                    control={
                      <Checkbox
                        onChange={(e) =>
                          setEstimatedDateRequired(!estimatedDateRequired)
                        }
                        checked={estimatedDateRequired}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    label="Forma de Pagamento obrigatória"
                    control={
                      <Checkbox
                        onChange={(e) =>
                          setPaymentMethodRequired(!paymentMethodRequired)
                        }
                        checked={paymentMethodRequired}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    label="Exibe observação do item"
                    control={
                      <Checkbox
                        onChange={(e) =>
                          setShowsItemObservation(!showsItemObservation)
                        }
                        checked={showsItemObservation}
                      />
                    }
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Modelo de Relatório"
                value={reportPurchaseRequest}
                onChange={(r) => setReportPurchaseRequest(r.target.value)}
                helperText={formErrors.reportPurchaseRequest}
                error={!!formErrors.reportPurchaseRequest}
                autoFocus
                required
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            {purchaseRequestTypeId && (
              <ButtonTheme
                onClick={handleDeletePurchaseRequestType}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            <ButtonTheme
              onClick={() => navigate("/purchase-request-types")}
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

export default PurchaseRequestType;
