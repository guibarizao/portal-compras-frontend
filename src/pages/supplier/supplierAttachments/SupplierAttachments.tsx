import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { useNavigate } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { FiDownload } from "react-icons/fi";
import moment from "moment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { ButtonCustom, Label } from "./SupplierAttachments.styles";
import { useToastr } from "../../../hooks/useToastr";
import { CustomMenuItem } from "../../../components/table/CustomMenuItem/CustomMenuItem";
import { useSuppliersAttachmentService } from "../../../services/useSuppliersAttachmentsService";
import ISuppliersAttachment from "../../../interfaces/ISuppliersAttachment";
import CustomTableSortLabel from "../../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import CustomTablePagination from "../../../components/table/CustomTablePagination/CustomTablePagination";
import { BackdropCustom } from "../../../components/backdrop/Backdrop";
import { CustomTableCell } from "../../../components/table/CustomTableCell/CustomTableCell";
import { CustomNoContentTableBody } from "../../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { GridFilterArea } from "../../../components/table/GridFilterArea/GridFilterArea";
import { FilterButtonGroup } from "../../../components/table/FilterButtonGroup/FilterButtonGroup";
import returnTypesForAttachments from "../../../util/returnTypesForAttachment";

const fields = [
  {
    field: "filename",
    label: "Nome do Arquivo",
  },
];

interface ISuppliersAttachmentsProps {
  title: string;
  supplierId: string;
  disableActions: boolean;
  handleSave: () => Promise<void>;
}

interface IParams {
  perPage: number;
  currentPage: number;
  orderField: string;
  orderDirection: "asc" | "desc";
  field?: string;
  value?: string;
  precision?: string;
  delay?: number;
}

const MAX_FILE_SIZE_BYTES =
  Number(process.env.REACT_APP_MAX_FILE_SIZE_MB) * 1024 * 1024;

const SupplierAttachments: React.FC<ISuppliersAttachmentsProps> = ({
  supplierId,
  disableActions,
  title,
  handleSave,
}) => {
  const navigate = useNavigate();
  const toastr = useToastr();
  const timeout = useRef<any>(null);

  const [supplierAttachments, setSupplierAttachments] = useState<
    ISuppliersAttachment[]
  >([]);

  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderField, setOrderField] = useState<string>("created_at");
  const [loading, setLoading] = useState(false);

  const [gridFilterAreaOpen, setGridFilterAreaOpen] = useState(false);
  const [filterField, setFilterField] = useState<string>("");
  const [filterPrecision, setFilterPrecision] = useState<string>("equal");
  const [filterValue, setFilterValue] = useState<string>("");
  const [delay, setDelay] = useState(0);

  const {
    listAllSuppliersAttachments,
    deleteSuppliersAttachment,
    uploadSuppliersAttachment,
    updateSuppliersAttachment,
  } = useSuppliersAttachmentService();

  const handlePagination = async (
    perPage: number,
    currentPage: number,
    orderField: string,
    orderDirection: "asc" | "desc"
  ) => {
    handleListAll({
      perPage,
      currentPage,
      orderField,
      orderDirection,
      field: filterField,
      value: filterValue,
      precision: filterPrecision,
      delay: 0,
    });
  };

  const handleListAll = async ({
    perPage,
    currentPage,
    orderField,
    orderDirection,
    field,
    value,
    precision,
    delay,
  }: IParams) => {
    let url = `perPage=${perPage}&currentPage=${
      currentPage + 1
    }&orderBy=${orderField}&orderDirection=${orderDirection}`;

    if (field && value && precision) {
      url =
        url +
        `&filterField=${field}&filterValue=${value}&precision=${precision}`;
    }

    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoading(true);
      await listAllSuppliersAttachments(supplierId, url)
        .then((response) => {
          if (response?.data?.length > 0) {
            setSupplierAttachments(response.data);
            setTotalRows(response.totalRows);
            setLoading(false);
          } else {
            setSupplierAttachments([]);
            setTotalRows(0);
            setPerPage(10);
            setCurrentPage(0);
            setLoading(false);
          }
        })
        .catch((error) => {
          toastr.error(error?.message || "Contate a equipe de suporte");
        })
        .finally(() => {
          setLoading(false);
        });
    }, delay || 0);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
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

        await uploadSuppliersAttachment(supplierId, data)
          .then(async () => {
            toastr.success("Anexo adicionado com sucesso");
            e.target.value = "";

            const field = filterField;
            const value = filterValue;
            const precision = filterPrecision;

            await handleListAll({
              perPage,
              currentPage,
              orderField,
              orderDirection,
              field,
              value,
              precision,
              delay,
            });
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
    [
      navigate,
      handleSave,
      supplierId,
      filterField,
      filterPrecision,
      filterValue,
    ]
  );

  const handleAttachmentChangeUpdate = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, supplierAttachmentId: string) => {
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

        await updateSuppliersAttachment(supplierAttachmentId, data)
          .then(async () => {
            toastr.success("Anexo adicionado com sucesso");
            e.target.value = "";

            const field = filterField;
            const value = filterValue;
            const precision = filterPrecision;

            await handleListAll({
              perPage,
              currentPage,
              orderField,
              orderDirection,
              field,
              value,
              precision,
              delay,
            });
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
    [navigate, supplierId, filterField, filterPrecision, filterValue]
  );

  const handleDeleteSupplierAttachment = useCallback(
    async (supplierAttachmentId: string) => {
      const field = filterField;
      const value = filterValue;
      const precision = filterPrecision;

      setLoading(true);
      await deleteSuppliersAttachment(supplierAttachmentId)
        .then(() => {
          toastr.success("Anexo deletado com sucesso");

          handleListAll({
            perPage,
            currentPage,
            orderField,
            orderDirection,
            field,
            value,
            precision,
            delay,
          });
        })
        .catch((error) => {
          toastr.error(error?.message || "Contate a equipe de suporte");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [filterField, filterPrecision, filterValue, delay]
  );

  useEffect(() => {
    handlePagination(perPage, 0, orderField, "asc");
  }, [orderField]);

  useEffect(() => {
    const field = filterField;
    const value = filterValue;
    const precision = filterPrecision;

    handleListAll({
      perPage,
      currentPage,
      orderField,
      orderDirection,
      field,
      value,
      precision,
      delay,
    });
  }, [filterField, filterPrecision, filterValue, delay]);

  const handleTextFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setTotalRows(0);
    setCurrentPage(0);
    setDelay(500);
  };

  return (
    <Paper sx={{ margin: "16px" }} elevation={6}>
      <Accordion elevation={0} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ marginLeft: "2px" }}
        >
          {title}
        </AccordionSummary>
        <AccordionDetails>
          <FilterButtonGroup>
            <Tooltip title="Filtros" placement="top">
              <IconButton
                onClick={() => setGridFilterAreaOpen(!gridFilterAreaOpen)}
                size="small"
                color="primary"
                style={{ alignItems: "flex-end" }}
              >
                {gridFilterAreaOpen ? (
                  <FilterAltOffOutlinedIcon />
                ) : (
                  <FilterAltOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip
              title={`${disableActions ? "" : "Adicionar anexo"}`}
              placement="left"
            >
              <Label disabled={!!disableActions}>
                <AddOutlinedIcon />
                <input
                  type="file"
                  id="attachment"
                  onChange={handleAttachmentChange}
                  accept={returnTypesForAttachments()}
                  disabled={disableActions}
                  onClick={() => handleSave()}
                ></input>
              </Label>
            </Tooltip>
          </FilterButtonGroup>

          {gridFilterAreaOpen && (
            <GridFilterArea container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="select-filter">Filtrar por</InputLabel>
                  <Select
                    label="Filtrar Por"
                    value={`${filterField}`}
                    onChange={(e) => {
                      setFilterField(`${e.target.value}`);
                    }}
                  >
                    {fields.map((filter) => {
                      return (
                        <MenuItem key={filter.field} value={filter.field}>
                          {filter.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Precisão</InputLabel>
                  <Select
                    label="Precisão"
                    value={`${filterPrecision}`}
                    onChange={(e) => {
                      setFilterPrecision(`${e.target.value}`);
                    }}
                  >
                    <MenuItem key={"equal"} value={"equal"}>
                      Igual
                    </MenuItem>
                    <MenuItem key={"containing"} value={"containing"}>
                      Contendo
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField
                  fullWidth
                  label="Valor a filtrar"
                  placeholder="Valor a filtrar"
                  value={filterValue}
                  onChange={handleTextFilterChange}
                  size="small"
                />
              </Grid>
            </GridFilterArea>
          )}

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
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="description"
                    label="Descrição"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />

                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="attachment"
                    label="Anexo"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="filename"
                    label="Nome do arquivo"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="created_at"
                    label="Data de envio"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {supplierAttachments.length > 0 &&
                  supplierAttachments.map((supplierAttachment) => {
                    return (
                      <TableRow
                        key={supplierAttachment.id}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <CustomMenuItem
                          id={
                            supplierAttachment.id ? supplierAttachment.id : ""
                          }
                          handleSendAttachment={handleAttachmentChangeUpdate}
                          handleToDelete={handleDeleteSupplierAttachment}
                          disableButton={disableActions}
                        />
                        <CustomTableCell
                          size="small"
                          width={450}
                          title={supplierAttachment.description}
                        >
                          {supplierAttachment.description}
                        </CustomTableCell>

                        <CustomTableCell size="small" width={150}>
                          {supplierAttachment.file.length > 15 && (
                            <ButtonCustom
                              href={supplierAttachment.file}
                              target="_blank"
                            >
                              <FiDownload size={16} />
                              Baixar Anexo
                            </ButtonCustom>
                          )}
                        </CustomTableCell>
                        <CustomTableCell
                          size="small"
                          width={450}
                          title={supplierAttachment.filename}
                        >
                          {supplierAttachment.filename}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={130}>
                          {moment(supplierAttachment.updated_at).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </CustomTableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {supplierAttachments.length === 0 && (
              <CustomNoContentTableBody>
                <p>Nenhum anexo encontrado</p>
              </CustomNoContentTableBody>
            )}
          </TableContainer>
          <CustomTablePagination
            totalRows={totalRows}
            currentPage={currentPage}
            perPage={perPage}
            handleRequest={handlePagination}
            setPerPage={setPerPage}
            setCurrentPage={setCurrentPage}
            orderField={orderField}
            orderDirection={orderDirection}
          />

          {loading && <BackdropCustom />}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default SupplierAttachments;
