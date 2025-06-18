import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import CustomTableSortLabel from "../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import CustomTablePagination from "../../components/table/CustomTablePagination/CustomTablePagination";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { useToastr } from "../../hooks/useToastr";
import IPurchaseRequest from "../../interfaces/IPurchaseRequest";
import { CustomMenuItem } from "../../components/table/CustomMenuItem/CustomMenuItem";
import { usePurchaseRequestService } from "../../services/usePurchaseRequestService";
import { usePurchaseRequestEventsService } from "../../services/usePurchaseRequestEventsService";
import { useAuth } from "../../hooks/auth";
import { CustomTableCell } from "../../components/table/CustomTableCell/CustomTableCell";
import IEvent from "../../interfaces/IEvent";
import { CustomNoContentTableBody } from "../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { GridFilterArea } from "../../components/table/GridFilterArea/GridFilterArea";
import { FilterButtonGroup } from "../../components/table/FilterButtonGroup/FilterButtonGroup";
import { usePurchaseRequestErpStatusService } from "../../services/usePurchaseRequestErpStatusService";
import IPurchaseRequestErpStatus from "../../interfaces/IPurchaseRequestErpStatus";
import IPurchaseRequestMessage from "../../interfaces/IPurchaseRequestMessage";
import { useLocalStorage } from "../../services/useLocalStorage";
import { ButtonOutlined } from "../../components/buttonOutlined/ButtonOutlined";

const fields = [
  {
    field: "purchaseRequestTypeId",
    label: "Cód. tipo solicitação",
  },
  {
    field: "purchaseRequestTypeDescription",
    label: "Descrição tipo solicitação",
  },
  {
    field: "requestNumber",
    label: "Número da solicitação no ERP",
  },
  {
    field: "supplierCorporateName",
    label: "Fornecedor",
  },
  {
    field: "protocol",
    label: "Protocolo",
  },
  {
    field: "username",
    label: "Usuário Geração",
  },
];

interface IPurchaseRequestsProps {
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

const ProtocolButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  transition: color 0.2s;

  :hover {
    color: #3fa110;
  }
`;

const PurchaseRequests: React.FC<IPurchaseRequestsProps> = ({ title }) => {
  window.document.title = title;

  const { listAllPurchaseRequests, generatePurchaseRequestReport } =
    usePurchaseRequestService();
  const { listPurchaseRequestEvents } = usePurchaseRequestEventsService();
  const { listAllPurchaseRequestErpStatus } =
    usePurchaseRequestErpStatusService();

  const { getItem, setItem } = useLocalStorage();

  const toastr = useToastr();
  const timeout = useRef<any>(null);
  const navigate = useNavigate();
  const { state, signOut } = useAuth();

  const [purchaseRequests, setPurchaseRequests] = useState<IPurchaseRequest[]>(
    []
  );
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState<number>(() => {
    const savedFilters = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter"
    );
    if (savedFilters) {
      const { perPage } = JSON.parse(savedFilters);

      return perPage || 10;
    }

    return 10;
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedFilters = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter"
    );
    if (savedFilters) {
      const { currentPage } = JSON.parse(savedFilters);

      return currentPage || 0;
    }

    return 0;
  });
  const [orderField, setOrderField] = useState<string>(() => {
    const savedFilters = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter"
    );
    if (savedFilters) {
      const { orderField } = JSON.parse(savedFilters);
      return orderField || "created_at";
    }
    return "created_at";
  });

  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">(() => {
    const savedFilters = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter"
    );
    if (savedFilters) {
      const { orderDirection } = JSON.parse(savedFilters);
      return orderDirection || "desc";
    }
    return "desc";
  });
  const [loading, setLoading] = useState(false);

  const [gridFilterAreaOpen, setGridFilterAreaOpen] = useState(() => {
    const savedFilters = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter"
    );
    if (savedFilters) {
      const { gridFilterAreaOpen } = JSON.parse(savedFilters);

      return gridFilterAreaOpen;
    }
  });

  const [filterField, setFilterField] = useState<string>(() => {
    const savedFilters = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter"
    );
    if (savedFilters) {
      const { filterField } = JSON.parse(savedFilters);

      return filterField || "";
    }

    return "";
  });

  const [filterPrecision, setFilterPrecision] = useState<string>(() => {
    const savedFilters = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter"
    );
    if (savedFilters) {
      const { filterPrecision } = JSON.parse(savedFilters);

      return filterPrecision === "equal" ? "equal" : "containing";
    }

    return "containing";
  });

  const [filterValue, setFilterValue] = useState<string>(() => {
    const savedFilters = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter"
    );
    if (savedFilters) {
      const { filterValue } = JSON.parse(savedFilters);

      return filterValue || "";
    }

    return "";
  });
  const [delay, setDelay] = useState(0);

  const [justMyDocuments, setJustMyDocuments] = useState(() => {
    const filters = getItem("@PORTAL-COMPRAS:purchaseRequestFilters");
    return !!filters?.justMyDocuments;
  });

  const [purchaseRequestErpStatus, setPurchaseRequestErpStatus] = useState<
    IPurchaseRequestErpStatus[] | []
  >([]);

  const [
    selectedPurchaseRequestErpStatus,
    setSelectedPurchaseRequestErpStatus,
  ] = useState<IPurchaseRequestErpStatus[]>(() => {
    const savedFilters = sessionStorage.getItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter"
    );
    if (savedFilters) {
      const { selectedPurchaseRequestErpStatus } = JSON.parse(savedFilters);

      return selectedPurchaseRequestErpStatus || [];
    }

    return [];
  });

  const isAdmin = useMemo(() => {
    return (
      state.resources &&
      state.resources.some(
        (resource) => resource === "administrador-portal-compras"
      )
    );
  }, [state]);

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
        status: selectedPurchaseRequestErpStatus.map((s) => s.id),
        justMyDocuments: false,
      });
    },
    [
      filterField,
      filterValue,
      filterPrecision,
      selectedPurchaseRequestErpStatus,
    ]
  );

  const handleToPurchaseRequest = useCallback(
    (id: string | null) => {
      !!id
        ? navigate(`/purchase-request/${id}`)
        : navigate("/purchase-request");
    },
    [navigate]
  );

  const handleToPurchaseRequestMessages = useCallback(
    (id: string) => {
      navigate(`/purchase-request/${id}?messages=true`);
    },
    [navigate]
  );

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
      url = url + `&status=${status}`;
    }

    url = url + `&justMyDocuments=${justMyDocuments}`;

    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoading(true);
      await listAllPurchaseRequests(url)
        .then((response) => {
          if (response?.data?.length > 0) {
            setPurchaseRequests(response.data);
            setTotalRows(response.totalRows);
            setLoading(false);
          } else {
            setPurchaseRequests([]);
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

  const handleListPurchaseRequestErpStatus = useCallback(async () => {
    const url = `perPage=100&currentPage=1&orderBy=description&orderDirection=asc&filter=`;
    await listAllPurchaseRequestErpStatus(url)
      .then((response) => {
        const responseErpStatusFiltered = response.data.filter(
          (responseItem) =>
            !selectedPurchaseRequestErpStatus.some((selectedItem) =>
              selectedItem.id === responseItem.id ? true : false
            )
        );

        const responseErpStatus = responseErpStatusFiltered.map((status) => {
          return {
            id: status.id,
            description: status.description ? status.description : "",
          };
        });

        setPurchaseRequestErpStatus(responseErpStatus);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedPurchaseRequestErpStatus]);

  const handleChangePurchaseRequestErpStatus = (
    _: React.ChangeEvent<{}>,
    values: IPurchaseRequestErpStatus[]
  ) => {
    setCurrentPage(0);
    setSelectedPurchaseRequestErpStatus(values);
  };

  const handleToPurchaseEvents = async (id: string): Promise<IEvent[]> => {
    return listPurchaseRequestEvents(id);
  };

  const handleMessagePendingQuantity = (
    messages: IPurchaseRequestMessage[]
  ): number => {
    const pendingMessages = messages.filter(
      (message) => message.status === "PENDING"
    );

    if (pendingMessages) {
      return pendingMessages.length;
    }

    return 0;
  };

  useEffect(() => {
    handlePagination(perPage, currentPage, orderField, "asc");
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
      status: selectedPurchaseRequestErpStatus.map((s) => s.id),
      justMyDocuments,
    });
  }, [
    filterField,
    filterPrecision,
    filterValue,
    delay,
    selectedPurchaseRequestErpStatus,
    justMyDocuments,
  ]);

  const handleTextFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setTotalRows(0);
    setCurrentPage(0);
    setDelay(500);
  };

  const handlePrintOutPurchaseRequest = useCallback(
    async (id: string | null) => {
      if (id) {
        setLoading(true);
        await generatePurchaseRequestReport({ purchaseRequestId: id })
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
              link.download = `${id}.pdf`;
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
    [navigate]
  );

  const handleChengeOnlyMyDocuments = useCallback((checked: boolean) => {
    setJustMyDocuments(checked);
    setItem("@PORTAL-COMPRAS:purchaseRequestFilters", {
      justMyDocuments: checked,
    });
  }, []);

  useEffect(() => {
    handleListPurchaseRequestErpStatus();
  }, []);

  const saveFiltersToSessionStorage = useCallback(() => {
    const filters = {
      filterField,
      filterPrecision,
      filterValue,
      selectedPurchaseRequestErpStatus,
      justMyDocuments,
      gridFilterAreaOpen,
      currentPage,
      perPage,
      orderField,
      orderDirection,
    };
    sessionStorage.setItem(
      "@PORTAL-COMPRAS:purchaseRequestsListFilter",
      JSON.stringify(filters)
    );
  }, [
    filterField,
    filterPrecision,
    filterValue,
    selectedPurchaseRequestErpStatus,
    justMyDocuments,
    gridFilterAreaOpen,
    currentPage,
    perPage,
    orderField,
    orderDirection,
  ]);

  useEffect(() => {
    saveFiltersToSessionStorage();
  }, [
    filterField,
    filterPrecision,
    filterValue,
    selectedPurchaseRequestErpStatus,
    justMyDocuments,
    gridFilterAreaOpen,
    currentPage,
    perPage,
  ]);

  const handleClearFilters = () => {
    setFilterField("");
    setFilterPrecision("containing");
    setFilterValue("");
    setSelectedPurchaseRequestErpStatus([]);
    setJustMyDocuments(false);
    setCurrentPage(0);
    setPerPage(10);
    setOrderField("created_at");
    setOrderDirection("desc");

    sessionStorage.removeItem("@PORTAL-COMPRAS:purchaseRequestsListFilter");
  };

  useEffect(() => {
    handleListPurchaseRequestErpStatus();
  }, [selectedPurchaseRequestErpStatus]);

  return (
    <>
      <TitleContainer>
        <h1>Solicitações de compras</h1>
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
          <div>
            <Tooltip title="Atualizar página" placement="top">
              <IconButton
                onClick={() => {
                  setCurrentPage(0);
                  handlePagination(perPage, 0, orderField, orderDirection);
                }}
                size="small"
                color="primary"
                style={{ alignItems: "flex-end" }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Criar requisição" placement="top">
              <IconButton
                onClick={() => handleToPurchaseRequest(null)}
                size="small"
                color="primary"
                style={{ alignItems: "flex-end" }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
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
                options={purchaseRequestErpStatus}
                getOptionLabel={(option) => option.description}
                value={selectedPurchaseRequestErpStatus}
                filterSelectedOptions
                size="small"
                onChange={handleChangePurchaseRequestErpStatus}
                renderInput={(params) => {
                  return <TextField {...params} label="Status do pedido" />;
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
              style={{ display: "flex", justifyContent: "flex-end" }}
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
                <CustomTableCell size="small" width={60}>
                  Ações
                </CustomTableCell>

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="created_at"
                  label="Data/Hora Geração"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="requestNumber"
                  label="Número ERP"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="supplierCorporateName"
                  label="Fornecedor"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="purchaseRequestTypeDescription"
                  label="Tipo Solicitação"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="purchaseRequestErpStatus"
                  label="Status de ERP"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="username"
                  label="Usuário Geração"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                {isAdmin && (
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="costCenterCode"
                    label="Centro de custo"
                    handleRequest={handlePagination}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                  />
                )}

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
                  field="integrationDate"
                  label="Data de Integração"
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
              {purchaseRequests.length > 0 &&
                purchaseRequests.map((purchaseRequest) => {
                  return (
                    <TableRow
                      key={purchaseRequest.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <CustomMenuItem
                        id={purchaseRequest.id ? purchaseRequest.id : ""}
                        handleToEdit={handleToPurchaseRequest}
                        handleToEvents={handleToPurchaseEvents}
                        handleToPrintOut={handlePrintOutPurchaseRequest}
                        requestNumber={purchaseRequest.requestNumber}
                        handleToMessages={handleToPurchaseRequestMessages}
                        isDraft={purchaseRequest.isDraft}
                        notificationQuantity={
                          purchaseRequest.purchaseRequestMessages
                            ? handleMessagePendingQuantity(
                                purchaseRequest.purchaseRequestMessages
                              )
                            : 0
                        }
                        heaveMessages={
                          !!purchaseRequest.purchaseRequestMessages &&
                          purchaseRequest.purchaseRequestMessages.length > 0
                        }
                      />

                      <CustomTableCell size="small" width={150}>
                        {moment(purchaseRequest.created_at).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={100}>
                        {purchaseRequest.requestNumber}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={400}>
                        {purchaseRequest.supplier?.corporateName}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={250}>
                        {purchaseRequest.purchaseRequestType?.description}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={150}>
                        {purchaseRequest.purchaseRequestErpStatus
                          ? purchaseRequest.purchaseRequestErpStatus
                              ?.description
                          : "Não enviado"}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={250}>
                        {purchaseRequest.user?.username}
                      </CustomTableCell>

                      {isAdmin && (
                        <CustomTableCell size="small" width={250}>
                          {purchaseRequest.user?.costCenter
                            ? `${purchaseRequest.user?.costCenter.code} - ${purchaseRequest.user?.costCenter.description}`
                            : ""}
                        </CustomTableCell>
                      )}

                      <CustomTableCell size="small" width={100}>
                        <ProtocolButton
                          onClick={() => {
                            navigate(`/purchase-request/${purchaseRequest.id}`);
                          }}
                        >
                          {purchaseRequest.protocol}
                        </ProtocolButton>
                      </CustomTableCell>

                      <CustomTableCell size="small" width={150}>
                        {purchaseRequest.integrationDate
                          ? moment(purchaseRequest.integrationDate).format(
                              "DD/MM/YYYY HH:mm"
                            )
                          : ""}
                      </CustomTableCell>

                      <CustomTableCell size="small">
                        {purchaseRequest.isDraft ? "Sim" : "Não"}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {purchaseRequests.length === 0 && (
            <CustomNoContentTableBody>
              <p>Nenhuma solicitação encontrada</p>
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

export default PurchaseRequests;
