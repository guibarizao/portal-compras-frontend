import { DialogActions } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { ButtonCustom, DialogContentCustom } from "./ConfirmationArea.styled";

interface IProps {
  id: string;
  title: string;
  message: string;
  dialogOpen: boolean;
  deny: () => void;
  handleConfirmation: (id: string) => void;
}

const ConfirmationArea = ({
  id,
  title,
  message,
  dialogOpen,
  handleConfirmation,
  deny,
}: IProps) => {
  return (
    <Dialog open={dialogOpen}>
      <DialogContentCustom sx={{ width: "auto" }}>
        <h1>{title}</h1>

        <p>{message}</p>
      </DialogContentCustom>
      <DialogActions>
        <ButtonCustom onClick={deny} color="error">
          Cancelar
        </ButtonCustom>
        <ButtonCustom
          onClick={() => {
            handleConfirmation(id);
            deny();
          }}
          autoFocus
        >
          Confirmar
        </ButtonCustom>
      </DialogActions>
    </Dialog>
  );
};

export { ConfirmationArea };
