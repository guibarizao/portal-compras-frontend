import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useSuppliersBankDetailsService } from "../../services/useSuppliersBankDetailsService";
import { useToastr } from "../../hooks/useToastr";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import ISuppliersBankDetails from "../../interfaces/ISuppliersBankDetails";

interface ISupplierBankDetailProps {
  title: string;
}

const SuppliersBankDetails: React.FC<ISupplierBankDetailProps> = ({
  title,
}) => {
  window.document.title = title;

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const {
    deleteSuppliersBankDetails,
    listSuppliersBankDetailsById,
    updateSuppliersBankDetails,
    createSuppliersBankDetails,
  } = useSuppliersBankDetailsService();

  const [suppliersBankDetailId, setSuppliersBankDetailsId] = useState("");

  const [supplierId, setSupplierId] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountType, setAccountType] = useState<"CURRENT" | "SAVINGS">(
    "CURRENT"
  );
  const [agency, setAgency] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [pixKeyType, setPixKeyType] = useState<string | null>(null);
  const [pixKey, setPixKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const handleListSuppliersBankDetails = useCallback(async () => {
    const id = location.pathname
      .replace("/suppliers-bank-details", "")
      .replace("/", "");

    setSuppliersBankDetailsId(id);

    const query = location.search;
    setSupplierId(query.replace("?supplierId=", ""));

    if (id) {
      setLoading(true);

      await listSuppliersBankDetailsById(id)
        .then((response) => {
          const suppliersBankDetail: ISuppliersBankDetails = response;

          setSupplierId(suppliersBankDetail.supplierId);
          setBankCode(String(suppliersBankDetail.bankCode));
          setAccountType(suppliersBankDetail.accountType);
          setAgency(String(suppliersBankDetail.agency));
          setAccountNumber(String(suppliersBankDetail.accountNumber));
          setPixKeyType(suppliersBankDetail.pixKeyType);
          setPixKey(suppliersBankDetail.pixKey);
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");

          navigate(`/supplier/${supplierId}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [supplierId, navigate, signOut, toastr, location.pathname]);

  const handleDeleteSuppliersBankDetails = useCallback(async () => {
    setLoading(true);
    await deleteSuppliersBankDetails(suppliersBankDetailId)
      .then(async () => {
        toastr.success("Dados bancários deletados com sucesso");

        navigate(`/supplier/${supplierId}`);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [supplierId, suppliersBankDetailId, toastr, navigate]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: ISuppliersBankDetails = {
        bankCode,
        agency,
        accountType,
        accountNumber,
        pixKeyType,
        pixKey,
        supplierId,
      };

      const schema = Yup.object().shape({
        bankCode: Yup.string().required("Cód. banco é obrigatório"),
        agency: Yup.string().required("Agência é obrigatória"),
        accountType: Yup.string().required("Tipo da conta é obrigatória"),
        accountNumber: Yup.string().required("N° da conta é obrigatória"),
      });

      if (suppliersBankDetailId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updateSuppliersBankDetails(suppliersBankDetailId, data)
          .then(async () => {
            await handleListSuppliersBankDetails();

            navigate(`/supplier/${supplierId}`);
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

        await createSuppliersBankDetails(data)
          .then(async () => {
            await handleListSuppliersBankDetails();

            toastr.success("Dados bancários criados com sucesso");

            navigate(`/supplier/${supplierId}`);
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
    suppliersBankDetailId,
    bankCode,
    agency,
    accountType,
    accountNumber,
    pixKeyType,
    pixKey,
    supplierId,
    navigate,
    signOut,
    handleListSuppliersBankDetails,
  ]);

  useEffect(() => {
    handleListSuppliersBankDetails();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Dados bancários do fornecedor</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Cód. banco"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                helperText={formErrors.bankCode}
                error={!!formErrors.bankCode}
                required
                autoFocus
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Tipo da conta</InputLabel>
                <Select
                  label="Tipo da conta"
                  value={`${accountType}`}
                  onChange={(e) => {
                    setAccountType(
                      e.target.value === "CURRENT" ? "CURRENT" : "SAVINGS"
                    );
                  }}
                >
                  <MenuItem key={"CURRENT"} value={"CURRENT"}>
                    Corrente
                  </MenuItem>
                  <MenuItem key={"SAVINGS"} value={"SAVINGS"}>
                    Poupança
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Agência"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                helperText={formErrors.agency}
                error={!!formErrors.agency}
                required
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="N° da conta"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                helperText={formErrors.accountNumber}
                error={!!formErrors.accountNumber}
                required
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo da chave PIX</InputLabel>
                <Select
                  label="Tipo da chave PIX"
                  value={`${pixKeyType}`}
                  onChange={(e) => {
                    setPixKeyType(e.target.value);
                  }}
                >
                  <MenuItem key={"CPF"} value={"CPF"}>
                    CPF
                  </MenuItem>
                  <MenuItem key={"PHONE"} value={"PHONE"}>
                    Telefone
                  </MenuItem>

                  <MenuItem key={"EMAIL"} value={"EMAIL"}>
                    E-mail
                  </MenuItem>

                  <MenuItem key={"RANDOM"} value={"RANDOM"}>
                    Aleatória
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Chave PIX"
                value={pixKey}
                onChange={(e) => {
                  setPixKey(e.target.value);
                }}
                error={!!formErrors.pixKey}
                helperText={formErrors.pixKey}
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            {suppliersBankDetailId && (
              <ButtonTheme
                onClick={handleDeleteSuppliersBankDetails}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            <ButtonTheme
              onClick={() => {
                navigate(`/supplier/${supplierId}`);
              }}
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

export default SuppliersBankDetails;
