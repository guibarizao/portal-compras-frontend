import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { NumericFormat, NumericFormatProps } from "react-number-format";

import AsyncSearch, { IOption } from "../../components/asyncSearch/AsyncSearch";
import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import IStockRequestItem from "../../interfaces/IStockRequestItem";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { InfoProduct, Span } from "./StockRequestItem.styles";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { useStockRequestItemService } from "../../services/useStockRequestItemService";
import IProduct from "../../interfaces/IProduct";
import { useProductService } from "../../services/useProductService";
import IFormError from "../../interfaces/IFormError";
import getValidationError from "../../util/getValidationError";
import ICostCenter from "../../interfaces/ICostCenter";
import { FormControl, FormHelperText, Grid, TextField } from "@mui/material";
import IProject from "../../interfaces/IProject";
import IWallet from "../../interfaces/IWallet";
import { useCostCenterService } from "../../services/useCostCentersServices";
import { useProjectService } from "../../services/useProjectServices";
import { useWalletService } from "../../services/useWalletService";
import { ConfirmationArea } from "../../components/confirmationArea/ConfirmationArea";
import useFormatIntegerDecimalValues from "../../util/useFormatIntegerDecimalValues";
import { useStockRequestService } from "../../services/useStockRequestService";
import { useSessionStorage } from "../../services/useSessionStorage";

interface IStockRequestItemProps {
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

const StockRequestItem: React.FC<IStockRequestItemProps> = ({ title }) => {
  window.document.title = title;
  const location = useLocation();
  const timeout = useRef<any>(0);
  const navigate = useNavigate();
  const toastr = useToastr();
  const { signOut, state, currentHeadOffice } = useAuth();
  const { formatIntegerDecimalValues } = useFormatIntegerDecimalValues();
  const sessionStorage = useSessionStorage();

  const [stockRequestId] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    const stockRequestId = searchParams.get("stockRequestId");
    return stockRequestId || "";
  });

  const [stockRequestItemId, setStockRequestItemId] = useState("");

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

  const [quantity, setQuantity] = useState("");

  const [comments, setComments] = useState("");

  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  const [projectOptions, setProjectOptions] = useState<IOption[]>([]);
  const [projectOption, setProjectOption] = useState<IOption | null>(null);

  const [loadingWallets, setLoadingWallets] = useState<boolean>(false);
  const [walletOptions, setWalletOptions] = useState<IOption[]>([]);
  const [walletOption, setWalletOption] = useState<IOption | null>(null);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});
  const [stockRequestDisabledEdit, setStockRequestDisabledEdit] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const productService = useProductService();
  const costCenterService = useCostCenterService();
  const projectService = useProjectService();
  const walletService = useWalletService();

  const [stockRequestProjectRequired, setStockRequestProjectRequired] =
    useState<boolean>(false);
  const [stockRequestWalletRequired, setStockRequestWalletRequired] =
    useState<boolean>(false);

  const {
    listStockRequestItemById,
    createStockRequestItem,
    updateStockRequestItem,
    deleteStockRequestItem,
  } = useStockRequestItemService();

  const { listStockRequestById } = useStockRequestService();

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
      } else {
        setProductOption(null);
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

  const handleListStockRequestItem = useCallback(async () => {
    const id = location.pathname
      .replace("/stock-request-item", "")
      .replace("/", "");

    setStockRequestItemId(id);

    handleSuggestedData();

    if (id) {
      setLoading(true);

      await listStockRequestItemById(id)
        .then((response) => {
          const stockRequestItem: IStockRequestItem = response;

          stockRequestItem.sequence &&
            setSequence(String(stockRequestItem.sequence));

          if (stockRequestItem.product) {
            const productOption = productToOption(stockRequestItem.product);

            productOption && setProductOption(productOption);
          }

          if (stockRequestItem.costCenter) {
            const costCenterOption = costCenterToOption(
              stockRequestItem.costCenter
            );

            costCenterOption && setCostCenterOption(costCenterOption);
          }

          setQuantity(
            stockRequestItem.quantity > 0
              ? String(stockRequestItem.quantity)
              : ""
          );

          stockRequestItem.comments && setComments(stockRequestItem.comments);

          if (stockRequestItem.project) {
            const projectOption = projectToOption(stockRequestItem.project);

            projectOption && setProjectOption(projectOption);
          }

          if (stockRequestItem.wallet) {
            const walletOption = walletToOption(stockRequestItem.wallet);

            walletOption && setWalletOption(walletOption);
          }

          if (!stockRequestItem.stockRequest?.isDraft) {
            setStockRequestDisabledEdit(true);
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

    await listStockRequestById(stockRequestId)
      .then((response) => {
        setStockRequestProjectRequired(
          Boolean(response.stockRequestType?.stockRequestProjectRequired)
        );
        setStockRequestWalletRequired(
          Boolean(response.stockRequestType?.stockRequestWalletRequired)
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
  }, [navigate, signOut, toastr, location.pathname]);

  const handleDeleteRequestItem = useCallback(async () => {
    setLoading(true);
    await deleteStockRequestItem(stockRequestItemId)
      .then(() => {
        toastr.success("Item deletado com sucesso");

        navigate(`/stock-request/${stockRequestId}`);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stockRequestItemId, stockRequestId]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data = {
        stockRequestId,
        productId: productOption?.value ? productOption?.value : "",
        costCenterId: costCenterOption?.value ? costCenterOption?.value : "",
        quantity: Number(quantity),
        comments,
        projectId: projectOption?.value ? projectOption?.value : null,
        walletId: walletOption?.value ? walletOption?.value : null,
        stockRequestProjectRequired,
        stockRequestWalletRequired,
      };

      const schema = Yup.object().shape({
        stockRequestId: Yup.string()
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
            "requiredIfStockRequestProjectRequired",
            "Projeto obrigatório",
            function (value) {
              const { stockRequestProjectRequired } = this.parent;
              if (stockRequestProjectRequired) {
                return value !== null && value !== undefined && value !== "";
              }
              return true;
            }
          ),
        walletId: Yup.string()
          .nullable()
          .test(
            "requiredIfStockRequestWalletRequired",
            "Wallet obrigatório",
            function (value) {
              const { stockRequestProjectRequired } = this.parent;
              if (stockRequestProjectRequired) {
                return value !== null && value !== undefined && value !== "";
              }
              return true;
            }
          ),
      });

      if (stockRequestItemId) {
        await schema.validate(data, {
          abortEarly: false,
          context: { stockRequestProjectRequired, stockRequestWalletRequired },
        });

        await updateStockRequestItem(stockRequestItemId, data)
          .then(async () => {
            navigate(`/stock-request/${stockRequestId}`);
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

        await createStockRequestItem(data)
          .then(async () => {
            toastr.success("Item adicionado com sucesso");

            navigate(`/stock-request/${stockRequestId}`);
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
    quantity,
    comments,
    projectOption,
    walletOption,
    stockRequestId,
    toastr,
    stockRequestProjectRequired,
    stockRequestWalletRequired,
    navigate,
    signOut,
  ]);

  useEffect(() => {
    handleListStockRequestItem();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Item requisição de estoque</h1>
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
                  label="Produto"
                  required={true}
                  disabled={stockRequestDisabledEdit}
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
                  disabled={stockRequestDisabledEdit}
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
                  sx={{ width: "100%" }}
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
                  disabled={stockRequestDisabledEdit}
                />
                <FormHelperText>{formErrors.quantity}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.projectId}
                sx={{ width: "100%" }}
                required={stockRequestProjectRequired}
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
                  disabled={stockRequestDisabledEdit}
                  required={stockRequestProjectRequired}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              {" "}
              <FormControl
                size="small"
                error={!!formErrors.walletId}
                sx={{ width: "100%" }}
                required={stockRequestWalletRequired}
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
                  disabled={stockRequestDisabledEdit}
                  required={stockRequestWalletRequired}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Observação"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={stockRequestDisabledEdit}
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

            {stockRequestItemId && !stockRequestDisabledEdit && (
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
              onClick={() => navigate(`/stock-request/${stockRequestId}`)}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>

            {!stockRequestDisabledEdit && (
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

        {stockRequestItemId && (
          <ConfirmationArea
            id={stockRequestItemId}
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

export default StockRequestItem;
