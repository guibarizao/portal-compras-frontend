import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormHelperText, Grid, TextField, FormControl } from "@mui/material";

import AsyncSearch, { IOption } from "../../components/asyncSearch/AsyncSearch";
import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import IPurchaseRequestItem from "../../interfaces/IPurchaseRequestItem";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { InfoProduct, Span } from "./PurchaseRequestItem.styles";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { usePurchaseRequestItemService } from "../../services/usePurchaseRequestItemService";
import IProduct from "../../interfaces/IProduct";
import { useProductService } from "../../services/useProductService";
import IFormError from "../../interfaces/IFormError";
import getValidationError from "../../util/getValidationError";
import ICostCenter from "../../interfaces/ICostCenter";
import IProject from "../../interfaces/IProject";
import IWallet from "../../interfaces/IWallet";
import { useCostCenterService } from "../../services/useCostCentersServices";
import { useProjectService } from "../../services/useProjectServices";
import { useWalletService } from "../../services/useWalletService";
import { ConfirmationArea } from "../../components/confirmationArea/ConfirmationArea";
import IPurchaseRequest from "../../interfaces/IPurchaseRequest";
import { usePurchaseRequestService } from "../../services/usePurchaseRequestService";
import useFormatIntegerDecimalValues from "../../util/useFormatIntegerDecimalValues";
import { useAccountingAccountsService } from "../../services/useAccountingAccountsServices";
import AppError from "../../errors/AppError";
import { useSessionStorage } from "../../services/useSessionStorage";

interface IPurchaseRequestItemProps {
  title: string;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export interface IOptions {
  value: string;
  description: string;
  stockQuantity?: number;
  averagePrice?: number;
  unitOfMeasure?: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator={"."}
        decimalScale={2}
        decimalSeparator=","
        valueIsNumericString
      />
    );
  }
);

const PurchaseRequestItem: React.FC<IPurchaseRequestItemProps> = ({
  title,
}) => {
  window.document.title = title;
  const location = useLocation();
  const timeout = useRef<any>(0);
  const navigate = useNavigate();
  const toastr = useToastr();
  const { signOut, state, currentHeadOffice } = useAuth();
  const { formatIntegerDecimalValues } = useFormatIntegerDecimalValues();
  const sessionStorage = useSessionStorage();

  const [purchaseRequestId] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    const purchaseRequestId = searchParams.get("purchaseRequestId");
    return purchaseRequestId || "";
  });

  const [purchaseRequest, setPurchaseRequest] =
    useState<IPurchaseRequest | null>(null);

  const [purchaseRequestItemId, setPurchaseRequestItemId] = useState("");

  const [sequence, setSequence] = useState("");

  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [productOptions, setProductOptions] = useState<IOptions[]>([]);
  const [productOption, setProductOption] = useState<IOptions | null>(null);

  const [loadingCostCenters, setLoadingCostCenters] = useState<boolean>(false);
  const [costCenterOptions, setCostCenterOptions] = useState<IOption[]>([]);
  const [costCenterOption, setCostCenterOption] = useState<IOption | null>(
    () => {
      if (state.costCenter && currentHeadOffice?.code === "1") {
        return {
          value: `${state.costCenter.id}`,
          description: `${state.costCenter.code} ${state.costCenter.description}`,
        };
      }
      return null;
    }
  );

  const [loadingAccountingAccounts, setLoadingAccountingAccounts] =
    useState<boolean>(false);
  const [accountingAccountOptions, setAccountingAccountOptions] = useState<
    IOption[]
  >([]);
  const [accountingAccountOption, setAccountingAccountOption] =
    useState<IOption | null>(null);

  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const [estimateDate, setEstimateDate] = useState<Dayjs | null>(null);

  const [comments, setComments] = useState("");

  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  const [projectOptions, setProjectOptions] = useState<IOption[]>([]);
  const [projectOption, setProjectOption] = useState<IOption | null>(null);

  const [loadingWallets, setLoadingWallets] = useState<boolean>(false);
  const [walletOptions, setWalletOptions] = useState<IOption[]>([]);
  const [walletOption, setWalletOption] = useState<IOption | null>(() => {
    if (state.wallet) {
      return {
        value: `${state.wallet.id}`,
        description: `${state.wallet.code} ${state.wallet.description}`,
      };
    }
    return null;
  });

  const [projectRequired, setProjectRequired] = useState<boolean>(false);
  const [walletRequired, setWalletRequired] = useState<boolean>(false);
  const [accountingAccountRequired, setAccountingAccountRequired] =
    useState<boolean>(false);
  const [showsItemObservation, setShowsItemObservation] =
    useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});
  const [purchaseRequestDisabledEdit, setPurchaseRequestDisabledEdit] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [estimatedDateRequired, setEstimatedDateRequired] =
    useState<boolean>(false);

  const [paymentMethodRequired, setPaymentMethodRequired] =
    useState<boolean>(false);

  const productService = useProductService();
  const costCenterService = useCostCenterService();
  const accountingAccountService = useAccountingAccountsService();
  const projectService = useProjectService();
  const walletService = useWalletService();

  const {
    listPurchaseRequestItemById,
    createPurchaseRequestItem,
    updatePurchaseRequestItem,
    deletePurchaseRequestItem,
  } = usePurchaseRequestItemService();

  const { listPurchaseRequestById } = usePurchaseRequestService();

  const productToOption = (product: IProduct): IOptions => {
    return {
      value: `${product.id}`,
      description: `${product.code} ${product.description}`,
      stockQuantity: product.stockQuantity,
      averagePrice: product.averagePrice,
      unitOfMeasure: product.unitOfMeasure,
    };
  };

  const costCenterToOption = (costCenter: ICostCenter): IOption => {
    return {
      value: `${costCenter.id}`,
      description: `${costCenter.code} ${costCenter.description}`,
    };
  };

  const accountingAccountToOption = (
    accountingAccount: ICostCenter
  ): IOption => {
    return {
      value: `${accountingAccount.id}`,
      description: `${accountingAccount.code} ${accountingAccount.classification} ${accountingAccount.description}`,
    };
  };

  const projectToOption = (project: IProject): IOption => {
    return {
      value: `${project.id}`,
      description: `${project.code} ${project.description}`,
    };
  };

  const walletToOption = (wallet: IWallet): IOption => {
    return {
      value: `${wallet.id}`,
      description: `${wallet.code} ${wallet.description}`,
    };
  };

  const listProducts = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingProducts(true);
      const url = `perPage=100&currentPage=1&orderBy=code&orderDirection=asc&filter=${filter}`;

      await productService
        .listProductsDynamically(url)
        .then((result) => {
          if (result) {
            const options: IOption[] = result.data.map(productToOption);

            setProductOptions(options);
          } else {
            setProductOptions([]);
          }
        })
        .catch((error) => {
          setProductOptions([]);
          toastr.error(error.message);
        })
        .finally(() => {
          setLoadingProducts(false);
        });
    }, timeout.current);
  };

  const handleSetCostCenter = (option: IOption | null) => {
    if (option) {
      const selected = costCenterOptions.find((costCenterOption) => {
        return costCenterOption.value === option.value;
      });

      if (selected?.value) {
        setCostCenterOption(selected);
      } else {
        setCostCenterOption(null);
      }
    }
  };

  const handleSetAccountingAccount = (option: IOption | null) => {
    if (option) {
      const selected = accountingAccountOptions.find(
        (accountingAccountOption) => {
          return accountingAccountOption.value === option.value;
        }
      );

      if (selected?.value) {
        setAccountingAccountOption(selected);
      } else {
        setAccountingAccountOption(null);
      }
    }
  };

  const listCostCenters = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingCostCenters(true);
      const url = `perPage=100&currentPage=1&orderBy=description&orderDirection=asc&filter=${filter}`;

      await costCenterService
        .listCostCentersDynamically(url)
        .then((result) => {
          if (result) {
            const options: IOption[] = result.data.map(costCenterToOption);

            setCostCenterOptions(options);
          } else {
            setCostCenterOptions([]);
          }
        })
        .catch((error) => {
          setCostCenterOptions([]);
          toastr.error(error.message);
        })
        .finally(() => {
          setLoadingCostCenters(false);
        });
    }, timeout.current);
  };

  const listAccountingAccounts = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingAccountingAccounts(true);
      const url = `perPage=100&currentPage=1&orderBy=description&orderDirection=asc&filter=${filter}`;

      await accountingAccountService
        .listAccountingAccountsDynamically(url)
        .then((result) => {
          if (result) {
            const options: IOption[] = result.data.map(
              accountingAccountToOption
            );

            setAccountingAccountOptions(options);
          } else {
            setAccountingAccountOptions([]);
          }
        })
        .catch((error) => {
          setAccountingAccountOptions([]);
          toastr.error(error.message);
        })
        .finally(() => {
          setLoadingAccountingAccounts(false);
        });
    }, timeout.current);
  };

  const listProjects = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingProjects(true);
      const url = `perPage=100&currentPage=1&orderBy=description&orderDirection=asc&filter=${filter}`;

      await projectService
        .listProjectsDynamically(url)
        .then((result) => {
          if (result) {
            const options: IOption[] = result.data.map(projectToOption);

            setProjectOptions(options);
          } else {
            setProjectOptions([]);
          }
        })
        .catch((error) => {
          setProjectOptions([]);
          toastr.error(error.message);
        })
        .finally(() => {
          setLoadingProjects(false);
        });
    }, timeout.current);
  };

  const listWallets = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingWallets(true);
      const url = `perPage=100&currentPage=1&orderBy=description&orderDirection=asc&filter=${filter}`;

      await walletService
        .listWalletsDynamically(url)
        .then((result) => {
          if (result) {
            const options: IOption[] = result.data.map(walletToOption);

            setWalletOptions(options);
          } else {
            setWalletOptions([]);
          }
        })
        .catch((error) => {
          setWalletOptions([]);
          toastr.error(error.message);
        })
        .finally(() => {
          setLoadingWallets(false);
        });
    }, timeout.current);
  };

  const handleSetProduct = (option: IOption | null) => {
    if (option) {
      setProductOption(option);
      const selected = productOptions.find((productOption) => {
        return productOption.value === option.value;
      });
      if (selected?.value) {
        setProductOption(selected);
        setUnitPrice(String(selected.averagePrice));
      } else {
        setProductOption(null);
        setUnitPrice("");
      }
    }
  };

  const handleSetProject = (option: IOption | null) => {
    if (option) {
      setProjectOption(option);
      const selected = projectOptions.find((projectOption) => {
        return projectOption.value === option.value;
      });
      if (selected?.value) {
        setProjectOption(selected);
      } else {
        setProjectOption(null);
      }
    }
  };

  const handleSetWallet = (option: IOption | null) => {
    if (option) {
      setWalletOption(option);
      const selected = walletOptions.find((walletOption) => {
        return walletOption.value === option.value;
      });
      if (selected?.value) {
        setWalletOption(selected);
      } else {
        setWalletOption(null);
      }
    }
  };

  const handleSuggestedData = () => {
    const suggestedData = sessionStorage.getItem(
      "@PORTAL-COMPRAS:suggestedData"
    );
    if (suggestedData) {
      if (suggestedData.costCenter) {
        const costCenterOption = costCenterToOption(suggestedData.costCenter);

        costCenterOption &&
          currentHeadOffice?.code === "1" &&
          setCostCenterOption(costCenterOption);
      }

      if (suggestedData.accountingAccount) {
        const accountingAccountOption = accountingAccountToOption(
          suggestedData.accountingAccount
        );

        accountingAccountOption &&
          setAccountingAccountOption(accountingAccountOption);
      }

      suggestedData.estimatedDate
        ? setEstimateDate(dayjs(suggestedData.estimatedDate))
        : setEstimateDate(null);

      if (suggestedData.project) {
        const projectOption = projectToOption(suggestedData.project);

        projectOption && setProjectOption(projectOption);
      }

      if (suggestedData.wallet) {
        const walletOption = walletToOption(suggestedData.wallet);

        walletOption && setWalletOption(walletOption);
      }
    }
  };

  const handleListPurchaseRequestItem = useCallback(async () => {
    const id = location.pathname
      .replace("/purchase-request-item", "")
      .replace("/", "");

    setPurchaseRequestItemId(id);

    handleSuggestedData();

    if (id) {
      setLoading(true);

      await listPurchaseRequestItemById(id)
        .then((response) => {
          const purchaseRequestItem: IPurchaseRequestItem = response;

          purchaseRequestItem.sequence &&
            setSequence(String(purchaseRequestItem.sequence));

          if (purchaseRequestItem.product) {
            const productOption = productToOption(purchaseRequestItem.product);

            productOption && setProductOption(productOption);
          }

          if (purchaseRequestItem.costCenter) {
            const costCenterOption = costCenterToOption(
              purchaseRequestItem.costCenter
            );

            costCenterOption && setCostCenterOption(costCenterOption);
          }

          if (purchaseRequestItem.accountingAccount) {
            const accountingAccountOption = accountingAccountToOption(
              purchaseRequestItem.accountingAccount
            );

            accountingAccountOption &&
              setAccountingAccountOption(accountingAccountOption);
          }

          setQuantity(
            purchaseRequestItem.quantity > 0
              ? String(purchaseRequestItem.quantity)
              : ""
          );

          setUnitPrice(
            purchaseRequestItem.unitPrice && purchaseRequestItem.unitPrice > 0
              ? String(purchaseRequestItem.unitPrice)
              : ""
          );

          purchaseRequestItem.estimatedDate
            ? setEstimateDate(dayjs(purchaseRequestItem.estimatedDate))
            : setEstimateDate(null);

          purchaseRequestItem.comments &&
            setComments(purchaseRequestItem.comments);

          if (purchaseRequestItem.project) {
            const projectOption = projectToOption(purchaseRequestItem.project);

            projectOption && setProjectOption(projectOption);
          }

          if (purchaseRequestItem.wallet) {
            const walletOption = walletToOption(purchaseRequestItem.wallet);

            walletOption && setWalletOption(walletOption);
          }

          if (!purchaseRequestItem.purchaseRequest?.isDraft) {
            setPurchaseRequestDisabledEdit(true);
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

  const handleListPurchaseRequest = useCallback(async () => {
    setLoading(true);

    await listPurchaseRequestById(purchaseRequestId)
      .then((response) => {
        const purchaseRequest: IPurchaseRequest = response;

        setPurchaseRequest(purchaseRequest);
        setProjectRequired(
          Boolean(response.purchaseRequestType?.purchaseRequestProjectRequired)
        );
        setWalletRequired(
          Boolean(response.purchaseRequestType?.purchaseRequestWalletRequired)
        );
        setAccountingAccountRequired(
          Boolean(response.purchaseRequestType?.accountingAccountRequired)
        );
        setEstimatedDateRequired(
          Boolean(response.purchaseRequestType?.estimatedDateRequired)
        );
        setPaymentMethodRequired(
          Boolean(response.purchaseRequestType?.paymentMethodRequired)
        );
        setShowsItemObservation(
          Boolean(response.purchaseRequestType?.showsItemObservation)
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
  }, [purchaseRequestId, navigate, signOut]);

  const handleDeleteRequestItem = useCallback(async () => {
    setLoading(true);
    await deletePurchaseRequestItem(purchaseRequestItemId)
      .then(() => {
        toastr.success("Item deletado com sucesso");

        navigate(`/purchase-request/${purchaseRequestId}`);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [purchaseRequestItemId, purchaseRequestId]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      if (estimatedDateRequired && estimateDate === null) {
        throw new AppError("Data de previsição de entrega é obrigatória");
      }

      if (
        estimatedDateRequired &&
        estimateDate &&
        estimateDate.toDate() <= new Date()
      ) {
        throw new AppError(
          "Data de previsição de entrega deve ser maior que a data atual"
        );
      }

      const data = {
        purchaseRequestId,
        productId: productOption?.value ? productOption?.value : "",
        costCenterId: costCenterOption?.value ? costCenterOption?.value : "",
        accountingAccountId: accountingAccountOption?.value
          ? accountingAccountOption?.value
          : null,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        estimatedDate: estimateDate ? estimateDate.toDate() : null,
        comments,
        projectId: projectOption?.value ? projectOption?.value : null,
        walletId: walletOption?.value ? walletOption?.value : null,
        projectRequired,
        walletRequired,
        accountingAccountRequired,
        paymentMethodRequired,
      };

      const schema = Yup.object().shape({
        purchaseRequestId: Yup.string()
          .uuid()
          .required("Id da requisição obrigatória"),
        productId: Yup.string().uuid().required("Produto/Serviço obrigatório"),
        costCenterId: Yup.string()
          .uuid()
          .required("Centro de custo obrigatório"),
        quantity: Yup.string()
          .required("Campo obrigatório")
          .test(
            "len",
            "Deve ser informado uma quantidade maior que 0,00",
            (val) => !!val && !!(Number(val) > 0.01)
          ),
        comments: Yup.string(),
        projectId: Yup.string()
          .nullable()
          .test(
            "requiredIfProjectRequired",
            "Projeto obrigatório",
            function (value) {
              const { projectRequired } = this.parent;
              if (projectRequired) {
                return value !== null && value !== undefined && value !== "";
              }
              return true;
            }
          ),
        walletId: Yup.string()
          .nullable()
          .test(
            "requiredIfWalletRequired",
            "Wallet obrigatório",
            function (value) {
              const { walletRequired } = this.parent;
              if (walletRequired) {
                return value !== null && value !== undefined && value !== "";
              }
              return true;
            }
          ),
        accountingAccountId: Yup.string()
          .nullable()
          .test(
            "requiredIfAccountingAccountRequired",
            "Conta contábil obrigatória",
            function (value) {
              const { accountingAccountRequired } = this.parent;
              if (accountingAccountRequired) {
                return value !== null && value !== undefined && value !== "";
              }
              return true;
            }
          ),
      });

      if (purchaseRequestItemId) {
        await schema.validate(data, {
          abortEarly: false,
          context: {
            projectRequired,
            walletRequired,
          },
        });

        await updatePurchaseRequestItem(purchaseRequestItemId, data)
          .then(async () => {
            navigate(`/purchase-request/${purchaseRequestId}`);
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

        await createPurchaseRequestItem(data)
          .then(async () => {
            toastr.success("Item adicionado com sucesso");

            navigate(`/purchase-request/${purchaseRequestId}`);
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
    productOption,
    costCenterOption,
    accountingAccountOption,
    quantity,
    unitPrice,
    estimateDate,
    comments,
    projectOption,
    walletOption,
    purchaseRequestId,
    toastr,
    projectRequired,
    walletRequired,
    accountingAccountRequired,
    estimatedDateRequired,
    paymentMethodRequired,
    navigate,
    signOut,
  ]);

  useEffect(() => {
    handleListPurchaseRequestItem();
  }, []);

  useEffect(() => {
    if (purchaseRequestId) {
      handleListPurchaseRequest();
    }
  }, [purchaseRequestId]);

  return (
    <>
      <TitleContainer>
        <h1>Item solicitação de compra</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Seq."
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                autoFocus
                required
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.productId}
                autoFocus
                sx={{ width: "100%" }}
              >
                <AsyncSearch
                  options={productOptions}
                  setOptions={setProductOptions}
                  option={productOption}
                  setOption={handleSetProduct}
                  asyncSearch={listProducts}
                  loading={loadingProducts}
                  error={Boolean(formErrors?.productId)}
                  errorMessage={formErrors?.productId || null}
                  label="Produto/Serviço"
                  required={true}
                  disabled={purchaseRequestDisabledEdit}
                  autofocus={true}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.costCenterId}
                sx={{ width: "100%" }}
              >
                <AsyncSearch
                  options={costCenterOptions}
                  setOptions={setCostCenterOptions}
                  option={costCenterOption}
                  setOption={handleSetCostCenter}
                  asyncSearch={listCostCenters}
                  loading={loadingCostCenters}
                  error={Boolean(formErrors?.costCenterId)}
                  errorMessage={formErrors?.costCenterId || null}
                  label="Centro de custo"
                  required={true}
                  disabled={purchaseRequestDisabledEdit}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.accountingAccountId}
                sx={{ width: "100%" }}
                required={accountingAccountRequired}
              >
                <AsyncSearch
                  options={accountingAccountOptions}
                  setOptions={setAccountingAccountOptions}
                  option={accountingAccountOption}
                  setOption={handleSetAccountingAccount}
                  asyncSearch={listAccountingAccounts}
                  loading={loadingAccountingAccounts}
                  error={Boolean(formErrors?.accountingAccountId)}
                  errorMessage={formErrors?.accountingAccountId || null}
                  label="Conta contábil"
                  required={accountingAccountRequired}
                  disabled={purchaseRequestDisabledEdit}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.quantity}
                required
                sx={{ width: "100%" }}
              >
                <TextField
                  label="Quantidade"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  name="value"
                  size="small"
                  id="quantity-input"
                  InputProps={{
                    inputComponent: NumericFormatCustom as any,
                  }}
                  variant="outlined"
                  error={!!formErrors.quantity}
                  required
                  disabled={purchaseRequestDisabledEdit}
                />
                <FormHelperText>{formErrors.quantity}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.unitPrice}
                sx={{ width: "100%" }}
              >
                <TextField
                  label="Preço Unitário"
                  value={unitPrice}
                  onChange={(event) => setUnitPrice(event.target.value)}
                  name="value"
                  size="small"
                  id="unitPrice-input"
                  InputProps={{
                    inputComponent: NumericFormatCustom as any,
                  }}
                  variant="outlined"
                  error={!!formErrors.unitPrice}
                  disabled={
                    purchaseRequestDisabledEdit ||
                    !purchaseRequest?.purchaseRequestType?.allowsChangeUnitPrice
                  }
                />
                <FormHelperText>{formErrors.unitPrice}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.projectId}
                sx={{ width: "100%" }}
                required={projectRequired}
              >
                <AsyncSearch
                  options={projectOptions}
                  setOptions={setProjectOptions}
                  option={projectOption}
                  setOption={handleSetProject}
                  asyncSearch={listProjects}
                  loading={loadingProjects}
                  error={Boolean(formErrors?.projectId)}
                  errorMessage={formErrors?.projectId || null}
                  label="Projeto"
                  disabled={purchaseRequestDisabledEdit}
                  required={projectRequired}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.walletId}
                sx={{ width: "100%" }}
                required={walletRequired}
              >
                <AsyncSearch
                  options={walletOptions}
                  setOptions={setWalletOptions}
                  option={walletOption}
                  setOption={handleSetWallet}
                  asyncSearch={listWallets}
                  loading={loadingWallets}
                  error={Boolean(formErrors?.walletId)}
                  errorMessage={formErrors?.walletId || null}
                  label="Ordem Estatística / Wallet"
                  disabled={purchaseRequestDisabledEdit}
                  required={walletRequired}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  sx={{ width: "100%" }}
                  slotProps={{ textField: { size: "small" } }}
                  label={`Data previsão de entrega ${
                    estimatedDateRequired ? "*" : ""
                  }`}
                  value={estimateDate}
                  onChange={(value) => setEstimateDate(dayjs(String(value)))}
                  disabled={purchaseRequestDisabledEdit}
                />
              </LocalizationProvider>
            </Grid>

            {showsItemObservation && (
              <Grid item xs={12} md={6} sm={6}>
                <TextField
                  sx={{ width: "100%" }}
                  size="small"
                  label="Observação"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  disabled={purchaseRequestDisabledEdit}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Valor Total Bruto"
                value={formatIntegerDecimalValues(
                  Number(quantity) * Number(unitPrice),
                  "DECIMAL"
                )}
                disabled
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            <InfoProduct>
              <Span>
                Preço Médio:{" "}
                {productOption?.averagePrice
                  ? `R$ ${formatIntegerDecimalValues(
                      productOption?.averagePrice,
                      "DECIMAL"
                    )}`
                  : "Não encontrado"}
                ; Estoque:{" "}
                {productOption?.stockQuantity
                  ? `${productOption?.stockQuantity} - ${productOption.unitOfMeasure}`
                  : "Não encontrado"}
              </Span>
            </InfoProduct>

            {purchaseRequestItemId && !purchaseRequestDisabledEdit && (
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

            <ButtonTheme
              onClick={() => navigate(-1)}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>

            {!purchaseRequestDisabledEdit && (
              <ButtonTheme
                onClick={() => handleSubmit()}
                variant="contained"
                disabled={loading}
              >
                Salvar
              </ButtonTheme>
            )}
          </ButtonGroup>
        </Form>

        {loading && <BackdropCustom />}

        {purchaseRequestItemId && (
          <ConfirmationArea
            id={purchaseRequestItemId}
            dialogOpen={deleteDialogOpen}
            handleConfirmation={handleDeleteRequestItem}
            title="Deseja realmente excluir o item?"
            message=""
            deny={() => {
              setDeleteDialogOpen(false);
            }}
          />
        )}
      </PageCard>
    </>
  );
};

export default PurchaseRequestItem;
