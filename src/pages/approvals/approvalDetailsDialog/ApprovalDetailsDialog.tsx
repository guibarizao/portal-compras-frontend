import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import EventIcon from "@mui/icons-material/Event";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import {
  Container,
  CustomDialogContent,
  Header,
} from "./ApprovalDetailsDialog.styled";
import {
  IApprovalOption,
  IApprovalTask,
} from "../../../interfaces/IApprovalTask";
import { useToastr } from "../../../hooks/useToastr";
import { useAuth } from "../../../hooks/auth";
import IFormError from "../../../interfaces/IFormError";
import getValidationError from "../../../util/getValidationError";
import { Form } from "../../../components/form/Form";
import { BackdropCustom } from "../../../components/backdrop/Backdrop";
import dayjs from "dayjs";
import { useApprovalsService } from "../../../services/useApprovalsService";

interface IApprovalDetailsProps {
  dialogOpen: boolean;
  handleCloseDialog: () => void;
  handleOpenDialog: (task: IApprovalTask) => void;
  approvalTask: IApprovalTask;
}

const ApprovalDetailsDialog: React.FC<IApprovalDetailsProps> = ({
  dialogOpen,
  handleCloseDialog,
  approvalTask,
}) => {
  const navigate = useNavigate();
  const toastr = useToastr();
  const { signOut, state: userState } = useAuth();
  const { updateAnsweredTasks } = useApprovalsService();

  const [approvalTaskId] = useState(approvalTask.id);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const handleSubmit = useCallback(
    async (option: IApprovalOption) => {
      setLoading(true);
      setFormErrors({});

      try {
        // const data = {
        //   message,
        // };
        // const schema = Yup.object().shape({
        //   message: Yup.string().required("Motivo é obrigatório"),
        // });
        // await schema.validate(data, {
        //   abortEarly: false,
        // });

        await updateAnsweredTasks({
          accessToken: userState.access_token,
          taskId: option.taskId,
          answerDate: dayjs().toISOString(),
          takenOptionId: option.id,
          note: message,
        })
          .then(() => {
            toastr.success("Resposta enviada com sucesso");
            handleCloseDialog();
            navigate("/approvals");
          })
          .catch((error) => {
            if (error.status === 401) {
              toastr.error("Sessão expirada, por favor faça login novamente");
              signOut();
              return;
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
    },
    [
      message,
      approvalTaskId,
      navigate,
      signOut,
      toastr,
      updateAnsweredTasks,
      userState.access_token,
      handleCloseDialog,
    ]
  );

  return (
    <Container
      open={dialogOpen}
      onClose={handleCloseDialog}
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
          <h1>Detalhes</h1>

          <Header>
            <Typography variant="h6" color="textPrimary" fontSize={16}>
              {approvalTask.box}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ display: "flex", alignItems: "center" }}
            >
              <EventIcon sx={{ marginRight: "4px", color: "#3fa110" }} />
              {dayjs(approvalTask.creationDate).format("DD/MM/YYYY HH:mm")}
            </Typography>
          </Header>

          <Typography
            variant="body1"
            color="textPrimary"
            sx={{ marginBottom: "16px" }}
          >
            {approvalTask.description}
          </Typography>

          <Box
            sx={{
              marginBottom: "16px",
              borderRadius: 2,
              fontSize: "1rem",
              color: "#222",
              "& h1, & h2, & h3": { marginTop: 2, marginBottom: 1 },
              "& p": { marginBottom: 1 },
              "& a": { color: "#1976d2" },
              overflowX: "auto",
            }}
          >
            <ReactMarkdown
              components={{
                a: (props) => (
                  <a {...props} target="_blank" rel="noopener noreferrer">
                    {props.children}
                  </a>
                ),
              }}
            >
              {approvalTask.content?.replaceAll("<br>", "  \n")}
            </ReactMarkdown>
          </Box>

          <Form>
            <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Motivo"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  helperText={formErrors.message}
                  error={!!formErrors.message}
                  autoFocus
                  multiline
                  rows={5}
                />
              </Grid>
            </Grid>
          </Form>
        </CustomDialogContent>
      </DialogContent>
      <DialogActions sx={{ marginRight: "10px" }}>
        <Button
          color="inherit"
          onClick={handleCloseDialog}
          sx={{ textTransform: "none" }}
        >
          Cancelar
        </Button>
        {approvalTask.options &&
          approvalTask.options.length > 0 &&
          approvalTask.options
            .sort((option) => {
              if (option.code === "Aprov") return 1;
              if (option.code === "Repro") return -1;
              return 0;
            })
            .map((option) => (
              <Button
                key={option.id}
                sx={{ marginLeft: "8px", textTransform: "none" }}
                variant="text"
                color={option.code === "Aprov" ? "primary" : "error"}
                onClick={() => handleSubmit(option)}
              >
                {option.description}
              </Button>
            ))}
      </DialogActions>

      {loading && <BackdropCustom />}
    </Container>
  );
};

export { ApprovalDetailsDialog };
