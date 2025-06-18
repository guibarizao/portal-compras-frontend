import { useCallback, useEffect, useRef, useState } from "react";
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
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { usePurchaseRequestItemService } from "../../../services/usePurchaseRequestItemService";
import { useToastr } from "../../../hooks/useToastr";
import IPurchaseRequestItem from "../../../interfaces/IPurchaseRequestItem";
import CustomTableSortLabel from "../../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import { CustomMenuItem } from "../../../components/table/CustomMenuItem/CustomMenuItem";
import CustomTablePagination from "../../../components/table/CustomTablePagination/CustomTablePagination";
import useFormatIntegerDecimalValues from "../../../util/useFormatIntegerDecimalValues";
import { CustomTableCell } from "../../../components/table/CustomTableCell/CustomTableCell";
import { BackdropCustom } from "../../../components/backdrop/Backdrop";
import { CustomNoContentTableBody } from "../../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { GridFilterArea } from "../../../components/table/GridFilterArea/GridFilterArea";
import { FilterButtonGroup } from "../../../components/table/FilterButtonGroup/FilterButtonGroup";
import { useSessionStorage } from "../../../services/useSessionStorage";
import { InfoProduct, Span } from "./PurchaseRequestItems.styles";

const fields = [
  {
    field: "productCode",
    label: "Cod. Produto/Serviço",
  },
  {
    field: "productDescription",
    label: "Descrição Produto/Serviço",
  },
];

interface IPurchaseRequestItemsProps {
  title: string;
  purchaseRequestId: string;
  purchaseRequestDisableEdit: boolean;
  expanded?: boolean;
  handleSubmitGeneralData: () => void;
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

const PurchaseRequestItems: React.FC<IPurchaseRequestItemsProps> = ({
  purchaseRequestId,
  purchaseRequestDisableEdit,
  title,
  expanded = true,
  handleSubmitGeneralData,
}) => {
  const navigate = useNavigate();
  const toastr = useToastr();
  const timeout = useRef<any>(null);
  const sessionStorage = useSessionStorage();

  const { formatIntegerDecimalValues } = useFormatIntegerDecimalValues();

  const [purchaseRequestItems, setPurchaseRequestItems] = useState<
    IPurchaseRequestItem[]
  >([]);

  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderField, setOrderField] = useState<string>("sequence");
  const [totalValue, setTotalValue] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  const [gridFilterAreaOpen, setGridFilterAreaOpen] = useState(false);
  const [filterField, setFilterField] = useState<string>("");
  const [filterPrecision, setFilterPrecision] = useState<string>("equal");
  const [filterValue, setFilterValue] = useState<string>("");
  const [delay, setDelay] = useState(0);

  const {
    listAllPurchaseRequestItems,
    deletePurchaseRequestItem,
    listTotalValueByPurchaseRequestId,
  } = usePurchaseRequestItemService();

  const handleToPurchaseRequestItem = useCallback(
    (id: string | null) => {
      if (!!id) {
        navigate(
          `/purchase-request-item/${id}?purchaseRequestId=${purchaseRequestId}`
        );
      } else {
        if (purchaseRequestItems.length > 0) {
          const {
            costCenter,
            project,
            wallet,
            estimatedDate,
            accountingAccount,
          } = purchaseRequestItems[0];

          const suggestedData = {
            costCenter,
            project,
            wallet,
            estimatedDate,
            accountingAccount,
          };

          sessionStorage.setItem(
            "@PORTAL-COMPRAS:suggestedData",
            suggestedData
          );
        } else {
          sessionStorage.setItem("@PORTAL-COMPRAS:suggestedData", null);
        }

        navigate(
          `/purchase-request-item?purchaseRequestId=${purchaseRequestId}`
        );
      }
    },
    [navigate, purchaseRequestItems]
  );

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
      await listAllPurchaseRequestItems(purchaseRequestId, url)
        .then((response) => {
          if (response?.data?.length > 0) {
            setPurchaseRequestItems(response.data);
            setTotalRows(response.totalRows);
            setLoading(false);
          } else {
            setPurchaseRequestItems([]);
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

  const handleListTotalValue = async () => {
    await listTotalValueByPurchaseRequestId(purchaseRequestId)
      .then((response) => {
        setTotalValue(response.totalValue);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteRequestItem = useCallback(
    async (requestItemId: string) => {
      const field = filterField;
      const value = filterValue;
      const precision = filterPrecision;

      setLoading(true);
      await deletePurchaseRequestItem(requestItemId)
        .then(() => {
          toastr.success("Item deletado com sucesso");

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

  useEffect(() => {
    handleListTotalValue();
  }, []);

  return (
    <Paper sx={{ margin: "16px" }} elevation={6}>
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
            <Tooltip title="Adicionar itens" placement="top">
              <IconButton
                onClick={() => {
                  handleSubmitGeneralData();
                  handleToPurchaseRequestItem(null);
                }}
                size="small"
                color="primary"
                style={{ alignItems: "flex-end" }}
                disabled={purchaseRequestDisableEdit}
              >
                <AddIcon />
              </IconButton>
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
                  <CustomTableCell size="small" width={60}>
                    Ações
                  </CustomTableCell>

                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="sequence"
                    label="Seq."
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="productCode"
                    label="Cód. Produto/Serviço"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="productDescription"
                    label="Descrição Produto/Serviço"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="quantity"
                    label="Quantidade"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="purchaseQuantity"
                    label="Estoque disponível"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="costCenterCode"
                    label="Cód. Centro de Custo"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="costCenterDescription"
                    label="Descrição Centro de Custo"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="accountingAccountCode"
                    label="Cód. Conta Contábil"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="accountingAccountDescription"
                    label="Descrição Conta Contábil"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="unitPrice"
                    label="Preço Unitário"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="comments"
                    label="Observação"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {PurchaseRequestItems.length > 0 &&
                  purchaseRequestItems.map((purchaseRequestItem) => {
                    return (
                      <TableRow
                        key={purchaseRequestItem.id}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <CustomMenuItem
                          id={
                            purchaseRequestItem.id ? purchaseRequestItem.id : ""
                          }
                          handleToEdit={handleToPurchaseRequestItem}
                          handleToDelete={
                            !purchaseRequestDisableEdit
                              ? handleDeleteRequestItem
                              : undefined
                          }
                        />

                        <CustomTableCell size="small" width={30}>
                          {purchaseRequestItem.sequence}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={150}>
                          {purchaseRequestItem.product?.code}
                        </CustomTableCell>
                        <CustomTableCell
                          size="small"
                          width={250}
                          title={purchaseRequestItem.product?.description}
                        >
                          {purchaseRequestItem.product?.description}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={100}>
                          {formatIntegerDecimalValues(
                            purchaseRequestItem.quantity,
                            "ALL"
                          )}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={150}>
                          {purchaseRequestItem.product?.stockQuantity &&
                            `${formatIntegerDecimalValues(
                              purchaseRequestItem.product?.stockQuantity,
                              "ALL"
                            )} - ${purchaseRequestItem.product.unitOfMeasure}`}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={100}>
                          {purchaseRequestItem.costCenter?.code}
                        </CustomTableCell>
                        <CustomTableCell
                          size="small"
                          width={200}
                          title={purchaseRequestItem.costCenter?.description}
                        >
                          {purchaseRequestItem.costCenter?.description}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={100}>
                          {purchaseRequestItem.accountingAccount?.code}
                        </CustomTableCell>
                        <CustomTableCell
                          size="small"
                          width={200}
                          title={
                            purchaseRequestItem.accountingAccount?.description
                          }
                        >
                          {purchaseRequestItem.accountingAccount?.description}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={100}>
                          {`R$ ${formatIntegerDecimalValues(
                            purchaseRequestItem.unitPrice || 0,
                            "DECIMAL"
                          )}`}
                        </CustomTableCell>
                        <CustomTableCell
                          size="small"
                          width={200}
                          title={purchaseRequestItem.comments}
                        >
                          {purchaseRequestItem.comments}
                        </CustomTableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {purchaseRequestItems.length === 0 && (
              <CustomNoContentTableBody>
                <p>Nenhum item encontrado</p>
              </CustomNoContentTableBody>
            )}
          </TableContainer>

          <InfoProduct>
            <Span>
              Valor Total: R${" "}
              {formatIntegerDecimalValues(totalValue || 0, "DECIMAL")}
            </Span>
          </InfoProduct>
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

export default PurchaseRequestItems;
