import { forwardRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { useAuth } from "../../hooks/auth";
import { Container } from "./AppFooter.styled";
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AppFooter = () => {
  const {
    state: userState,
    currentHeadOffice,
    changeCurrentHeadOffice,
  } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <Container logged={userState.logged}>
      <p onClick={() => handleClickOpen()}>{currentHeadOffice?.name || ""}</p>

      {!!userState.headOffices && userState.headOffices.length > 0 && (
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle style={{ margin: "8px" }}>
            {"Selecione a empresa"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {userState.headOffices.map((headOffice) => {
                return (
                  <Button
                    key={headOffice?.id}
                    color={
                      headOffice?.id === currentHeadOffice?.id
                        ? "primary"
                        : "inherit"
                    }
                    onClick={() => {
                      changeCurrentHeadOffice(headOffice?.id || "");
                    }}
                    style={{ textAlign: "left" }}
                  >
                    {`${headOffice?.code} - ${headOffice?.name}`}{" "}
                    {headOffice?.id === currentHeadOffice?.id && (
                      <TaskAltIcon style={{ marginLeft: "8px" }} />
                    )}
                  </Button>
                );
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} style={{ textTransform: "none" }}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AppFooter;
