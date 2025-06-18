import React, { useCallback, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import * as Yup from "yup";

import {
  Container,
  CustomDialogContent,
} from "./SuppliersBankDetailsDialog.styled";
import IFormError from "../../../interfaces/IFormError";
import { Form } from "../../../components/form/Form";
import ISuppliersBankDetails from "../../../interfaces/ISuppliersBankDetails";
import { useSuppliersBankDetailsService } from "../../../services/useSuppliersBankDetailsService";
import { useNavigate } from "react-router-dom";
import { useToastr } from "../../../hooks/useToastr";
import { useAuth } from "../../../hooks/auth";
import getValidationError from "../../../util/getValidationError";
import { BackdropCustom } from "../../../components/backdrop/Backdrop";

interface ISuppliersBankDetailsProps {
  dialogOpen: boolean;
  handleCloseDialog: () => void;
  handleOpenDialog: () => void;
  supplierId: string;
}

const SuppliersBankDetailsDialog: React.FC<ISuppliersBankDetailsProps> = ({
  dialogOpen,
  handleCloseDialog,
  handleOpenDialog,
  supplierId,
}) => {
  const navigate = useNavigate();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const { createSuppliersBankDetails } = useSuppliersBankDetailsService();

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

      let schema: Yup.AnySchema;

      if (pixKeyType) {
        schema = Yup.object().shape({
          pixKey: Yup.string().required("Chave PIX é obrigatória"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
      }

      if (!pixKeyType || !pixKey) {
        schema = Yup.object().shape({
          bankCode: Yup.string().required("Cód. banco é obrigatório"),
          agency: Yup.string().required("Agência é obrigatória"),
          accountType: Yup.string().required("Tipo da conta é obrigatória"),
          accountNumber: Yup.string().required("N° da conta é obrigatória"),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
      }

      await createSuppliersBankDetails(data)
        .then(async () => {
          toastr.success("Conta bancária criada com sucesso");

          setBankCode("");
          setAccountType("CURRENT");
          setAgency("");
          setAccountNumber("");
          setPixKeyType(null);
          setPixKey("");
          handleCloseDialog();
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");
        });
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
    bankCode,
    agency,
    accountType,
    accountNumber,
    pixKeyType,
    pixKey,
    supplierId,
    navigate,
    signOut,
  ]);

  return (
    <Container
      open={dialogOpen}
      onClose={handleOpenDialog}
      sx={{
        "& .MuiDialog-container": {
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <DialogContent>
        <CustomDialogContent>
          <h1>Dados bancários do fornecedor</h1>

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
                      CPF/CNPJ
                    </MenuItem>
                    {/* <MenuItem key={"PHONE"} value={"PHONE"}>
                      Telefone
                    </MenuItem>

                    <MenuItem key={"EMAIL"} value={"EMAIL"}>
                      E-mail
                    </MenuItem>

                    <MenuItem key={"RANDOM"} value={"RANDOM"}>
                      Aleatória
                    </MenuItem> */}
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
          </Form>
        </CustomDialogContent>
      </DialogContent>
      <DialogActions sx={{ marginRight: "10px" }}>
        <Button
          color="error"
          onClick={() => {
            setBankCode("");
            setAccountType("CURRENT");
            setAgency("");
            setAccountNumber("");
            setPixKeyType(null);
            setPixKey("");
            setFormErrors({});

            handleCloseDialog();
          }}
          sx={{ textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit} sx={{ textTransform: "none" }}>
          Confirmar
        </Button>
      </DialogActions>

      {loading && <BackdropCustom />}
    </Container>
  );
};

export { SuppliersBankDetailsDialog };
