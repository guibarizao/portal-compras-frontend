import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import IHeadOffice from "../../interfaces/IHeadOffice";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { useHeadOfficeService } from "../../services/useHeadOfficeService";
import IStockRequestType from "../../interfaces/IStockRequestType";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useStockRequestTypeService } from "../../services/useStockRequestTypeService";
import IPurchaseRequestType from "../../interfaces/IPurchaseRequestType";
import { usePurchaseRequestTypeService } from "../../services/usePurchaseRequestTypeService";

interface IHeadOfficeProps {
  title: string;
}

const HeadOffice: React.FC<IHeadOfficeProps> = ({ title }) => {
  window.document.title = title;

  const { listHeadOfficeById, updateHeadOffice } = useHeadOfficeService();
  const { listAllStockRequestTypes } = useStockRequestTypeService();
  const { listAllPurchaseRequestTypes } = usePurchaseRequestTypeService();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [reportStockRequest, setReportStockRequest] = useState("");
  const [reportPurchaseRequest, setReportPurchaseRequest] = useState("");
  const [projectReport, setProjectReport] = useState("");
  const [productReport, setProductReport] = useState("");
  const [supplierReport, setSupplierReport] = useState("");

  const [stockRequestTypeId, setStockRequestTypeId] = useState("");
  const [stockRequestTypes, setStockRequestTypes] = useState<
    IStockRequestType[]
  >([]);

  const [purchaseRequestTypeId, setPurchaseRequestTypeId] = useState("");
  const [purchaseRequestTypes, setPurchaseRequestTypes] = useState<
    IPurchaseRequestType[]
  >([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleChangeStockRequestType = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setStockRequestTypeId(id);
  };

  const handleChangePurchaseRequestType = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setPurchaseRequestTypeId(id);
  };

  const handleListHeadOffice = useCallback(async () => {
    const id = location.pathname.replace("/head-office", "").replace("/", "");

    if (id) {
      setLoading(true);

      await listHeadOfficeById(id)
        .then((response) => {
          const headOffice: IHeadOffice = response;

          setCode(headOffice.code ? headOffice.code : "");
          setName(headOffice.name ? headOffice.name : "");
          setReportStockRequest(
            headOffice.reportStockRequest ? headOffice.reportStockRequest : ""
          );
          setReportPurchaseRequest(
            headOffice.reportPurchaseRequest
              ? headOffice.reportPurchaseRequest
              : ""
          );
          setProjectReport(
            headOffice.projectReport ? headOffice.projectReport : ""
          );
          setProductReport(
            headOffice.productReport ? headOffice.productReport : ""
          );
          setSupplierReport(
            headOffice.supplierReport ? headOffice.supplierReport : ""
          );

          if (headOffice?.stockRequestTypeId) {
            const stockRequestTypeExists = stockRequestTypes.some(
              (stockRequestType) =>
                stockRequestType.id === headOffice.stockRequestType?.id
            );

            if (!stockRequestTypeExists && headOffice.stockRequestType) {
              setStockRequestTypes([headOffice.stockRequestType]);
            }
            setStockRequestTypeId(String(headOffice.stockRequestTypeId));
          }

          if (headOffice?.purchaseRequestTypeId) {
            const purchaseRequestTypeExists = purchaseRequestTypes.some(
              (purchaseRequestType) =>
                purchaseRequestType.id === headOffice.purchaseRequestType?.id
            );

            if (!purchaseRequestTypeExists && headOffice.purchaseRequestType) {
              setPurchaseRequestTypes([headOffice.purchaseRequestType]);
            }
            setPurchaseRequestTypeId(String(headOffice.purchaseRequestTypeId));
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
    }
  }, [navigate, signOut, toastr, location.pathname]);

  const handleListStockRequestTypes = useCallback(async () => {
    const url = `perPage=10&currentPage=1&orderBy=id&orderDirection=asc&filterField=descriprion&filterValue=&precision=containing`;

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

  const handleListPurchaseRequestTypes = useCallback(async () => {
    const url = `perPage=10&currentPage=1&orderBy=id&orderDirection=asc&filterField=descriprion&filterValue=&precision=containing`;

    await listAllPurchaseRequestTypes(url)
      .then((response) => {
        setPurchaseRequestTypes(response.data);
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

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      const id = location.pathname.replace("/head-office", "").replace("/", "");

      await updateHeadOffice(id, {
        reportStockRequest: reportStockRequest ? reportStockRequest : null,
        reportPurchaseRequest: reportPurchaseRequest
          ? reportPurchaseRequest
          : null,
        projectReport: projectReport ? projectReport : null,
        productReport: productReport ? productReport : null,
        supplierReport: supplierReport ? supplierReport : null,
        stockRequestTypeId: stockRequestTypeId
          ? Number(stockRequestTypeId)
          : null,
        purchaseRequestTypeId: purchaseRequestTypeId
          ? Number(purchaseRequestTypeId)
          : null,
      })
        .then(async () => {
          await handleListHeadOffice();

          navigate("/settings");
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");
        });
    } catch (error: any) {
      toastr.error(error?.message || "Contate a equipe de suporte");
    } finally {
      setLoading(false);
    }
  }, [
    purchaseRequestTypeId,
    reportStockRequest,
    reportPurchaseRequest,
    projectReport,
    productReport,
    supplierReport,
    stockRequestTypeId,
    purchaseRequestTypeId,
    signOut,
  ]);

  useEffect(() => {
    handleListHeadOffice();
  }, []);

  useEffect(() => {
    handleListStockRequestTypes();
  }, []);

  useEffect(() => {
    handleListPurchaseRequestTypes();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Empresa</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Código ERP"
                value={code}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Nome da empresa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="stock-request-type-select">
                  Tipo requisição de estoque padrão
                </InputLabel>
                <Select
                  labelId="stock-request-type-select"
                  id="stock-request-type"
                  value={stockRequestTypeId}
                  label="Tipo requisição de estoque padrão"
                  onChange={handleChangeStockRequestType}
                  onBlur={handleListStockRequestTypes}
                  style={{ textAlign: "start" }}
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
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="purchase-request-type-select">
                  Tipo solicitação de compra padrão
                </InputLabel>
                <Select
                  labelId="purchase-request-type-select"
                  id="purchase-request-type"
                  value={purchaseRequestTypeId}
                  label="Tipo solicitação de compra padrão"
                  onChange={handleChangePurchaseRequestType}
                  onBlur={handleListPurchaseRequestTypes}
                  style={{ textAlign: "start" }}
                >
                  {purchaseRequestTypes.map((purchaseRequestType) => (
                    <MenuItem
                      key={purchaseRequestType.id}
                      value={purchaseRequestType.id}
                    >
                      {purchaseRequestType.id} -{" "}
                      {purchaseRequestType.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Relatório de requisição de Estoque"
                value={reportStockRequest}
                onChange={(e) => setReportStockRequest(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Relatório de solicitação de compras"
                value={reportPurchaseRequest}
                onChange={(e) => setReportPurchaseRequest(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Relatório de projetos"
                value={projectReport}
                onChange={(e) => setProjectReport(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Relatório de produtos"
                value={productReport}
                onChange={(e) => setProductReport(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Relatório de fornecedor"
                value={supplierReport}
                onChange={(e) => setSupplierReport(e.target.value)}
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/settings")}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>

            <ButtonTheme onClick={() => handleSubmit()} disabled={loading}>
              Confirmar
            </ButtonTheme>
          </ButtonGroup>
        </Form>

        {loading && <BackdropCustom />}
      </PageCard>
    </>
  );
};

export default HeadOffice;
