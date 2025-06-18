import React, { useCallback, useEffect, useState } from "react";
import { Button, DialogActions, DialogContent } from "@mui/material";

import moment from "moment";
import {
  Container,
  CustomDialogContent,
  EventCard,
  NoneEvents,
} from "./EventsDialog.styled";
import { BackdropCustom } from "../backdrop/Backdrop";
import IEvent from "../../interfaces/IEvent";

interface IEventsDialogProps {
  dialogOpen: boolean;
  handleCloseDialog: () => void;
  handleOpenDialog: () => void;
  id: string;
  listEvents: ((id: string) => Promise<IEvent[]>) | undefined;
}

const EventsDialog: React.FC<IEventsDialogProps> = ({
  dialogOpen,
  handleCloseDialog,
  handleOpenDialog,
  id,
  listEvents,
}) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const handleListEvents = useCallback(async () => {
    if (listEvents) {
      setEventsLoading(true);
      await listEvents(id)
        .then((result) => {
          setEvents(result ?? []);
        })
        .catch()
        .finally(() => {
          setEventsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      handleListEvents();
    }
  }, [dialogOpen]);

  return (
    <>
      {eventsLoading ? (
        <BackdropCustom />
      ) : (
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
              <h1>Histórico de alteração dos status</h1>

              {events?.length > 0 ? (
                events?.map((event) => {
                  return (
                    <EventCard key={event.id}>
                      <div>
                        <strong>
                          {event?.erpStatusDescription
                            ? event.erpStatusDescription
                            : ""}
                        </strong>
                        <span>
                          {moment(event.date).format("DD/MM/YYYY HH:mm")}
                        </span>
                      </div>
                      <span>{event.message}</span>
                    </EventCard>
                  );
                })
              ) : (
                <NoneEvents>
                  <span>Nenhum evento para listar...</span>
                </NoneEvents>
              )}
            </CustomDialogContent>
          </DialogContent>
          <DialogActions sx={{ marginRight: "10px" }}>
            <Button
              color="info"
              onClick={handleCloseDialog}
              sx={{ textTransform: "none" }}
            >
              Fechar
            </Button>
          </DialogActions>
        </Container>
      )}
    </>
  );
};

export { EventsDialog };
