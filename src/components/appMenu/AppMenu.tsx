import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SettingsIcon from "@mui/icons-material/Settings";
import List from "@mui/material/List";
import { Avatar, IconButton, Menu, SwipeableDrawer } from "@mui/material";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";

import { useAuth } from "../../hooks/auth";
import logoImg from "../../assets/logo-sicredi.svg";
import useWindowDimensions from "../../util/useWindowDimensions";

import {
  AppMenuStyled,
  UserMenu,
  MenuStyled,
  AppMenuInfo,
  MenuButton,
  LogoLarge,
  MenuContentLarge,
  MenuItemCustom,
  LogoSmall,
  MenuContentSmall,
  ListItemTextMenuSmall,
  ListItemMenuSmall,
  ListItemTileMenuSmall,
} from "./AppMenu.styled";
import { useSessionStorage } from "../../services/useSessionStorage";
import IUserToken from "../../interfaces/IUserToken";

const AppMenu = () => {
  const navigate = useNavigate();
  const pathLocation = useLocation();
  const { width } = useWindowDimensions();
  const { state: userState, signOut } = useAuth();
  const sessionStorage = useSessionStorage();

  const [userResources] = useState<string[]>(() => {
    const state: IUserToken = sessionStorage.getItem("@PORTAL-COMPRAS:user");
    return state ? state.resources : [];
  });

  const [anchorRegistersMenuLarge, setAnchorRegistersMenuLarge] =
    useState<null | HTMLElement>(null);
  const openRegistersMenuLarge = Boolean(anchorRegistersMenuLarge);

  const [anchorCustomizationsMenuLarge, setAnchorCustomizationsMenuLarge] =
    useState<null | HTMLElement>(null);
  const openCustomizationsMenuLarge = Boolean(anchorCustomizationsMenuLarge);

  const [anchorUserMenu, setAnchorUserMenu] = useState<null | HTMLElement>(
    null
  );
  const open = Boolean(anchorUserMenu);

  // const [erpUrl] = useState(() => {
  //   const state: IUserToken = sessionStorage.getItem("@PORTAL-COMPRAS:user");
  //   return state ? state?.erpUrl : "";
  // });

  // const [token] = useState(() => {
  //   const state: IUserToken = sessionStorage.getItem("@PORTAL-COMPRAS:user");
  //   return state ? state?.access_token : "";
  // });

  const [isScreenSmall, setIsScreenSmall] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toogleMenuPoint] = useState(1100);
  const [registrationMenuOpen, setRegistrationMenuOpen] = useState(false);
  const [customizationMenuOpen, setCustomizationMenuOpen] = useState(false);

  const [accessToRegistrations, setAccessToRegistrations] = useState(false);
  const [accessToStockRequest, setAccessToStockRequest] = useState(false);
  const [accessToPurchaseRequest, setAccessToPurchaseRequest] = useState(false);
  const [accessToAprovation, setAccessToAprovation] = useState(false);
  const [accessToReports, setAccessToReports] = useState(false);
  const [accessToSettings, setAccessToSettings] = useState(false);

  const walletSelected = useMemo(() => {
    return (
      pathLocation.pathname.includes("/wallets") ||
      pathLocation.pathname.includes("/wallet")
    );
  }, [pathLocation.pathname]);

  const categorySelected = useMemo(() => {
    return (
      pathLocation.pathname.includes("/categories") ||
      pathLocation.pathname.includes("/category")
    );
  }, [pathLocation.pathname]);

  const accountingAccountSelected = useMemo(() => {
    return pathLocation.pathname.includes("/accounting-account");
  }, [pathLocation.pathname]);

  const costCenterSelected = useMemo(() => {
    return pathLocation.pathname.includes("/cost-center");
  }, [pathLocation.pathname]);

  const supplierSelected = useMemo(() => {
    return pathLocation.pathname.includes("/supplier");
  }, [pathLocation.pathname]);

  const productSelected = useMemo(() => {
    return (
      (pathLocation.pathname.includes("/products") ||
        pathLocation.pathname.includes("/product")) &&
      !pathLocation.pathname.includes("/product-request")
    );
  }, [pathLocation.pathname]);

  const productRequestSelected = useMemo(() => {
    return (
      pathLocation.pathname.includes("/product-requests") ||
      pathLocation.pathname.includes("/product-request")
    );
  }, [pathLocation.pathname]);

  const paymentConditionSelected = useMemo(() => {
    return (
      pathLocation.pathname.includes("/payment-conditions") ||
      pathLocation.pathname.includes("/payment-condition")
    );
  }, [pathLocation.pathname]);

  const paymentFormSelected = useMemo(() => {
    return (
      pathLocation.pathname.includes("/payment-forms") ||
      pathLocation.pathname.includes("/payment-form")
    );
  }, [pathLocation.pathname]);

  const projectSelected = useMemo(() => {
    return (
      pathLocation.pathname.includes("/projects") ||
      pathLocation.pathname.includes("/project")
    );
  }, [pathLocation.pathname]);

  const stockRequestTypeSelected = useMemo(() => {
    return (
      pathLocation.pathname === "/stock-request-types" ||
      pathLocation.pathname.includes("/stock-request-type")
    );
  }, [pathLocation.pathname]);

  const purchaseRequestTypeSelected = useMemo(() => {
    return (
      pathLocation.pathname === "/purchase-request-types" ||
      pathLocation.pathname.includes("/purchase-request-type")
    );
  }, [pathLocation.pathname]);

  const purchaseRequestReasonSelected = useMemo(() => {
    return (
      pathLocation.pathname === "/purchase-request-reasons" ||
      pathLocation.pathname.includes("/purchase-request-reason")
    );
  }, [pathLocation.pathname]);

  const stockRequestsSelected = useMemo(() => {
    return (
      pathLocation.pathname === "/stock-requests" ||
      pathLocation.pathname.includes("/stock-request-item") ||
      pathLocation.pathname.includes("/stock-request/")
    );
  }, [pathLocation.pathname]);

  const purchaseRequestsSelected = useMemo(() => {
    return (
      pathLocation.pathname === "/purchase-requests" ||
      pathLocation.pathname.includes("/purchase-request-item") ||
      pathLocation.pathname.includes("/purchase-request/")
    );
  }, [pathLocation.pathname]);

  const customFieldTypesSelected = useMemo(() => {
    return (
      pathLocation.pathname === "/custom-field-types" ||
      pathLocation.pathname.includes("/custom-field-type") ||
      pathLocation.pathname.includes("/custom-field-type/")
    );
  }, [pathLocation.pathname]);

  const customFieldDocumentTypesSelected = useMemo(() => {
    return (
      pathLocation.pathname === "/custom-field-document-types" ||
      pathLocation.pathname === "/custom-field-document-type" ||
      pathLocation.pathname.includes("/custom-field-document-type/")
    );
  }, [pathLocation.pathname]);

  const approvalsSelected = useMemo(() => {
    return pathLocation.pathname === "/approvals";
  }, [pathLocation.pathname]);

  const reportSelected = useMemo(() => {
    return (
      pathLocation.pathname === "/reports" ||
      (pathLocation.pathname.includes("/report") &&
        !pathLocation.pathname.includes("/reports-generate"))
    );
  }, [pathLocation.pathname]);

  const reportGenerateSelected = useMemo(() => {
    return pathLocation.pathname === "/reports-generate";
  }, [pathLocation.pathname]);

  useEffect(() => {
    if (width < toogleMenuPoint) {
      setIsScreenSmall(true);
      setIsMenuOpen(false);
    } else {
      setIsScreenSmall(false);
    }
  }, [width]);

  const getAvatar = (): string => {
    try {
      const firstLetter = userState.name?.split("")[0]?.toUpperCase();
      const lastLetter = userState.name
        ?.split(" ")
        [userState.name?.split(" ").length - 1]?.split("")[0]
        ?.toUpperCase();
      return `${firstLetter}${lastLetter}`;
    } catch (error) {
      return userState.name?.split("")[0]?.toUpperCase();
    }
  };

  const getName = () => {
    return userState.name?.split(" ")[0];
  };

  const logout = () => {
    signOut();
    navigate("/");
  };

  const handleClickRegisterMenuLarge = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorRegistersMenuLarge(event.currentTarget);
  };

  const handleCloseRegisterMenuLarge = () => {
    setAnchorRegistersMenuLarge(null);
  };

  const handleNavigate = (to: string) => {
    handleCloseRegisterMenuLarge();
    navigate(to);
  };

  const handleClickCustomizationMenuLarge = (
    event: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    setAnchorCustomizationsMenuLarge(event.currentTarget);
  };

  // const handleClickLinkDecisionCenter = () => {
  //   const link = document.createElement("a");
  //   link.href = "https://platform.senior.com.br/decision-center";

  //   link.target = "_blank";
  //   link.click();
  // };

  // const handleClickLinkReports = useCallback(() => {
  //   const link = document.createElement("a");

  //   link.href = `${erpUrl}/sapiensweb/indexg7.htm?tokeng7=${token}&menug7=comenug7.htm&urlg7=https://platform.senior.com.br`;

  //   link.target = "_blank";
  //   link.click();
  // }, [erpUrl, token]);

  const handleCloseCustomizationMenuLarge = () => {
    handleCloseRegisterMenuLarge();
    setAnchorCustomizationsMenuLarge(null);
  };

  const getAppMenuLarge = () => {
    return (
      <MenuContentLarge>
        <LogoLarge onClick={() => navigate("/dashboard")}>
          <img src={logoImg} alt="" />
        </LogoLarge>

        {accessToRegistrations && (
          <>
            <MenuButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClickRegisterMenuLarge}
            >
              Cadastros
            </MenuButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorRegistersMenuLarge}
              open={openRegistersMenuLarge}
              onClose={handleCloseRegisterMenuLarge}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {userResources.some(
                (item) => item === "order-estatistica-wallet-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("wallets");
                  }}
                  selected={walletSelected}
                >
                  Ordem Estatística / Wallet
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "categorias-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("categories");
                  }}
                  selected={categorySelected}
                >
                  Categorias
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "conta-contabil-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("accounting-accounts");
                  }}
                  selected={accountingAccountSelected}
                >
                  Contas contábeis
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "centro-custo-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("cost-centers");
                  }}
                  selected={costCenterSelected}
                >
                  Centro de custos
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "condicao-pagamento-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("payment-conditions");
                  }}
                  selected={paymentConditionSelected}
                >
                  Condição de Pagamento
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "forma-pagamento-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("payment-forms");
                  }}
                  selected={paymentFormSelected}
                >
                  Forma de Pagamento
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "fornecedores-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("suppliers");
                  }}
                  selected={supplierSelected}
                >
                  Fornecedores
                </MenuItemCustom>
              )}

              {userState.resources.some(
                (item) => item === "cadastro-produtos-portal-compras"
              ) && (
                <>
                  <MenuItemCustom
                    onClick={() => {
                      handleNavigate("product-requests");
                    }}
                    selected={productRequestSelected}
                  >
                    Cadastro de Produtos/Serviços
                  </MenuItemCustom>
                </>
              )}

              {userResources.some(
                (item) => item === "produtos-portal-compras"
              ) && (
                <>
                  <MenuItemCustom
                    onClick={() => {
                      handleNavigate("products");
                    }}
                    selected={productSelected}
                  >
                    Consulta de Produtos/Serviços
                  </MenuItemCustom>
                </>
              )}

              {userResources.some(
                (item) => item === "projetos-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("projects");
                  }}
                  selected={projectSelected}
                >
                  Projetos
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "tipo-requisicao-estoque-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("stock-request-types");
                  }}
                  selected={stockRequestTypeSelected}
                >
                  Tipos de requisições de estoque
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "tipo-solicitacao-compra-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("purchase-request-types");
                  }}
                  selected={purchaseRequestTypeSelected}
                >
                  Tipos de solicitações de compras
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "motivo-compra-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    handleNavigate("purchase-request-reasons");
                  }}
                  selected={purchaseRequestReasonSelected}
                >
                  Motivo de compras
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "cadastros-relatorios-portal-compras"
              ) && (
                <MenuItemCustom
                  onClick={() => {
                    navigate("reports");
                    handleCloseRegisterMenuLarge();
                  }}
                  selected={reportSelected}
                >
                  Relatórios
                </MenuItemCustom>
              )}

              {userResources.some(
                (item) => item === "customizacao-portal-compras"
              ) && (
                <div>
                  <MenuItemCustom
                    selected={
                      customFieldDocumentTypesSelected ||
                      customFieldTypesSelected
                    }
                    onClick={(e) => {
                      handleClickCustomizationMenuLarge(e);
                    }}
                  >
                    Customização
                  </MenuItemCustom>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorCustomizationsMenuLarge}
                    open={openCustomizationsMenuLarge}
                    onClose={handleCloseCustomizationMenuLarge}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItemCustom
                      onClick={() => {
                        navigate("custom-field-types");
                        handleCloseCustomizationMenuLarge();
                      }}
                      selected={customFieldTypesSelected}
                    >
                      Tipos de campos customizados
                    </MenuItemCustom>

                    <MenuItemCustom
                      onClick={() => {
                        navigate("custom-field-document-types");
                        handleCloseCustomizationMenuLarge();
                      }}
                      selected={customFieldDocumentTypesSelected}
                    >
                      Tipos de documentos dos campos customizados
                    </MenuItemCustom>
                  </Menu>
                </div>
              )}
            </Menu>
          </>
        )}

        {accessToStockRequest && (
          <MenuButton
            variant="text"
            onClick={() => navigate("stock-requests")}
            selected={stockRequestsSelected}
          >
            Requisição de estoque
          </MenuButton>
        )}

        {accessToPurchaseRequest && (
          <MenuButton
            variant="text"
            onClick={() => navigate("purchase-requests")}
            selected={purchaseRequestsSelected}
          >
            Solicitação de compra
          </MenuButton>
        )}

        {accessToAprovation && (
          <MenuButton
            variant="text"
            onClick={() => navigate("approvals")}
            selected={approvalsSelected}
          >
            Aprovações
          </MenuButton>
        )}

        {accessToReports && (
          <MenuButton
            variant="text"
            onClick={() => navigate("reports-generate")}
            selected={reportGenerateSelected}
          >
            Relatórios
          </MenuButton>
        )}

        {/* {accessToReports && erpUrl && erpUrl.length > 10 && (
          <MenuButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClickLinkReports}
          >
            Relatórios
          </MenuButton>
        )} */}
      </MenuContentLarge>
    );
  };

  const getAppMenuSmall = () => {
    return (
      <MenuContentSmall>
        <LogoSmall
          onClick={() => {
            navigate("/dashboard");
            setIsMenuOpen(false);
          }}
        >
          <img src={logoImg} alt="" />
        </LogoSmall>

        <List>
          {accessToRegistrations && (
            <>
              <ListItemMenuSmall
                key="registrations"
                disablePadding
                onClick={() => {
                  setRegistrationMenuOpen(!registrationMenuOpen);
                }}
              >
                <ListItemTileMenuSmall primary="Cadastros" selected={false} />

                {registrationMenuOpen ? (
                  <ArrowDropUpOutlinedIcon />
                ) : (
                  <ArrowDropDownOutlinedIcon />
                )}
              </ListItemMenuSmall>
              {registrationMenuOpen && (
                <List>
                  {userResources.some(
                    (item) => item === "order-estatistica-wallet-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("wallets");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Ordem Estatística / Wallet"
                        selected={walletSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "categorias-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("categories");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Categorias"
                        selected={categorySelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "conta-contabil-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("accounting-accounts");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Contas contábeis"
                        selected={accountingAccountSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "centro-custo-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("cost-centers");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Centro de custos"
                        selected={costCenterSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "condicao-pagamento-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("payment-conditions");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Condição de pagamento"
                        selected={paymentConditionSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "forma-pagamento-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("payment-forms");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Forma de pagamento"
                        selected={paymentFormSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "fornecedores-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("suppliers");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Fornecedores"
                        selected={supplierSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userState.resources.some(
                    (item) => item === "cadastro-produtos-portal-compras"
                  ) && (
                    <>
                      <ListItemMenuSmall
                        onClick={() => {
                          navigate("product-requests");
                          setIsMenuOpen(false);
                        }}
                      >
                        <ListItemTextMenuSmall
                          primary="Cadastro de Produtos/Serviços"
                          selected={productRequestSelected}
                        />
                      </ListItemMenuSmall>
                    </>
                  )}

                  {userResources.some(
                    (item) => item === "produtos-portal-compras"
                  ) && (
                    <>
                      <ListItemMenuSmall
                        onClick={() => {
                          navigate("products");
                          setIsMenuOpen(false);
                        }}
                      >
                        <ListItemTextMenuSmall
                          primary="Consulta de Produtos/Serviços"
                          selected={productSelected}
                        />
                      </ListItemMenuSmall>
                    </>
                  )}

                  {userResources.some(
                    (item) => item === "projetos-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("projects");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Projetos"
                        selected={projectSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "tipo-requisicao-estoque-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("stock-request-types");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Tipos de requisições de estoque"
                        selected={stockRequestTypeSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "tipo-solicitacao-compra-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("purchase-request-types");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Tipos de solicitação de compras"
                        selected={purchaseRequestTypeSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "motivo-compra-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("purchase-request-reasons");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Motivo de solicitação de compras"
                        selected={purchaseRequestReasonSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "cadastros-relatorios-portal-compras"
                  ) && (
                    <ListItemMenuSmall
                      onClick={() => {
                        navigate("reports");
                        setIsMenuOpen(false);
                      }}
                    >
                      <ListItemTextMenuSmall
                        primary="Relatórios"
                        selected={reportSelected}
                      />
                    </ListItemMenuSmall>
                  )}

                  {userResources.some(
                    (item) => item === "customizacao-portal-compras"
                  ) && (
                    <div>
                      <ListItemMenuSmall
                        key="customFields"
                        disablePadding
                        onClick={() => {
                          setCustomizationMenuOpen(!customizationMenuOpen);
                        }}
                      >
                        <ListItemTextMenuSmall
                          primary="Customização"
                          selected={
                            customFieldDocumentTypesSelected ||
                            customFieldTypesSelected
                          }
                        />

                        {customizationMenuOpen ? (
                          <ArrowDropUpOutlinedIcon />
                        ) : (
                          <ArrowDropDownOutlinedIcon />
                        )}
                      </ListItemMenuSmall>
                      {customizationMenuOpen && (
                        <List>
                          <ListItemMenuSmall
                            onClick={() => {
                              navigate("custom-field-types");
                              setIsMenuOpen(false);
                              setCustomizationMenuOpen(false);
                            }}
                          >
                            <ListItemTextMenuSmall
                              primary="Tipos de campos customizados"
                              selected={customFieldTypesSelected}
                            />
                          </ListItemMenuSmall>

                          <ListItemMenuSmall
                            onClick={() => {
                              navigate("custom-field-document-types");
                              setIsMenuOpen(false);
                              setCustomizationMenuOpen(false);
                            }}
                          >
                            <ListItemTextMenuSmall
                              primary="Tipos de documentos campos cust..."
                              selected={customFieldDocumentTypesSelected}
                            />
                          </ListItemMenuSmall>
                        </List>
                      )}
                    </div>
                  )}
                </List>
              )}
            </>
          )}

          {accessToStockRequest && (
            <ListItemMenuSmall
              key="stock-request"
              disablePadding
              onClick={() => {
                navigate("stock-requests");
                setIsMenuOpen(false);
              }}
            >
              <ListItemTileMenuSmall
                primary="Requisições de estoque"
                selected={stockRequestsSelected}
              />
            </ListItemMenuSmall>
          )}

          {accessToPurchaseRequest && (
            <ListItemMenuSmall
              key="purchase-request"
              disablePadding
              onClick={() => {
                navigate("purchase-requests");
                setIsMenuOpen(false);
              }}
            >
              <ListItemTileMenuSmall
                primary="Solicitação de compra"
                selected={purchaseRequestsSelected}
              />
            </ListItemMenuSmall>
          )}

          {accessToAprovation && (
            <ListItemMenuSmall
              key="approvals"
              disablePadding
              onClick={() => {
                navigate("approvals");
                setIsMenuOpen(false);
              }}
            >
              <ListItemTileMenuSmall
                primary="Aprovações"
                selected={approvalsSelected}
              />
            </ListItemMenuSmall>
          )}

          {accessToReports && (
            <ListItemMenuSmall
              key="reports-generate"
              disablePadding
              onClick={() => {
                navigate("reports-generate");
                setIsMenuOpen(false);
              }}
            >
              <ListItemTileMenuSmall
                primary="Relatórios"
                selected={reportGenerateSelected}
              />
            </ListItemMenuSmall>
          )}

          {/* {accessToReports && erpUrl && erpUrl.length > 10 && (
            <ListItemMenuSmall key="report" disablePadding>
              <ListItemTileMenuSmall
                primary="Relatórios"
                selected={false}
                onClick={handleClickLinkReports}
              />
            </ListItemMenuSmall>
          )} */}
        </List>
      </MenuContentSmall>
    );
  };

  const handleAccessToRegistrations = useCallback(() => {
    const registrationsResources = [
      "order-estatistica-wallet-portal-compras",
      "categorias-portal-compras",
      "centro-custo-portal-compras",
      "condicao-pagamento-portal-compras",
      "forma-pagamento-portal-compras",
      "fornecedores-portal-compras",
      "produtos-portal-compras",
      "projetos-portal-compras",
      "tipo-requisicao-estoque-portal-compras",
      "tipo-solicitacao-compra-portal-compras",
      "motivo-compra-portal-compras",
      "customizacao-portal-compras",
    ];

    for (const resource of userResources) {
      if (registrationsResources.includes(resource)) {
        setAccessToRegistrations(true);
      }
    }
  }, [userState]);

  const handleAccessToStockRequest = useCallback(() => {
    const stockRequestResources = ["solicitacao-compra-portal-compras"];

    for (const resource of userResources) {
      if (stockRequestResources.includes(resource)) {
        setAccessToStockRequest(true);
      }
    }
  }, [userState]);

  const handleAccessToPurchaseRequest = useCallback(() => {
    const purchaseRequestResources = ["solicitacao-compra-portal-compras"];

    for (const resource of userResources) {
      if (purchaseRequestResources.includes(resource)) {
        setAccessToPurchaseRequest(true);
      }
    }
  }, [userState]);

  const handleAccessToAprovation = useCallback(() => {
    const purchaseRequestResources = ["aprovacao-portal-compras"];

    for (const resource of userResources) {
      if (purchaseRequestResources.includes(resource)) {
        setAccessToAprovation(true);
      }
    }
  }, [userState]);

  const handleAccessToReports = useCallback(() => {
    const purchaseRequestResources = ["relatorios-portal-compras"];

    for (const resource of userResources) {
      if (purchaseRequestResources.includes(resource)) {
        setAccessToReports(true);
      }
    }
  }, [userState]);

  const handleAccessToSettings = useCallback(() => {
    const settingsResources = ["configuracoes-portal-compras"];

    for (const resource of userResources) {
      if (settingsResources.includes(resource)) {
        setAccessToSettings(true);
      }
    }
  }, [userState]);

  useEffect(() => {
    handleAccessToRegistrations();
    handleAccessToStockRequest();
    handleAccessToPurchaseRequest();
    handleAccessToAprovation();
    handleAccessToReports();
    handleAccessToSettings();
  }, []);

  return (
    <AppMenuStyled logged={userState.logged} isScreenSmall={isScreenSmall}>
      <MenuStyled isScreenSmall={isScreenSmall}>
        {isScreenSmall ? (
          <>
            <MenuButton
              onClick={() => setIsMenuOpen(true)}
              sx={{ position: "absolute", left: -25, top: -17.5 }}
            >
              <MenuIcon sx={{ color: "#5A635A" }} />
            </MenuButton>
            <SwipeableDrawer
              anchor="left"
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onOpen={() => setIsMenuOpen(true)}
              PaperProps={{
                sx: { display: "flex", alignItems: "flex-start" },
              }}
            >
              {getAppMenuSmall()}
            </SwipeableDrawer>
          </>
        ) : (
          getAppMenuLarge()
        )}
      </MenuStyled>

      <AppMenuInfo>
        <MenuButton
          variant="text"
          color="inherit"
          id="menu-button"
          aria-controls={open ? "menu-button" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(e) => setAnchorUserMenu(e.currentTarget)}
          endIcon={
            userState.typeAuth !== "platform" &&
            (anchorUserMenu ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)
          }
          disabled={userState.typeAuth === "platform"}
        >
          <Avatar sx={{ width: 24, height: 24, fontSize: "12px" }}>
            {getAvatar()}
          </Avatar>
          {width > toogleMenuPoint && (
            <span style={{ marginLeft: "16px" }}>{getName()}</span>
          )}
        </MenuButton>
        <UserMenu
          id="menu-button"
          anchorEl={anchorUserMenu}
          open={open}
          onClose={() => setAnchorUserMenu(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {userState.typeAuth !== "platform" && (
            <MenuItemCustom
              sx={{ minWidth: "150px" }}
              onClick={() => {
                setAnchorUserMenu(null);
                logout();
              }}
            >
              Sair
            </MenuItemCustom>
          )}
        </UserMenu>

        {accessToSettings && (
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={() => navigate("settings")}
            sx={{ color: "#5A635A" }}
          >
            <SettingsIcon />
          </IconButton>
        )}
      </AppMenuInfo>
    </AppMenuStyled>
  );
};

export default AppMenu;
