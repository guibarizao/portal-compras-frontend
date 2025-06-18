import { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
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
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import CustomTableSortLabel from "../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import CustomTablePagination from "../../components/table/CustomTablePagination/CustomTablePagination";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { useToastr } from "../../hooks/useToastr";
import { CustomMenuItem } from "../../components/table/CustomMenuItem/CustomMenuItem";
import { CustomTableCell } from "../../components/table/CustomTableCell/CustomTableCell";
import { CustomNoContentTableBody } from "../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { GridFilterArea } from "../../components/table/GridFilterArea/GridFilterArea";
import { FilterButtonGroup } from "../../components/table/FilterButtonGroup/FilterButtonGroup";
import { useAuth } from "../../hooks/auth";
import { useProductRequestService } from "../../services/useProductRequestService";
import IProductRequest from "../../interfaces/IProductRequest";
import IEvent from "../../interfaces/IEvent";
import { useProductRequestEventsService } from "../../services/useProductRequestEventsService";
import { ButtonOutlined } from "../../components/buttonOutlined/ButtonOutlined";
import { SlaInfo } from "../../components/slaInfo/SlaInfo";
import IProductRequestErpStatus from "../../interfaces/IProductRequestErpStatus";
import { useProductRequestErpStatusService } from "../../services/useProductRequestErpStatusService";

const fields = [
  {
    field: "protocol",
    label: "Protocolo",
  },
  {
    field: "description",
    label: "Descrição do Produto/Serviço",
  },
  {
    field: "details",
    label: "Observação Complementar",
  },
  {
    field: "productRequestErpStatusDescription",
    label: "Situação",
  },
];

const STORAGE_KEY = "@PORTAL-COMPRAS:productRequestsFilters";

const getInitialState = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed[key] !== undefined ? parsed[key] : defaultValue;
  }
  return defaultValue;
};

interface IProductRequestsProps {
  title: string;
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
  status?: number[];
  justMyDocuments: boolean;
}

const ProductRequests: React.FC<IProductRequestsProps> = ({ title }) => {
  window.document.title = title;

  const { listAllProductRequests } = useProductRequestService();
  const { listProductRequestEvents } = useProductRequestEventsService();
  const { listProductRequestErpStatusDynamically } =
    useProductRequestErpStatusService();

  const toastr = useToastr();
  const timeout = useRef<any>(null);
  const navigate = useNavigate();
  const [productRequests, setProductRequests] = useState<IProductRequest[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(() => getInitialState("perPage", 10));
  const [currentPage, setCurrentPage] = useState(() =>
    getInitialState("currentPage", 0)
  );
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">(() =>
    getInitialState("orderDirection", "desc")
  );
  const [orderField, setOrderField] = useState<string>(() =>
    getInitialState("orderField", "closed_at")
  );
  const [loading, setLoading] = useState(false);

  const [gridFilterAreaOpen, setGridFilterAreaOpen] = useState(() =>
    getInitialState("gridFilterAreaOpen", false)
  );
  const [filterField, setFilterField] = useState<string>(() =>
    getInitialState("filterField", "")
  );
  const [filterPrecision, setFilterPrecision] = useState<string>(() =>
    getInitialState("filterPrecision", "equal")
  );
  const [filterValue, setFilterValue] = useState<string>(() =>
    getInitialState("filterValue", "")
  );

  const [productRequestErpStatus, setProductRequestErpStatus] = useState<
    IProductRequestErpStatus[] | []
  >([]);

  const [selectedProductRequestErpStatus, setSelectedProductRequestErpStatus] =
    useState<IProductRequestErpStatus[]>(() => {
      return getInitialState("selectedProductRequestErpStatus", []);
    });

  const [justMyDocuments, setJustMyDocuments] = useState(() => {
    return getInitialState("justMyDocuments", false);
  });

  const [delay, setDelay] = useState(0);

  const { signOut } = useAuth();

  const handleToProductsRequests = useCallback(
    (id: string | null) => {
      !!id ? navigate(`/product-request/${id}`) : navigate("/product-request");
    },
    [navigate]
  );

  const handlePagination = useCallback(
    async (
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
        status: selectedProductRequestErpStatus.map((s) => s.id),
        justMyDocuments,
      });
    },
    [
      filterField,
      filterValue,
      filterPrecision,
      selectedProductRequestErpStatus,
      justMyDocuments,
    ]
  );

  const handleListProductRequestErpStatus = useCallback(async () => {
    setLoading(true);
    const url = `perPage=100&currentPage=1&orderBy=description&orderDirection=asc&filter=`;

    await listProductRequestErpStatusDynamically(url)
      .then((response) => {
        const responseErpStatusFiltered = response.data.filter(
          (responseItem) =>
            !selectedProductRequestErpStatus.some((selectedItem) =>
              selectedItem.id === responseItem.id ? true : false
            )
        );

        const responseErpStatus = responseErpStatusFiltered.map((status) => {
          return {
            id: status.id,
            description: status.description ? status.description : "",
          };
        });

        setProductRequestErpStatus(responseErpStatus);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedProductRequestErpStatus]);

  const handleListAll = async ({
    perPage,
    currentPage,
    orderField,
    orderDirection,
    field,
    value,
    precision,
    delay,
    status,
    justMyDocuments,
  }: IParams) => {
    let url = `perPage=${perPage}&currentPage=${
      currentPage + 1
    }&orderBy=${orderField}&orderDirection=${orderDirection}`;

    if (field && value && precision) {
      url =
        url +
        `&filterField=${field}&filterValue=${value}&precision=${precision}`;
    }

    if (status && status.length > 0) {
      url = url + `&status=${status.join(",")}`;
    }

    url = url + `&justMyDocuments=${justMyDocuments}`;

    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoading(true);
      await listAllProductRequests(url)
        .then((response) => {
          if (response?.data?.length > 0) {
            setProductRequests(response.data);
            setTotalRows(response.totalRows);
            setLoading(false);
          } else {
            setProductRequests([]);
            setTotalRows(0);
            setPerPage(10);
            setCurrentPage(0);
            setLoading(false);
          }
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");
        })
        .finally(() => {
          setLoading(false);
        });
    }, delay || 0);
  };

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
      status: selectedProductRequestErpStatus.map((status) => status.id),
      justMyDocuments,
    });
  }, [
    filterField,
    filterPrecision,
    filterValue,
    delay,
    selectedProductRequestErpStatus,
    justMyDocuments,
  ]);

  useEffect(() => {
    const filters = {
      filterField,
      filterPrecision,
      filterValue,
      gridFilterAreaOpen,
      currentPage,
      perPage,
      orderField,
      orderDirection,
      selectedProductRequestErpStatus,
      justMyDocuments,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [
    filterField,
    filterPrecision,
    filterValue,
    gridFilterAreaOpen,
    currentPage,
    perPage,
    orderField,
    orderDirection,
    selectedProductRequestErpStatus,
    justMyDocuments,
  ]);

  const handleTextFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setTotalRows(0);
    setCurrentPage(0);
    setDelay(500);
  };

  const handleClearFilters = () => {
    setFilterField("");
    setFilterPrecision("equal");
    setFilterValue("");
    setCurrentPage(0);
    setPerPage(10);
    setOrderField("closed_at");
    setOrderDirection("desc");
    setSelectedProductRequestErpStatus([]);
    setJustMyDocuments(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleToProductRequestEvents = async (
    id: string
  ): Promise<IEvent[]> => {
    return await listProductRequestEvents(id);
  };

  const handleChangeProductRequestErpStatus = (
    _: React.ChangeEvent<{}>,
    values: IProductRequestErpStatus[]
  ) => {
    setCurrentPage(0);
    setSelectedProductRequestErpStatus(values);
  };

  const handleChengeOnlyMyDocuments = useCallback((checked: boolean) => {
    setJustMyDocuments(checked);
  }, []);

  useEffect(() => {
    handleListProductRequestErpStatus();
  }, [selectedProductRequestErpStatus]);

  return (
    <>
      <TitleContainer>
        <h1>Cadastro de Produtos/Serviços</h1>
      </TitleContainer>
      <PageCard>
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

          <Tooltip title="Criar produto" placement="top">
            <IconButton
              onClick={() => handleToProductsRequests(null)}
              size="small"
              color="primary"
              style={{ alignItems: "flex-end" }}
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

            <Grid item xs={12} md={6}>
              <Autocomplete
                style={{ width: "100%" }}
                multiple
                id="status-outlined"
                options={productRequestErpStatus}
                getOptionLabel={(option) => option.description}
                value={selectedProductRequestErpStatus}
                filterSelectedOptions
                size="small"
                onChange={handleChangeProductRequestErpStatus}
                renderInput={(params) => {
                  return <TextField {...params} label="Status do cadastro" />;
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      onClick={() =>
                        handleChengeOnlyMyDocuments(!justMyDocuments)
                      }
                    />
                  }
                  label="Apenas meus documentos"
                  checked={justMyDocuments}
                />
              </FormGroup>
            </Grid>

            <Grid
              item
              xs={12}
              md={3}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <ButtonOutlined
                style={{ margin: "0px" }}
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </ButtonOutlined>
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
                  field="protocol"
                  label="Protocolo"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="type"
                  label="Tipo"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="description"
                  label="Descrição do Produto/Serviço"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="details"
                  label="Observação Complementar"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="closed_at"
                  label="Data de abertura"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="closed_at"
                  label="Vencimento SLA"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="productRequestErpStatusDescription"
                  label="Situação"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="isDraft"
                  label="Rascunho"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {productRequests.length > 0 &&
                productRequests.map((product) => {
                  return (
                    <TableRow
                      key={product.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <CustomMenuItem
                        id={product.id ? product.id : ""}
                        handleToEdit={handleToProductsRequests}
                        handleToEvents={handleToProductRequestEvents}
                        notificationQuantity={
                          product.productRequestErpStatus?.id === 5 ? 1 : 0
                        }
                      />

                      <CustomTableCell
                        size="small"
                        title={product.protocol}
                        width={150}
                      >
                        {product.protocol}
                      </CustomTableCell>

                      <CustomTableCell
                        size="small"
                        title={
                          product.type === "PRODUCT" ? "Produto" : "Serviço"
                        }
                        width={200}
                      >
                        {product.type === "PRODUCT" ? "Produto" : "Serviço"}
                      </CustomTableCell>

                      <CustomTableCell
                        size="small"
                        title={product.description}
                        width={200}
                      >
                        {product.description}
                      </CustomTableCell>

                      <CustomTableCell
                        size="small"
                        title={product.details}
                        width={200}
                      >
                        {product.details}
                      </CustomTableCell>

                      <CustomTableCell
                        size="small"
                        title={
                          product.closed_at
                            ? moment(product.closed_at).format(
                                "DD/MM/YYYY HH:mm:ss"
                              )
                            : ""
                        }
                        width={200}
                      >
                        {product.closed_at
                          ? moment(product.closed_at).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )
                          : ""}
                      </CustomTableCell>
                      {product.closed_at ? (
                        <SlaInfo
                          data={{
                            closed_at: product.closed_at,
                            limitDays: 2,
                            isFinished:
                              product.productRequestErpStatus?.id === 4
                                ? true
                                : false,
                            handleEvents: handleToProductRequestEvents,
                            id: product.id ?? "",
                          }}
                        />
                      ) : (
                        <CustomTableCell
                          size="small"
                          width={200}
                        ></CustomTableCell>
                      )}
                      <CustomTableCell
                        size="small"
                        width={300}
                        title={product.productRequestErpStatus?.description}
                      >
                        {product.productRequestErpStatus?.description}
                      </CustomTableCell>

                      <CustomTableCell size="small">
                        {product.isDraft ? "Sim" : "Não"}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {productRequests.length === 0 && (
            <CustomNoContentTableBody>
              <p>Nenhum produto encontrado</p>
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
      </PageCard>
    </>
  );
};

export default ProductRequests;
