import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useStockRequestService } from "../../services/useStockRequestService";
import { useToastr } from "../../hooks/useToastr";
import IStockRequest from "../../interfaces/IStockRequest";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import IBranchOffice from "../../interfaces/IBranchOffice";
import { useBranchOfficeService } from "../../services/useBranchOfficeService";
import { useStockRequestTypeService } from "../../services/useStockRequestTypeService";
import IStockRequestType from "../../interfaces/IStockRequestType";
import moment from "moment";
import StockRequestItems from "./stockRequestItems/StockRequestItems";
import StockRequestAttachments from "./stockRequestAttachments/StockRequestAttachments";
import { ConfirmationArea } from "../../components/confirmationArea/ConfirmationArea";
import StockRequestEvents from "./stockRequestEvents/StockRequestEvents";

interface IStockRequestProps {
  title: string;
}

const StockRequest: React.FC<IStockRequestProps> = ({ title }) => {
  window.document.title = title;
  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut, state, currentHeadOffice } = useAuth();

  const { listAllBranchesOffices } = useBranchOfficeService();

  const { listAllStockRequestTypes } = useStockRequestTypeService();

  const [branchOffices, setBranchesOffices] = useState<IBranchOffice[]>([]);

  const [branchOfficeId, setBranchOfficeId] = useState(() => {
    if (currentHeadOffice?.branchesOffices) {
      const branchOffice = currentHeadOffice?.branchesOffices[0];
      const branchOfficeExists = branchOffices.some(
        (branchOffice) => branchOffice.id === branchOffice?.id
      );

      if (!branchOfficeExists) {
        setBranchesOffices([branchOffice]);
      }
      return branchOffice.id;
    }

    return "";
  });

  const [stockRequestTypes, setStockRequestTypes] = useState<
    IStockRequestType[]
  >([]);
  const [stockRequestTypeId, setStockRequestTypeId] = useState(() => {
    if (state.branchOffice?.headOffice?.stockRequestTypeId) {
      const stockRequestTypeExists = stockRequestTypes.some(
        (stockRequestType) =>
          stockRequestType.id ===
          state.branchOffice?.headOffice?.stockRequestType?.id
      );

      if (!stockRequestTypeExists) {
        const stockRequestType =
          state.branchOffice?.headOffice?.stockRequestType;

        if (stockRequestType) {
          setStockRequestTypes([stockRequestType]);
        }
      }
      return state.branchOffice?.headOffice?.stockRequestType?.id;
    }

    return "";
  });

  const [stockRequestId, setStockRequestId] = useState("");
  const [protocol, setProtocol] = useState("");
  const [requestNumber, setRequestNumber] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [createdAt, setCreatedAt] = useState("");
  const [username, setUsername] = useState("");
  const [integrationStatus, setIntegrationStatus] = useState("Pendente");
  const [integrationDate, setIntegrationDate] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const {
    deleteStockRequest,
    listStockRequestById,
    updateStockRequest,
    createStockRequest,
    closeStockRequest,
    generateStockRequestReport,
  } = useStockRequestService();

  const handleListBranchesOffices = useCallback(async () => {
    const url = `perPage=10&currentPage=1&orderBy=name&orderDirection=asc&filterField=name&filterValue=&precision=containing`;

    setLoading(true);

    await listAllBranchesOffices(url)
      .then((response) => {
        setBranchesOffices(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          signOut();
          navigate("/");
        }
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, signOut]);

  const handleListStockRequestTypes = useCallback(async () => {
    const url = `perPage=10&currentPage=1&orderBy=id&orderDirection=asc&filterField=descriprion&filterValue=&precision=containing`;

    setLoading(true);

    await listAllStockRequestTypes(url)
      .then((response) => {
        setStockRequestTypes(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          signOut();
          navigate("/");
        }
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, signOut]);

  const handleListStockRequest = useCallback(
    async (stockRequestId: string | null) => {
      let id = location.pathname.replace("/stock-request", "").replace("/", "");

      if (!id && !!stockRequestId) {
        id = stockRequestId;
      }

      setStockRequestId(id);

      if (id) {
        setLoading(true);

        await listStockRequestById(id)
          .then((response) => {
            const stockRequest: IStockRequest = response;

            if (stockRequest?.branchOfficeId) {
              const branchOfficeExists = branchOffices.some(
                (branchOffice) =>
                  branchOffice.id === stockRequest.branchOffice?.id
              );

              if (!branchOfficeExists && stockRequest.branchOffice) {
                setBranchesOffices([stockRequest.branchOffice]);
              }
              setBranchOfficeId(stockRequest.branchOfficeId);
            }

            if (stockRequest?.stockRequestTypeId) {
              const stockRequestTypeExists = stockRequestTypes.some(
                (stockRequestType) =>
                  stockRequestType.id === stockRequest.stockRequestType?.id
              );

              if (!stockRequestTypeExists && stockRequest.stockRequestType) {
                setStockRequestTypes([stockRequest.stockRequestType]);
              }
              setStockRequestTypeId(String(stockRequest.stockRequestTypeId));
            }

            stockRequest?.protocol && setProtocol(stockRequest.protocol);

            stockRequest?.requestNumber &&
              setRequestNumber(stockRequest.requestNumber);

            setIsDraft(stockRequest.isDraft);

            stockRequest?.created_at &&
              setCreatedAt(
                moment(stockRequest.created_at).format("DD/MM/YYYY HH:mm")
              );

            stockRequest.user?.username &&
              setUsername(stockRequest.user.username);

            stockRequest.integrationStatus === "PENDING" &&
              setIntegrationStatus("Pendente");

            stockRequest.integrationStatus === "ERROR" &&
              setIntegrationStatus("Erro");

            if (stockRequest.integrationStatus === "SUCCESS") {
              setIntegrationStatus("Sucesso");
            }

            stockRequest.integrationDate &&
              setIntegrationDate(
                moment(stockRequest.integrationDate).format("DD/MM/YYYY HH:mm")
              );
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
      }
    },
    [stockRequestId, navigate, signOut, location.pathname]
  );

  const handleDeleteStockRequest = useCallback(async () => {
    setLoading(true);
    await deleteStockRequest(stockRequestId)
      .then(async () => {
        toastr.success("Requisição de estoque deletada com sucesso");

        navigate("/stock-requests");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stockRequestId, toastr, navigate]);

  const handleCloseStockRequest = useCallback(async () => {
    setLoading(true);
    await closeStockRequest(stockRequestId)
      .then(async () => {
        toastr.success("Requisição de estoque finalizada com sucesso");
        handleListStockRequest(null);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stockRequestId, toastr, navigate, handleListStockRequest]);

  const handleGenerateReport = useCallback(
    async (stockRequestId: string | null) => {
      let id = location.pathname.replace("/stock-request", "").replace("/", "");

      if (!id && !!stockRequestId) {
        id = stockRequestId;
      }

      if (id) {
        setLoading(true);

        await generateStockRequestReport({ stockRequestId: id })
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
              link.download = `${requestNumber}.pdf`;
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
    [stockRequestId, requestNumber, navigate, signOut, location.pathname]
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: IStockRequest = {
        branchOfficeId,
        stockRequestTypeId: Number(stockRequestTypeId),
        isDraft,
      };

      const schema = Yup.object().shape({
        branchOfficeId: Yup.string().required("Filial obrigatória"),
        stockRequestTypeId: Yup.number()
          .required("Tipo de requisição obrigatória")
          .positive("Tipo de requisição obrigatória")
          .integer("Tipo de requisição obrigatória"),
      });

      if (stockRequestId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updateStockRequest(stockRequestId, data)
          .then(async (response) => {
            const stockRequest: IStockRequest = response;

            stockRequest.id && (await handleListStockRequest(stockRequest.id));

            navigate(`/stock-request/${stockRequest.id}`);

            toastr.success("Requisição de estoque criada com sucesso");
          })
          .catch((error) => {
            if (error.status === 401) {
              signOut();
              navigate("/");
            }

            toastr.error(error?.message || "Contate a equipe de suporte");
          });
      } else {
        await schema.validate(data, {
          abortEarly: false,
        });

        await createStockRequest(data)
          .then(async (response) => {
            const stockRequest: IStockRequest = response;

            stockRequest.id && setStockRequestId(stockRequest.id);

            stockRequest.id && (await handleListStockRequest(stockRequest.id));

            navigate(`/stock-request/${stockRequest.id}`);

            toastr.success("Requisição de estoque criada com sucesso");
          })
          .catch((error) => {
            if (error.status === 401) {
              signOut();
              navigate("/");
            }

            toastr.error(error?.message || "Contate a equipe de suporte");
          });
      }
    } catch (error: Yup.ValidationError | any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationError(error);
        setFormErrors(errors);
        return;
      }

      toastr.error(error?.message || "Contate a equipe de suporte");
    } finally {
      setLoading(false);
    }
  }, [
    stockRequestId,
    branchOfficeId,
    stockRequestTypeId,
    isDraft,
    navigate,
    signOut,
    handleListStockRequest,
  ]);

  const handleChangeBranchOffice = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setBranchOfficeId(id);
  };

  const handleChangeStockRequestType = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setStockRequestTypeId(id);
  };

  useEffect(() => {
    handleListBranchesOffices();
  }, []);

  useEffect(() => {
    handleListStockRequestTypes();
  }, []);

  useEffect(() => {
    handleListStockRequest(null);
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Requisição de estoque</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                sx={{ width: "100%" }}
                size="small"
                error={!!formErrors.branchOfficeId}
              >
                <InputLabel id="branch-office-select">Filial</InputLabel>
                <Select
                  labelId="branch-office-select"
                  id="branch-office"
                  value={branchOfficeId}
                  label="Filial"
                  onChange={handleChangeBranchOffice}
                  style={{ textAlign: "start" }}
                  disabled={!isDraft}
                >
                  {branchOffices.map((branchOffice) => (
                    <MenuItem key={branchOffice.id} value={branchOffice.id}>
                      {branchOffice.code} - {branchOffice.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formErrors.branchOfficeId}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                sx={{ width: "100%" }}
                size="small"
                error={!!formErrors.stockRequestTypeId}
              >
                <InputLabel id="stock-request-type-select" disabled={!isDraft}>
                  Tipo requisição
                </InputLabel>
                <Select
                  labelId="stock-request-type-select"
                  id="stock-request-type"
                  value={stockRequestTypeId}
                  label="Tipo requisição"
                  onChange={handleChangeStockRequestType}
                  style={{ textAlign: "start" }}
                  disabled={!isDraft}
                  autoFocus
                >
                  {stockRequestTypes.map((stockRequestType) => (
                    <MenuItem
                      key={stockRequestType.id}
                      value={stockRequestType.id}
                    >
                      {stockRequestType.id} - {stockRequestType.description}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formErrors.stockRequestTypeId}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/stock-requests")}
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>

            {stockRequestId && isDraft && (
              <ButtonTheme
                onClick={() => {
                  setDeleteDialogOpen(true);
                }}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            {requestNumber && (
              <ButtonTheme
                onClick={() => handleGenerateReport(stockRequestId)}
                disabled={loading}
                title="Gerar o relatório"
              >
                Imprimir
              </ButtonTheme>
            )}

            {isDraft && (
              <ButtonTheme
                onClick={() => handleSubmit()}
                disabled={loading}
                title="Salvar o cadastro ou alteração"
              >
                Salvar
              </ButtonTheme>
            )}

            {stockRequestId && isDraft && (
              <ButtonTheme
                onClick={() => {
                  setCloseDialogOpen(true);
                }}
                disabled={loading}
                color="info"
                title="Finaliza a requisição, tonando-a disponível para integração com ERP"
              >
                Finalizar
              </ButtonTheme>
            )}
          </ButtonGroup>
        </Form>

        {loading && <BackdropCustom />}

        {stockRequestId && (
          <>
            <ConfirmationArea
              id={stockRequestId}
              dialogOpen={deleteDialogOpen}
              handleConfirmation={handleDeleteStockRequest}
              title="Deseja realmente excluir a requisição de estoque?"
              message=""
              deny={() => {
                setDeleteDialogOpen(false);
              }}
            />

            <ConfirmationArea
              id={stockRequestId}
              dialogOpen={closeDialogOpen}
              handleConfirmation={handleCloseStockRequest}
              title="Deseja realmente finalizar a requisião de estoque?"
              message="Essa ação não poderá ser desfeita. Ao finalizar a requisicão, ela ficará disponível para a integração com o ERP."
              deny={() => {
                setCloseDialogOpen(false);
              }}
            />
          </>
        )}
      </PageCard>

      {stockRequestId && (
        <Paper sx={{ margin: "16px" }} elevation={6}>
          <Accordion elevation={0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{ marginLeft: "2px" }}
            >
              Mostrar mais campos
            </AccordionSummary>
            <AccordionDetails sx={{ marginBottom: "24px" }}>
              <Grid container spacing={3} sx={{ marginTop: "4px" }}>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Protocolo"
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    helperText={formErrors.protocol}
                    error={!!formErrors.protocol}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Número solicitação"
                    value={requestNumber}
                    onChange={(e) => setRequestNumber(e.target.value)}
                    helperText={formErrors.requestNumber}
                    error={!!formErrors.requestNumber}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Data/Hora Geração"
                    value={createdAt}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    helperText={formErrors.createdAt}
                    error={!!formErrors.createdAt}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Usuário Geração"
                    value={username}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    helperText={formErrors.username}
                    error={!!formErrors.username}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Status Integração"
                    value={integrationStatus}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Data/Hora Integração"
                    value={integrationDate}
                    disabled
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Paper>
      )}

      {stockRequestId && (
        <>
          <StockRequestItems
            title="Itens"
            stockRequestId={stockRequestId}
            stockRequestDisableEdit={!isDraft}
          />

          <StockRequestAttachments
            title="Anexos"
            stockRequestId={stockRequestId}
            stockRequestDisableEdit={!isDraft}
          />

          <StockRequestEvents title="Eventos" stockRequestId={stockRequestId} />
        </>
      )}
    </>
  );
};

export default StockRequest;
