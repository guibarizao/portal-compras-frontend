import { Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";
import { useAuth } from "../hooks/auth";
import Dashboard from "../pages/dashboard/Dashboard";
import { useCallback, useEffect, useState } from "react";
import { useSessionStorage } from "../services/useSessionStorage";
import IUserToken from "../interfaces/IUserToken";
import { user } from "@seniorsistemas/senior-platform-data";
import Product from "../pages/product/Product";
import Suppliers from "../pages/suppliers/Suppliers";
import Supplier from "../pages/supplier/Supplier";
import Categories from "../pages/categories/Categories";
import Category from "../pages/category/Category";
import CostCenters from "../pages/costCenters/CostCenters";
import CostCenter from "../pages/costCenter/CostCenter";
import Projects from "../pages/projects/Projects";
import Project from "../pages/project/Project";
import Wallets from "../pages/wallets/Wallets";
import Wallet from "../pages/wallet/Wallet";
import Users from "../pages/users/Users";
import User from "../pages/user/User";
import StockRequestTypes from "../pages/stockRequestTypes/StockRequestTypes";
import StockRequestType from "../pages/stockRequestType/StockRequestType";
import StockRequest from "../pages/stockRequest/StockRequest";
import StockRequests from "../pages/stockRequests/StockRequests";
import StockRequestItem from "../pages/stockRequestItem/StockRequestItem";
import HeadOffices from "../pages/headOffices/HeadOffices";
import HeadOffice from "../pages/headOffice/HeadOffice";
import PurchaseRequestTypes from "../pages/purchaseRequestTypes/PurchaseRequestTypes";
import PurchaseRequestType from "../pages/purchaseRequestType/PurchaseRequestType";
import PurchaseRequests from "../pages/purchaseRequests/PurchaseRequests";
import PurchaseRequest from "../pages/purchaseRequest/PurchaseRequest";
import PurchaseRequestItem from "../pages/purchaseRequestItem/PurchaseRequestItem";
import ConfigureApplications from "../pages/configureApplications/ConfigureApplications";
import ConfigureApplication from "../pages/configureApplication/ConfigureApplication";
import CustomFieldType from "../pages/customFieldType/CustomFieldType";
import CustomFieldTypes from "../pages/customFieldTypes/CustomFieldTypes";
import CustomFieldDocumentTypes from "../pages/customFieldDocumentTypes/CustomFieldDocumentTypes";
import CustomFieldDocumentType from "../pages/customFieldDocumentType/CustomFieldDocumentType";
import CustomFields from "../pages/customFields/CustomFields";
import CustomField from "../pages/customField/CustomField";
import PurchaseRequestReasons from "../pages/purchaseRequestReasons/PurchaseRequestReasons";
import PurchaseRequestReason from "../pages/purchaseRequestReason/PurchaseRequestReason";
import SuppliersBankDetails from "../pages/suppliersBankDetails/SuppliersBankDetails";
import PaymentForms from "../pages/paymentForms/PaymentForms";
import PaymentConditions from "../pages/paymentConditions/PaymentConditions";
import Settings from "../pages/settings/Settings";
import AccountingAccount from "../pages/accountingAccount/AccountingAccount";
import AccountingAccounts from "../pages/accountingAccounts/AccountingAccounts";
import Reports from "../pages/reports/Reports";
import Report from "../pages/report/Report";
import { useLoginService } from "../services/useLoginService";
import { useToastr } from "../hooks/useToastr";
import { Loading } from "../pages/loading/Loading";
import ReportGenerate from "../pages/reportGenerate/ReportGenerate";
import ProductRequests from "../pages/productRequests/ProductRequests";
import ProductRequest from "../pages/productRequest/ProductRequest";
import Products from "../pages/products/Products";
import Approvals from "../pages/approvals/Approvals";

const AppRouter = () => {
  const { state: userState, setState: setUserState } = useAuth();
  const sessionStorage = useSessionStorage();
  const { findSession } = useLoginService();
  const toastr = useToastr();
  const [loading, setLoading] = useState(false);

  const handleAuthenticatePlatform = useCallback(async () => {
    if (process.env.REACT_APP_USE_SENIORX === "YES") {
      setLoading(true);
      await user
        .getToken()
        .then(async (token) => {
          const userState: IUserToken = {
            access_token: token.access_token,
            email: token.email,
            expires_in: token.expires_in,
            logged: true,
            name: token.fullName?.replaceAll("+", " "),
            refresh_token: token.refresh_token,
            tenantDomain: token.tenantDomain,
            username: token.username,
            typeAuth: "platform",
            costCenter: null,
            wallet: null,
            branchOffice: null,
            resources: [],
            erpUrl: "",
            headOffices: [],
          };

          try {
            const resource = await findSession({
              access_token: userState.access_token,
              expires_in: userState.expires_in,
              refresh_token: userState.refresh_token,
              username: userState.username,
            });

            resource.logged = true;
            resource.typeAuth = "platform";

            sessionStorage.setItem("@PORTAL-COMPRAS:user", resource);
            setUserState({ ...resource });
          } catch (error) {
            toastr.error("Erro ao se autenticar na api, contate o suporte");
          }
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    handleAuthenticatePlatform();
  }, []);

  return (
    <Routes>
      {!userState.access_token && (
        <>
          {loading ? (
            <Route
              path="*"
              element={<Loading title="Sicredi Dexis | Portal Compras" />}
            />
          ) : (
            <>
              <Route
                path="/"
                element={<Login title="Sicredi Dexis | Portal Compras" />}
              />

              <Route
                path="*"
                element={<Login title="Sicredi Dexis | Dashboard" />}
              />
            </>
          )}
        </>
      )}
      {userState.access_token && (
        <>
          {userState.resources.some(
            (item) => item === "categorias-portal-compras"
          ) && (
            <>
              <Route
                path="/categories"
                element={<Categories title="Sicredi Dexis | Categorias" />}
              />

              <Route
                path="/category"
                element={<Category title="Sicredi Dexis | Categoria" />}
              />

              <Route
                path="/category/:id"
                element={<Category title="Sicredi Dexis | Categoria" />}
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "configuracoes-portal-compras"
          ) && (
            <>
              <Route
                path="/settings"
                element={<Settings title="Sicredi Dexis | Configurações" />}
              />

              <Route
                path="/head-offices"
                element={<HeadOffices title="Sicredi Dexis | Empresas" />}
              />

              <Route
                path="/head-office"
                element={<HeadOffice title="Sicredi Dexis | Empresa" />}
              />

              <Route
                path="/head-office/:id"
                element={<HeadOffice title="Sicredi Dexis | Empresa" />}
              />

              <Route
                path="/users"
                element={<Users title="Sicredi Dexis | Usuários" />}
              />

              <Route
                path="/user"
                element={<User title="Sicredi Dexis | Usuário" />}
              />

              <Route
                path="/user/:id"
                element={<User title="Sicredi Dexis | Usuário" />}
              />

              <Route
                path="/configure-applications"
                element={
                  <ConfigureApplications title="Sicredi Dexis | Configuração de Aplicações" />
                }
              />

              <Route
                path="/configure-application"
                element={
                  <ConfigureApplication title="Sicredi Dexis | Configuração de Aplicação" />
                }
              />

              <Route
                path="/configure-application/:id"
                element={
                  <ConfigureApplication title="Sicredi Dexis | Configuração de Aplicação" />
                }
              />

              <Route
                path="/custom-fields"
                element={
                  <CustomFields title="Sicredi Dexis | Campos customizados" />
                }
              />

              <Route
                path="/custom-field"
                element={
                  <CustomField title="Sicredi Dexis | Campo customizado" />
                }
              />

              <Route
                path="/custom-field/:id"
                element={
                  <CustomField title="Sicredi Dexis | Campo customizado" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "conta-contabil-portal-compras"
          ) && (
            <>
              <Route
                path="/accounting-accounts"
                element={
                  <AccountingAccounts title="Sicredi Dexis | Contas contábeis" />
                }
              />

              <Route
                path="/accounting-account"
                element={
                  <AccountingAccount title="Sicredi Dexis | Conta contábil" />
                }
              />

              <Route
                path="/accounting-account/:id"
                element={
                  <AccountingAccount title="Sicredi Dexis | Conta contábil" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "centro-custo-portal-compras"
          ) && (
            <>
              <Route
                path="/cost-centers"
                element={
                  <CostCenters title="Sicredi Dexis | Centro de Custos" />
                }
              />

              <Route
                path="/cost-center"
                element={<CostCenter title="Sicredi Dexis | Centro de Custo" />}
              />

              <Route
                path="/cost-center/:id"
                element={<CostCenter title="Sicredi Dexis | Centro de Custo" />}
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "customizacao-portal-compras"
          ) && (
            <>
              <Route
                path="/custom-field-document-types"
                element={
                  <CustomFieldDocumentTypes title="Sicredi Dexis | Tipos de documentos dos campos customizados" />
                }
              />

              <Route
                path="/custom-field-document-type"
                element={
                  <CustomFieldDocumentType title="Sicredi Dexis | Tipo de documento do campo customizado" />
                }
              />

              <Route
                path="/custom-field-document-type/:id"
                element={
                  <CustomFieldDocumentType title="Sicredi Dexis | Tipo de documento do campo customizado" />
                }
              />

              <Route
                path="/custom-field-types"
                element={
                  <CustomFieldTypes title="Sicredi Dexis | Tipos de campos customizados" />
                }
              />

              <Route
                path="/custom-field-type"
                element={
                  <CustomFieldType title="Sicredi Dexis | Tipo de campo customizado" />
                }
              />

              <Route
                path="/custom-field-type/:id"
                element={
                  <CustomFieldType title="Sicredi Dexis | Tipo de campo customizado" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "forma-pagamento-portal-compras"
          ) && (
            <>
              <Route
                path="/payment-forms"
                element={
                  <PaymentForms title="Sicredi Dexis | Forma de pagamento" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "condicao-pagamento-portal-compras"
          ) && (
            <>
              <Route
                path="/payment-conditions"
                element={
                  <PaymentConditions title="Sicredi Dexis | Condição de pagamento" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "projetos-portal-compras"
          ) && (
            <>
              <Route
                path="/projects"
                element={<Projects title="Sicredi Dexis | Projetos" />}
              />

              <Route
                path="/project"
                element={<Project title="Sicredi Dexis | Projeto" />}
              />

              <Route
                path="/project/:id"
                element={<Project title="Sicredi Dexis | Projeto" />}
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "cadastro-produtos-portal-compras"
          ) && (
            <>
              <Route
                path="/product-requests"
                element={
                  <ProductRequests title="Sicredi Dexis | Solicitação de Produto" />
                }
              />

              <Route
                path="/product-request"
                element={
                  <ProductRequest title="Sicredi Dexis | Solicitação de Produto" />
                }
              />

              <Route
                path="/product-request/:id"
                element={
                  <ProductRequest title="Sicredi Dexis | Solicitação de Produto" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "produtos-portal-compras"
          ) && (
            <>
              <Route
                path="/products"
                element={<Products title="Sicredi Dexis | Produtos" />}
              />

              <Route
                path="/product"
                element={<Product title="Sicredi Dexis | Produto" />}
              />

              <Route
                path="/product/:id"
                element={<Product title="Sicredi Dexis | Produto" />}
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "solicitacao-compra-portal-compras"
          ) && (
            <>
              <Route
                path="/purchase-requests"
                element={
                  <PurchaseRequests title="Sicredi Dexis | Solicitações de compras" />
                }
              />

              <Route
                path="/purchase-request"
                element={
                  <PurchaseRequest title="Sicredi Dexis | Solicitação de compra" />
                }
              />

              <Route
                path="/purchase-request/:id"
                element={
                  <PurchaseRequest title="Sicredi Dexis | Solicitação de compra" />
                }
              />

              <Route
                path="/purchase-request-item"
                element={
                  <PurchaseRequestItem title="Sicredi Dexis | Item solicitação de compra" />
                }
              />

              <Route
                path="/purchase-request-item/:id"
                element={
                  <PurchaseRequestItem title="Sicredi Dexis | Item solicitação de compra" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "tipo-solicitacao-compra-portal-compras"
          ) && (
            <>
              <Route
                path="/purchase-request-types"
                element={
                  <PurchaseRequestTypes title="Sicredi Dexis | Tipos de solicitações" />
                }
              />

              <Route
                path="/purchase-request-type"
                element={
                  <PurchaseRequestType title="Sicredi Dexis | Tipo de solicitação" />
                }
              />

              <Route
                path="/purchase-request-type/:id"
                element={
                  <PurchaseRequestType title="Sicredi Dexis | Tipo de solicitação" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "motivo-compra-portal-compras"
          ) && (
            <>
              <Route
                path="/purchase-request-reasons"
                element={
                  <PurchaseRequestReasons title="Sicredi Dexis | Motivo de solicitação" />
                }
              />

              <Route
                path="/purchase-request-reason"
                element={
                  <PurchaseRequestReason title="Sicredi Dexis | Motivo de solicitação" />
                }
              />

              <Route
                path="/purchase-request-reason/:id"
                element={
                  <PurchaseRequestReason title="Sicredi Dexis | Motivo de solicitação" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "requisicao-estoque-portal-compras"
          ) && (
            <>
              <Route
                path="/stock-requests"
                element={
                  <StockRequests title="Sicredi Dexis | Requisições de estoques" />
                }
              />

              <Route
                path="/stock-request"
                element={
                  <StockRequest title="Sicredi Dexis | Requisição de estoque" />
                }
              />

              <Route
                path="/stock-request/:id"
                element={
                  <StockRequest title="Sicredi Dexis | Requisição de estoque" />
                }
              />

              <Route
                path="/stock-request-item"
                element={
                  <StockRequestItem title="Sicredi Dexis | Item requisição de estoque" />
                }
              />

              <Route
                path="/stock-request-item/:id"
                element={
                  <StockRequestItem title="Sicredi Dexis | Item requisição de estoque" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "tipo-requisicao-estoque-portal-compras"
          ) && (
            <>
              <Route
                path="/stock-request-types"
                element={
                  <StockRequestTypes title="Sicredi Dexis | Tipos de requisiçaõ" />
                }
              />

              <Route
                path="/stock-request-type"
                element={
                  <StockRequestType title="Sicredi Dexis | Tipo de requisição" />
                }
              />

              <Route
                path="/stock-request-type/:id"
                element={
                  <StockRequestType title="Sicredi Dexis | Tipo de requisição" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "fornecedores-portal-compras"
          ) && (
            <>
              <Route
                path="/suppliers-bank-details"
                element={
                  <SuppliersBankDetails title="Sicredi Dexis | Fornecedores" />
                }
              />

              <Route
                path="/suppliers-bank-details/:id"
                element={
                  <SuppliersBankDetails title="Sicredi Dexis | Fornecedores" />
                }
              />

              <Route
                path="/suppliers"
                element={<Suppliers title="Sicredi Dexis | Fornecedores" />}
              />

              {userState.resources.some(
                (item) => item === "cadastro-fornecedores-portal-compras"
              ) && (
                <>
                  <Route
                    path="/supplier"
                    element={<Supplier title="Sicredi Dexis | Fornecedor" />}
                  />

                  <Route
                    path="/supplier/:id"
                    element={<Supplier title="Sicredi Dexis | Fornecedor" />}
                  />
                </>
              )}
            </>
          )}

          {userState.resources.some(
            (item) => item === "order-estatistica-wallet-portal-compras"
          ) && (
            <>
              <Route
                path="/wallets"
                element={
                  <Wallets title="Sicredi Dexis | Ordem Estatística / Wallet" />
                }
              />

              <Route
                path="/wallet"
                element={
                  <Wallet title="Sicredi Dexis | Ordem Estatística / Wallet" />
                }
              />

              <Route
                path="/wallet/:id"
                element={
                  <Wallet title="Sicredi Dexis | Ordem Estatística / Wallet" />
                }
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "aprovacao-portal-compras"
          ) && (
            <>
              <Route
                path="/approvals"
                element={<Approvals title="Sicredi Dexis | Aprovações" />}
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "cadastros-relatorios-portal-compras"
          ) && (
            <>
              <Route
                path="/reports"
                element={<Reports title="Sicredi Dexis | Relatórios" />}
              />

              <Route
                path="/report"
                element={<Report title="Sicredi Dexis | Relatório" />}
              />

              <Route
                path="/report/:id"
                element={<Report title="Sicredi Dexis | Relatório" />}
              />
            </>
          )}

          {userState.resources.some(
            (item) => item === "relatorios-portal-compras"
          ) && (
            <>
              <Route
                path="/reports-generate"
                element={<ReportGenerate title="Sicredi Dexis | Relatórios" />}
              />
            </>
          )}

          <Route
            path="/dashboard"
            element={<Dashboard title="Sicredi Dexis | Dashboard" />}
          />

          <Route
            path="*"
            element={<Dashboard title="Sicredi Dexis | Dashboard" />}
          />
        </>
      )}
    </Routes>
  );
};

export default AppRouter;
