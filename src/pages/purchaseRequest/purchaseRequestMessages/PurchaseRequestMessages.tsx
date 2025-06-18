import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import { FiDownload } from "react-icons/fi";

import { usePurchaseRequestMessagesService } from "../../../services/usePurchaseRequestMessagesService";
import IPurchaseRequestMessage from "../../../interfaces/IPurchaseRequestMessage";
import CustomTableSortLabel from "../../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import { BackdropCustom } from "../../../components/backdrop/Backdrop";
import { CustomMenuItem } from "../../../components/table/CustomMenuItem/CustomMenuItem";
import { CustomTableCell } from "../../../components/table/CustomTableCell/CustomTableCell";
import { CustomNoContentTableBody } from "../../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { useToastr } from "../../../hooks/useToastr";
import { ButtonCustom } from "../purchaseRequestAttachments/PurchaseRequestAttachments.styles";
import { PurchaseRequestMessageDialog } from "./purchaseRequestMessageDialog/PurchaseRequestMessageDialog";

interface IPurchaseRequestMessagesProps {
  title: string;
  purchaseRequestId: string;
  expanded?: boolean;
}

const MAX_FILE_SIZE_BYTES =
  Number(process.env.REACT_APP_MAX_FILE_SIZE_MB) * 1024 * 1024;

const PurchaseRequestMessages: React.FC<IPurchaseRequestMessagesProps> = ({
  purchaseRequestId,
  title,
  expanded = true,
}) => {
  const {
    listPurchaseRequestMessages,
    uploadPurchaseRequestMessageAttachment,
  } = usePurchaseRequestMessagesService();
  const toastr = useToastr();

  const [perPage] = useState(10);
  const [currentPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderField, setOrderField] = useState<string>("sequence");

  const [purchaseRequestMessages, setPurchseRequestMessages] = useState<
    IPurchaseRequestMessage[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [purchaseRequestMessageId, setPurchaseRequestMessageId] = useState<
    string | null
  >(null);
  const [purchaseRequestMessageEdit, setPurchaseRequestMessageEdit] =
    useState<IPurchaseRequestMessage | null>(null);

  const [
    dialogPurchaseRequestMessageOpen,
    setDialogPurchaseRequestMessageOpen,
  ] = useState(false);

  const handleListPurchaseRequestMessages = useCallback(async () => {
    setLoading(true);
    await listPurchaseRequestMessages(purchaseRequestId)
      .then((response) => {
        setPurchseRequestMessages(response);
      })
      .catch((error) => {
        toastr.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [purchaseRequestId]);

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

            await handleListPurchaseRequestMessages();
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

  const handleCloseDialogPurchaseRequestMessage = async () => {
    setPurchaseRequestMessageEdit(null);
    setPurchaseRequestMessageId(null);
    setDialogPurchaseRequestMessageOpen(false);
    await handleListPurchaseRequestMessages();
  };

  const handleOpenDialogPurchaseRequestMessage = () => {
    setDialogPurchaseRequestMessageOpen(true);
  };

  useEffect(() => {
    handleListPurchaseRequestMessages();
  }, []);

  return (
    <Paper sx={{ margin: "16px", marginBottom: "50px" }} elevation={6}>
      <Accordion elevation={0} defaultExpanded={expanded}>
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
                    field="itemSequence"
                    label="Seq. Item"
                    handleRequest={handleListPurchaseRequestMessages}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />

                  <CustomTableSortLabel
                    perPage={10}
                    currentPage={1}
                    orderField={orderField}
                    field="sequence"
                    label="Sequência"
                    handleRequest={handleListPurchaseRequestMessages}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="reason"
                    label="Motivo"
                    handleRequest={handleListPurchaseRequestMessages}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="sentDate"
                    label="Data"
                    handleRequest={handleListPurchaseRequestMessages}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="sentObservation"
                    label="Observação"
                    handleRequest={handleListPurchaseRequestMessages}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="returnDate"
                    label="Data de Retorno"
                    handleRequest={handleListPurchaseRequestMessages}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="returnObservation"
                    label="Retorno"
                    handleRequest={handleListPurchaseRequestMessages}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="file"
                    label="Anexo"
                    handleRequest={handleListPurchaseRequestMessages}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseRequestMessages.length > 0 &&
                  purchaseRequestMessages.map((purchaseRequestMessage) => {
                    return (
                      <TableRow
                        key={purchaseRequestMessage.id}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <CustomMenuItem
                          id={
                            purchaseRequestMessage.id
                              ? purchaseRequestMessage.id
                              : ""
                          }
                          handleSendAttachment={(e) =>
                            handleAttachmentChenge(e, purchaseRequestMessage.id)
                          }
                          handleToEdit={() => {
                            setPurchaseRequestMessageId(
                              purchaseRequestMessage.id
                            );
                            setPurchaseRequestMessageEdit(
                              purchaseRequestMessage
                            );
                            handleOpenDialogPurchaseRequestMessage();
                          }}
                        />

                        <CustomTableCell size="small" width={20}>
                          {purchaseRequestMessage.itemSequence}
                        </CustomTableCell>

                        <CustomTableCell size="small" width={20}>
                          {purchaseRequestMessage.sequence}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={150}>
                          {purchaseRequestMessage.reason}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={100}>
                          {moment(purchaseRequestMessage.sentDate).format(
                            "DD/MM/YYYY"
                          )}
                        </CustomTableCell>
                        <CustomTableCell
                          size="small"
                          width={400}
                          title={purchaseRequestMessage.sentObservation}
                        >
                          {purchaseRequestMessage.sentObservation}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={100}>
                          {purchaseRequestMessage.returnDate
                            ? moment(purchaseRequestMessage.returnDate).format(
                                "DD/MM/YYYY"
                              )
                            : ""}
                        </CustomTableCell>
                        <CustomTableCell
                          size="small"
                          width={400}
                          title={purchaseRequestMessage.returnObservation || ""}
                        >
                          {purchaseRequestMessage.returnObservation}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={100}>
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
                        </CustomTableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {purchaseRequestMessageEdit && (
              <PurchaseRequestMessageDialog
                dialogOpen={
                  dialogPurchaseRequestMessageOpen &&
                  purchaseRequestMessageId === purchaseRequestMessageEdit.id
                }
                handleOpenDialog={handleOpenDialogPurchaseRequestMessage}
                handleCloseDialog={handleCloseDialogPurchaseRequestMessage}
                purchaseRequestMessage={purchaseRequestMessageEdit}
                handleListPurchaseRequestMessages={
                  handleListPurchaseRequestMessages
                }
              />
            )}

            {purchaseRequestMessages.length === 0 && (
              <CustomNoContentTableBody>
                <p>Nenhuma mensagem encontrada</p>
              </CustomNoContentTableBody>
            )}
          </TableContainer>

          {loading && <BackdropCustom />}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default PurchaseRequestMessages;
