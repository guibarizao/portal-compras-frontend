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
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import ISupplier from "../../interfaces/ISupplier";
import { useSupplierService } from "../../services/useSupplierService";
import CustomTableSortLabel from "../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import CustomTablePagination from "../../components/table/CustomTablePagination/CustomTablePagination";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { useToastr } from "../../hooks/useToastr";
import { CustomMenuItem } from "../../components/table/CustomMenuItem/CustomMenuItem";
import useCpfCnpjFormat from "../../util/useCpfCnpjFormat";
import usePhoneFormat from "../../util/usePhoneFormat";
import { CustomTableCell } from "../../components/table/CustomTableCell/CustomTableCell";
import { CustomNoContentTableBody } from "../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { GridFilterArea } from "../../components/table/GridFilterArea/GridFilterArea";
import { FilterButtonGroup } from "../../components/table/FilterButtonGroup/FilterButtonGroup";
import { useAuth } from "../../hooks/auth";
import IEvent from "../../interfaces/IEvent";
import { useSupplierEventsService } from "../../services/useSupplierEventsService";
import { ButtonOutlined } from "../../components/buttonOutlined/ButtonOutlined";
import moment from "moment";
import { SlaInfo } from "../../components/slaInfo/SlaInfo";
import { useSupplierErpStatusService } from "../../services/useSupplierErpStatusService";
import ISupplierErpStatus from "../../interfaces/ISupplierErpStatus";

const fields = [
  {
    field: "code",
    label: "Código",
  },
  {
    field: "corporateName",
    label: "Nome",
  },
  {
    field: "corporateDocument",
    label: "CPF/CNPJ",
  },
  {
    field: "supplierErpStatusDescription",
    label: "Situação",
  },
];

const STORAGE_KEY = "@PORTAL-COMPRAS:suppliersFilters";

const getInitialState = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed[key] !== undefined ? parsed[key] : defaultValue;
  }
  return defaultValue;
};

interface ISuppliersProps {
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
  justMyDocuments?: boolean;
}

const Suppliers: React.FC<ISuppliersProps> = ({ title }) => {
  window.document.title = title;

  const { listAllSuppliers, generateSupplierReport } = useSupplierService();
  const { listSupplierEvents } = useSupplierEventsService();
  const { listSupplierErpStatusDynamically } = useSupplierErpStatusService();

  const toastr = useToastr();
  const timeout = useRef<any>(null);

  const { signOut, state: userState } = useAuth();

  const navigate = useNavigate();
  const { formatCnpj, formatCpf } = useCpfCnpjFormat();
  const { formatPhone } = usePhoneFormat();

  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(() => getInitialState("perPage", 10));
  const [currentPage, setCurrentPage] = useState(() =>
    getInitialState("currentPage", 0)
  );
  const [orderField, setOrderField] = useState<string>(() =>
    getInitialState("orderField", "closed_at")
  );
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">(() =>
    getInitialState("orderDirection", "desc")
  );
  const [loading, setLoading] = useState(false);

  const [gridFilterAreaOpen, setGridFilterAreaOpen] = useState(() =>
    getInitialState("gridFilterAreaOpen", false)
  );
  const [filterField, setFilterField] = useState<string>(() =>
    getInitialState("filterField", "")
  );
  const [filterPrecision, setFilterPrecision] = useState<string>(() =>
    getInitialState("filterPrecision", "containing")
  );
  const [filterValue, setFilterValue] = useState<string>(() =>
    getInitialState("filterValue", "")
  );
  const [delay, setDelay] = useState(0);

  const [supplierErpStatus, setSupplierErpStatus] = useState<
    ISupplierErpStatus[] | []
  >([]);

  const [selectedSupplierErpStatus, setSelectedSupplierErpStatus] = useState<
    ISupplierErpStatus[]
  >(() => {
    return getInitialState("selectedSupplierErpStatus", []);
  });

  const [justMyDocuments, setJustMyDocuments] = useState(() =>
    getInitialState("justMyDocuments", false)
  );

  const handleToSuppliers = useCallback(
    (id: string | null) => {
      !!id ? navigate(`/supplier/${id}`) : navigate("/supplier");
    },
    [navigate]
  );

  const handleToSupplier = useCallback(
    (id: string | null) => {
      !!id ? navigate(`/supplier/${id}`) : navigate("/supplier");
    },
    [navigate]
  );

  const handleToSupplierReport = useCallback(
    async (projectId: string | null) => {
      if (projectId) {
        setLoading(true);

        await generateSupplierReport(projectId)
          .then((response) => {
            const file = response.file;

            const base64PDF = file;

            if (base64PDF) {
              // Converter o base64 em blob
              const byteCharacters = atob(base64PDF);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: "application/pdf" });

              // Criar um URL do blob e realizar o download
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${projectId}.pdf`;
              link.click();

              // Limpar o URL do blob após o download
              URL.revokeObjectURL(url);
            }
          })
          .catch((error) => {
            if (error.status === 401) {
              signOut();
              navigate("/");
            }

            toastr.error(
              error?.message ||
                "Erro ao gerar relatório. Contate a equipe de suporte"
            );
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },

    [signOut, navigate]
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
      justMyDocuments,
    });
  };

  const handleListSupplierErpStatus = useCallback(async () => {
    const url = `perPage=100&currentPage=1&orderBy=description&orderDirection=asc&filter=`;

    await listSupplierErpStatusDynamically(url)
      .then((response) => {
        const responseErpStatusFiltered = response.data.filter(
          (responseItem) =>
            !selectedSupplierErpStatus.some((selectedItem) =>
              selectedItem.id === responseItem.id ? true : false
            )
        );

        const responseErpStatus = responseErpStatusFiltered.map((status) => {
          return {
            id: status.id,
            description: status.description ? status.description : "",
          };
        });

        setSupplierErpStatus(responseErpStatus);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedSupplierErpStatus]);

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
      await listAllSuppliers(url)
        .then((response) => {
          if (response?.data?.length > 0) {
            setSuppliers(response.data);
            setTotalRows(response.totalRows);
            setLoading(false);
          } else {
            setSuppliers([]);
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
      status: selectedSupplierErpStatus.map((status) => status.id),
      justMyDocuments,
    });
  }, [
    filterField,
    filterPrecision,
    filterValue,
    delay,
    selectedSupplierErpStatus,
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
      selectedSupplierErpStatus,
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
    selectedSupplierErpStatus,
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
    setSelectedSupplierErpStatus([]);
    setJustMyDocuments(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleToSupplierEvents = async (id: string): Promise<IEvent[]> => {
    return await listSupplierEvents(id);
  };

  const handleChangeSupplierErpStatus = (
    _: React.ChangeEvent<{}>,
    values: ISupplierErpStatus[]
  ) => {
    setCurrentPage(0);
    setSelectedSupplierErpStatus(values);
  };

  const handleChengeOnlyMyDocuments = useCallback((checked: boolean) => {
    setJustMyDocuments(checked);
  }, []);

  useEffect(() => {
    handleListSupplierErpStatus();
  }, [selectedSupplierErpStatus]);

  return (
    <>
      <TitleContainer>
        <h1>Fornecedores</h1>
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

          {userState.resources.some(
            (item) => item === "cadastro-fornecedores-portal-compras"
          ) && (
            <Tooltip title="Criar fornecedor" placement="top">
              <IconButton
                onClick={() => handleToSuppliers(null)}
                size="small"
                color="primary"
                style={{ alignItems: "flex-end" }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
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
                options={supplierErpStatus}
                getOptionLabel={(option) => option.description}
                value={selectedSupplierErpStatus}
                filterSelectedOptions
                size="small"
                onChange={handleChangeSupplierErpStatus}
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
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <ButtonOutlined onClick={handleClearFilters}>
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
                  field="code"
                  label="Cód."
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="corporateName"
                  label="Nome"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="corporateDocument"
                  label="CNPJ"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="phone1"
                  label="Telefone 1"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="email1"
                  label="E-mail 1"
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
                  label="Data de Abertura"
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
                  field="supplierErpStatusDescription"
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
              {suppliers.length > 0 &&
                suppliers.map((supplier) => {
                  return (
                    <TableRow
                      key={supplier.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <CustomMenuItem
                        id={supplier.id ? supplier.id : ""}
                        handleToEdit={
                          userState.resources.some(
                            (item) =>
                              item === "cadastro-fornecedores-portal-compras"
                          )
                            ? handleToSupplier
                            : null
                        }
                        handleToEvents={handleToSupplierEvents}
                        requestNumber={supplier.id}
                        isDraft={supplier.isDraft}
                        handleToPrintOut={handleToSupplierReport}
                        notificationQuantity={
                          supplier.supplierErpStatus?.id === 5 ? 1 : 0
                        }
                      />

                      <CustomTableCell size="small" width={70}>
                        {supplier.code}
                      </CustomTableCell>
                      <CustomTableCell
                        size="small"
                        title={supplier.corporateName}
                        width={200}
                      >
                        {supplier.corporateName}
                      </CustomTableCell>
                      <CustomTableCell
                        size="small"
                        title={
                          supplier.supplierTypeId === "J"
                            ? formatCnpj(`${supplier.corporateDocument}`)
                            : formatCpf(`${supplier.corporateDocument}`)
                        }
                        width={150}
                      >
                        {supplier.supplierTypeId === "J"
                          ? formatCnpj(`${supplier.corporateDocument}`)
                          : formatCpf(`${supplier.corporateDocument}`)}
                      </CustomTableCell>
                      <CustomTableCell
                        size="small"
                        title={formatPhone(supplier.phone1)}
                        width={110}
                      >
                        {formatPhone(supplier.phone1)}
                      </CustomTableCell>
                      <CustomTableCell
                        size="small"
                        title={supplier.email1}
                        width={200}
                      >
                        {supplier.email1}
                      </CustomTableCell>
                      <CustomTableCell
                        size="small"
                        title={
                          supplier.closed_at
                            ? moment(supplier.closed_at).format(
                                "DD/MM/YYYY HH:mm:ss"
                              )
                            : ""
                        }
                        width={200}
                      >
                        {supplier.closed_at
                          ? moment(supplier.closed_at).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )
                          : ""}
                      </CustomTableCell>
                      {supplier.closed_at ? (
                        <SlaInfo
                          data={{
                            closed_at: supplier.closed_at,
                            limitDays: 4,
                            isFinished:
                              supplier.supplierErpStatus?.id === 4
                                ? true
                                : false,
                            handleEvents: handleToSupplierEvents,
                            id: supplier.id ?? "",
                          }}
                        />
                      ) : (
                        <CustomTableCell
                          size="small"
                          width={200}
                        ></CustomTableCell>
                      )}
                      <CustomTableCell size="small" width={200}>
                        {supplier.supplierErpStatus?.description}
                      </CustomTableCell>
                      <CustomTableCell size="small" width={100}>
                        {supplier.isDraft ? "Sim" : "Não"}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {suppliers.length === 0 && (
            <CustomNoContentTableBody>
              <p>Nenhum fornecedor encontrado</p>
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

export default Suppliers;
