import { MoreVertOutlined } from "@mui/icons-material";
import {
  Fade,
  IconButton,
  Menu,
  MenuItem,
  TableCellProps,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { EventsDialog } from "../../eventsDialog/EventsDialog";
import { ConfirmationArea } from "../../confirmationArea/ConfirmationArea";
import IEvent from "../../../interfaces/IEvent";
import { Label, Notification, TableCellCustom } from "./CustomMenuItem.styled";
import returnTypesForAttachments from "../../../util/returnTypesForAttachment";

interface IMenuItemProps extends TableCellProps {
  id: string;
  handleToEdit?: ((id: string | null) => void) | null;
  handleToDelete?: (id: string) => void;
  handleToView?: (id: string) => void;
  handleToEvents?: (id: string) => Promise<IEvent[]>;
  handleToPrintOut?: (id: string) => void;
  handleToMessages?: (id: string) => void;
  handleToGenerateReport?: (id: string) => void;
  handleSendAttachment?: (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => Promise<void>;
  disableButton?: boolean;
  requestNumber?: string;
  isDraft?: boolean;
  notificationQuantity?: number;
  heaveMessages?: boolean;
}

const CustomMenuItem: React.FC<IMenuItemProps> = ({
  id,
  handleToEdit,
  handleToDelete,
  handleToView,
  handleToEvents,
  handleToPrintOut,
  handleToMessages,
  handleToGenerateReport,
  handleSendAttachment,
  disableButton = false,
  requestNumber,
  notificationQuantity,
  heaveMessages,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [dialogEventOpen, setDialogEventOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(true);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialogEvent = () => {
    setDialogEventOpen(false);
  };

  const handleOpenDialogEvent = () => {
    setDialogEventOpen(true);
  };

  const handleCloseDialogDelete = () => {
    setDialogDeleteOpen(false);
  };

  const handleOpenDialogDelete = () => {
    setDialogDeleteOpen(true);
  };

  return (
    <TableCellCustom size="small" id={id} sx={{ width: "10px" }}>
      {!!notificationQuantity && notificationQuantity > 0 && (
        <Notification>{notificationQuantity}</Notification>
      )}

      <IconButton
        disabled={disableButton}
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
      >
        <MoreVertOutlined fontSize="small" />
      </IconButton>
      <Menu
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open && menuOpen}
        onClose={handleClose}
        TransitionComponent={Fade}
        onClick={() => {
          setMenuOpen(true);
        }}
      >
        {handleToEdit && (
          <MenuItem
            onClick={() => {
              handleToEdit(id);
              handleClose();
            }}
            sx={{ fontSize: "0.875rem" }}
          >
            Editar
          </MenuItem>
        )}
        {handleToDelete && (
          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            onClick={() => {
              handleOpenDialogDelete();
              handleClose();
            }}
          >
            Excluir
          </MenuItem>
        )}
        {handleToView && (
          <MenuItem
            onClick={() => {
              handleToView(id);
              handleClose();
            }}
            sx={{ fontSize: "0.875rem" }}
          >
            Visualizar
          </MenuItem>
        )}
        {handleToEvents && (
          <MenuItem
            onClick={() => {
              handleToEvents(id);
              handleOpenDialogEvent();

              handleClose();
            }}
            sx={{ fontSize: "0.875rem" }}
          >
            Eventos
          </MenuItem>
        )}

        {handleToPrintOut && requestNumber && (
          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            onClick={() => {
              handleToPrintOut(id);
              handleClose();
            }}
          >
            Imprimir
          </MenuItem>
        )}

        {handleToMessages && heaveMessages && (
          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            onClick={() => {
              handleToMessages(id);
              handleClose();
            }}
          >
            Mensagens
          </MenuItem>
        )}

        {handleToGenerateReport && (
          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            onClick={() => {
              handleToGenerateReport(id);
              handleClose();
            }}
          >
            Imprimir
          </MenuItem>
        )}

        {handleSendAttachment && !disableButton && (
          <MenuItem sx={{ fontSize: "0.875rem" }}>
            <Label>
              <span>Enviar Arquivo</span>
              <input
                type="file"
                id="attachment"
                onChange={async (e) => {
                  setMenuOpen(false);
                  await handleSendAttachment(e, id);
                  setMenuOpen(true);
                  handleClose();
                }}
                accept={returnTypesForAttachments()}
              />
            </Label>
          </MenuItem>
        )}
      </Menu>
      <EventsDialog
        dialogOpen={dialogEventOpen}
        handleOpenDialog={handleOpenDialogEvent}
        handleCloseDialog={handleCloseDialogEvent}
        id={id}
        listEvents={handleToEvents}
      />

      {handleToDelete && (
        <ConfirmationArea
          dialogOpen={dialogDeleteOpen}
          id={id}
          title="Deseja realmente excluir o item?"
          message=""
          key={`dialog-${id}`}
          handleConfirmation={handleToDelete}
          deny={handleCloseDialogDelete}
        />
      )}
    </TableCellCustom>
  );
};

export { CustomMenuItem };
