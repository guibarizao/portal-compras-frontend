import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useToastr } from "../../../hooks/useToastr";
import { CustomMenuItem } from "../../../components/table/CustomMenuItem/CustomMenuItem";
import CustomTableSortLabel from "../../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import { BackdropCustom } from "../../../components/backdrop/Backdrop";
import { CustomTableCell } from "../../../components/table/CustomTableCell/CustomTableCell";
import { useStockRequestEventsService } from "../../../services/useStockRequestEventsService";
import IEvent from "../../../interfaces/IEvent";
import { CustomNoContentTableBody } from "../../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";

interface IStockRequestEventsProps {
  title: string;
  stockRequestId: string;
}

const StockRequestEvents: React.FC<IStockRequestEventsProps> = ({
  stockRequestId,
  title,
}) => {
  const toastr = useToastr();

  const [perPage] = useState(10);
  const [currentPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderField, setOrderField] = useState<string>("date");

  const [stockRequestEvent, setStockRequestEvents] = useState<IEvent[]>([]);

  const [loading, setLoading] = useState(false);

  const { listStockRequestsEventsById } = useStockRequestEventsService();

  const handleListAll = async () => {
    setLoading(true);
    await listStockRequestsEventsById(stockRequestId)
      .then((response) => {
        setStockRequestEvents(response);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleListAll();
  }, []);

  return (
    <Paper sx={{ margin: "16px", marginBottom: "50px" }} elevation={6}>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ marginLeft: "2px" }}
        >
          {title}
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer
            sx={{
              minHeight: "250px",
            }}
          >
            <Table
              sx={{
                padding: "16px",
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      borderBottom: 1,
                      borderColor: "#E5E5E5",
                    },
                  }}
                >
                  <TableCell size="small" width={60}>
                    Ações
                  </TableCell>

                  <CustomTableSortLabel
                    perPage={10}
                    currentPage={1}
                    orderField={orderField}
                    field="message"
                    label="Mensagem"
                    handleRequest={handleListAll}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="erpStatusDescription"
                    label="Status ERP"
                    handleRequest={handleListAll}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="date"
                    label="Data"
                    handleRequest={handleListAll}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {stockRequestEvent.length > 0 &&
                  stockRequestEvent.map((stockRequestEvent) => {
                    return (
                      <TableRow
                        key={stockRequestEvent.id}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <CustomMenuItem
                          id={stockRequestEvent.id ? stockRequestEvent.id : ""}
                          disableButton={true}
                        />

                        <CustomTableCell
                          size="small"
                          width={800}
                          title={stockRequestEvent.message}
                        >
                          {stockRequestEvent.message}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={200}>
                          {stockRequestEvent.erpStatusDescription}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={150}>
                          {moment(stockRequestEvent.date).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </CustomTableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {stockRequestEvent.length === 0 && (
              <CustomNoContentTableBody>
                <p>Nenhum evento encontrado</p>
              </CustomNoContentTableBody>
            )}
          </TableContainer>

          {loading && <BackdropCustom />}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default StockRequestEvents;
