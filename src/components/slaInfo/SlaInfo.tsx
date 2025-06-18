import styled from "styled-components";

import { getSLA } from "../../util/getSLA";
import moment from "moment";
import { CustomTableCell } from "../table/CustomTableCell/CustomTableCell";
import { EventsDialog } from "../eventsDialog/EventsDialog";
import IEvent from "../../interfaces/IEvent";
import { useState } from "react";

interface ISlaProps {
  closed_at: Date | string;
  limitDays: number;
  isFinished: boolean;
  handleEvents: (id: string) => Promise<IEvent[]>;
  id: string;
}

const Span = styled.span<{ $slaColor: string }>`
  background-color: ${({ $slaColor }) => $slaColor};
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  width: 100%;
  display: inline-block;
  box-sizing: border-box;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;

  cursor: pointer;

  transition: background-color 0.2s;
  &:hover {
    background-color: ${({ $slaColor }) => {
      const color = $slaColor;
      return color === "#3F8ECE"
        ? "#2a6f9c"
        : color === "#FF8E00"
        ? "#cc6b00"
        : color === "#22B74F"
        ? "#1a8f3d"
        : color === "#DC2525"
        ? "#b21f1f"
        : color;
    }};
  }
`;

export const SlaInfo: React.FC<{ data: ISlaProps }> = ({ data }) => {
  const [dialogEventOpen, setDialogEventOpen] = useState(false);

  const slaInfo = getSLA({
    closed_at: moment(data.closed_at).toDate(),
    limitDays: data.limitDays,
    isFinished: data.isFinished,
  });

  const handleCloseDialogEvent = () => {
    setDialogEventOpen(false);
  };

  const handleOpenDialogEvent = () => {
    setDialogEventOpen(true);
  };

  const handleEvents = async (id: string): Promise<IEvent[]> => {
    if (data.handleEvents) {
      return data.handleEvents(id);
    }
    return Promise.resolve([]);
  };

  return (
    <>
      <CustomTableCell size="small" width={300} align="center">
        <Span
          $slaColor={slaInfo.slaColor}
          onClick={() => {
            handleEvents(data.id || "");
            handleOpenDialogEvent();
          }}
        >
          {data.closed_at
            ? `${moment(slaInfo.expiresIn).format("DD/MM/YYYY HH:mm:ss")}`
            : "Sem SLA"}
        </Span>
      </CustomTableCell>
      <EventsDialog
        dialogOpen={dialogEventOpen}
        handleOpenDialog={handleOpenDialogEvent}
        handleCloseDialog={handleCloseDialogEvent}
        id={data.id}
        listEvents={handleEvents}
      />
    </>
  );
};
