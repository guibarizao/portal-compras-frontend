import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { FiDownload } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";

import {
  Container,
  CustomDialogContent,
  Label,
} from "./PurchaseRequestMessageDialog.styled";
import { useNavigate } from "react-router-dom";
import { useToastr } from "../../../../hooks/useToastr";
import { useAuth } from "../../../../hooks/auth";
import { usePurchaseRequestMessagesService } from "../../../../services/usePurchaseRequestMessagesService";
import IFormError from "../../../../interfaces/IFormError";
import getValidationError from "../../../../util/getValidationError";
import { Form } from "../../../../components/form/Form";
import { BackdropCustom } from "../../../../components/backdrop/Backdrop";
import IPurchaseRequestMessage from "../../../../interfaces/IPurchaseRequestMessage";
import moment from "moment";
import { ButtonCustom } from "../../purchaseRequestAttachments/PurchaseRequestAttachments.styles";
import returnTypesForAttachments from "../../../../util/returnTypesForAttachment";
interface IPurchaseRequestMessageProps {
  dialogOpen: boolean;
  handleCloseDialog: () => void;
  handleOpenDialog: () => void;
  purchaseRequestMessage: IPurchaseRequestMessage;
  handleListPurchaseRequestMessages: () => void;
}

const MAX_FILE_SIZE_BYTES =
  Number(process.env.REACT_APP_MAX_FILE_SIZE_MB) * 1024 * 1024;

const PurchaseRequestMessageDialog: React.FC<IPurchaseRequestMessageProps> = ({
  dialogOpen,
  handleCloseDialog,
  handleOpenDialog,
  purchaseRequestMessage,
  handleListPurchaseRequestMessages,
}) => {
  const navigate = useNavigate();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const {
    updatePurchaseRequestMessage,
    uploadPurchaseRequestMessageAttachment,
  } = usePurchaseRequestMessagesService();

  const [purchaseRequestMessageId] = useState(purchaseRequestMessage.id);

  const [returnObservation, setReturnObservation] = useState(
    purchaseRequestMessage.returnObservation || ""
  );

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data = {
        returnObservation,
      };

      const schema = Yup.object().shape({
        returnObservation: Yup.string().required("Retorno é obrigatório"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await updatePurchaseRequestMessage(
        purchaseRequestMessageId,
        returnObservation
      )
        .then(async () => {
          toastr.success("Mensagem atualizada com sucesso");
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
      handleListPurchaseRequestMessages();
    }
  }, [returnObservation, purchaseRequestMessageId, navigate, signOut]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentChenge = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, id: string) => {
      if (e.target.files) {
        const data = new FormData();

        const file = e.target.files[0];

        if (file.size > MAX_FILE_SIZE_BYTES) {
          toastr.error(
            `O arquivo é muito grande. O tamanho máximo permitido é de ${process.env.REACT_APP_MAX_FILE_SIZE_MB} megabytes.`
          );
          e.target.value = "";
          return;
        }

        data.append("attachment", file);

        setLoading(true);

        await uploadPurchaseRequestMessageAttachment(id, data)
          .then(async () => {
            toastr.success("Anexo adicionado com sucesso");
            e.target.value = "";
          })
          .catch((error) => {
            toastr.error(error?.message || "Contate a equipe de suporte");
          })
          .finally(() => {
            setLoading(false);

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          });
      }
    },
    []
  );

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
          <h1>Responder mensagem</h1>

          <Form>
            <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  size="small"
                  label="Motivo"
                  value={purchaseRequestMessage.reason}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  size="small"
                  label="Data"
                  value={
                    purchaseRequestMessage.sentDate
                      ? moment(purchaseRequestMessage.sentDate).format(
                          "DD/MM/YYYY"
                        )
                      : ""
                  }
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Observação"
                  value={purchaseRequestMessage.sentObservation}
                  disabled
                  multiline
                  rows={5}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  size="small"
                  label="Data de Retorno"
                  value={
                    purchaseRequestMessage.returnDate
                      ? moment(purchaseRequestMessage.returnDate).format(
                          "DD/MM/YYYY"
                        )
                      : ""
                  }
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Retorno"
                  value={returnObservation}
                  onChange={(e) => setReturnObservation(e.target.value)}
                  helperText={formErrors.returnObservation}
                  error={!!formErrors.returnObservation}
                  required
                  autoFocus
                  multiline
                  rows={5}
                />
              </Grid>

              <Grid item xs={12}>
                <Grid container xs={12}>
                  <Grid item xs={6}>
                    <Label style={{ fontSize: "12px" }}>
                      <FiUpload size={16} />
                      <span>Enviar anexo</span>
                      <input
                        type="file"
                        id="attachment"
                        onChange={async (e) => {
                          await handleAttachmentChenge(
                            e,
                            purchaseRequestMessage.id
                          );
                        }}
                        accept={returnTypesForAttachments()}
                      />
                    </Label>
                  </Grid>

                  <Grid item xs={6}>
                    {purchaseRequestMessage.file &&
                      purchaseRequestMessage.file.length > 20 && (
                        <ButtonCustom
                          href={purchaseRequestMessage.file}
                          target="_blank"
                          style={{ fontSize: "12px" }}
                        >
                          <FiDownload size={16} />
                          Baixar Anexo
                        </ButtonCustom>
                      )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </CustomDialogContent>
      </DialogContent>
      <DialogActions sx={{ marginRight: "10px" }}>
        <Button
          color="error"
          onClick={handleCloseDialog}
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

export { PurchaseRequestMessageDialog };
