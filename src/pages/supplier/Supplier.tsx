import { useCallback, useEffect, useRef, useState } from "react";
import { FormControl, Grid, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import { ConfirmationArea } from "../../components/confirmationArea/ConfirmationArea";
import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useSupplierService } from "../../services/useSupplierService";
import { useToastr } from "../../hooks/useToastr";
import ISupplier from "../../interfaces/ISupplier";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import ISupplierType from "../../interfaces/ISupplierType";
import IPaymentCondition from "../../interfaces/IPaymentCondition";
import ISupplierErpStatus from "../../interfaces/ISupplierErpStatus";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { useCepService } from "../../services/useCepService";
import SuppliersBankDetailsList from "./suppliersBankDetailsList/SuppliersBankDetailsList";
import AsyncSearch from "../../components/asyncSearch/AsyncSearch";
import { usePaymentConditionService } from "../../services/usePaymentConditionServices";
import { useSupplierTypeService } from "../../services/useSupplierTypeService";
import SupplierAttachments from "./supplierAttachments/SupplierAttachments";
import { validateCpfCnpj } from "../../util/validateCpfCnpj";
import IPaymentForm from "../../interfaces/IPaymentForm";
import { usePaymentFormService } from "../../services/usePaymentFormServices";

interface ISupplierProps {
  title: string;
}

interface IOption {
  description: string;
  value: string;
}

const Supplier: React.FC<ISupplierProps> = ({ title }) => {
  window.document.title = title;

  const {
    listSupplierById,
    updateSupplier,
    createSupplier,
    deleteSupplier,
    closeSupplier,
  } = useSupplierService();
  const timeout = useRef<any>(0);
  const { listCep } = useCepService();
  const [supplierId, setSupplierId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const { listPaymentConditionsDynamically } = usePaymentConditionService();
  const { listPaymentFormsDynamically } = usePaymentFormService();
  const { listAllSupplierTypes } = useSupplierTypeService();
  const [code, setCode] = useState("");
  const [corporateName, setCorporateName] = useState("");
  const [tradingName, setTradingName] = useState("");
  const [corporateDocument, setCorporateDocument] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [contactName, setContactName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [integrationDate, setIntegrationDate] = useState<Date | null>(null);
  const [supplierErpStatus, setSupplierErpStatus] =
    useState<ISupplierErpStatus | null>(null);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const [loadingPaymentConditions, setLoadingPaymentConditions] =
    useState<boolean>(false);
  const [paymentConditionOptions, setPaymentConditionOptions] = useState<
    IOption[]
  >([]);
  const [paymentConditionOption, setPaymentConditionOption] =
    useState<IOption | null>(() => {
      const initialState = location.state as
        | { paymentCondition?: IPaymentCondition }
        | undefined;
      if (initialState?.paymentCondition) {
        return {
          value: `${initialState.paymentCondition.id}`,
          description: `${initialState.paymentCondition.code} ${initialState.paymentCondition.name}`,
        };
      }
      return null;
    });

  const [loadingPaymentForms, setLoadingPaymentForms] =
    useState<boolean>(false);
  const [paymentFormOptions, setPaymentFormOptions] = useState<IOption[]>([]);
  const [paymentFormOption, setPaymentFormOption] = useState<IOption | null>(
    () => {
      const initialState = location.state as
        | { paymentForm?: IPaymentForm }
        | undefined;

      if (initialState?.paymentForm) {
        return {
          value: `${initialState.paymentForm.id}`,
          description: `${initialState.paymentForm.code} ${initialState.paymentForm.name}`,
        };
      }
      return null;
    }
  );

  const [loadingSupplierTypes, setLoadingSupplierTypes] =
    useState<boolean>(false);
  const [supplierTypeOptions, setSupplierTypeOptions] = useState<IOption[]>([]);
  const [supplierTypeOption, setSupplierTypeOption] = useState<IOption | null>(
    () => {
      return {
        value: `J`,
        description: "Pessoa Jurídica",
      };
    }
  );

  const paymentConditionToOption = (
    paymentCondition: IPaymentCondition
  ): IOption => {
    return {
      value: `${paymentCondition.id}`,
      description: `${paymentCondition.code} ${paymentCondition.name}`,
    };
  };

  const listPaymentConditions = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingPaymentConditions(true);
      const url = `perPage=100&currentPage=1&orderBy=name&orderDirection=asc&filter=${filter}`;

      await listPaymentConditionsDynamically(url)
        .then((result) => {
          if (result) {
            const options: IOption[] = result.data.map(
              paymentConditionToOption
            );

            setPaymentConditionOptions(options);
          } else {
            setPaymentConditionOptions([]);
          }
        })
        .catch((error) => {
          setPaymentConditionOptions([]);
          toastr.error(error.message);
        })
        .finally(() => {
          setLoadingPaymentConditions(false);
        });
    }, timeout.current);
  };

  const paymentFormToOption = (paymentForm: IPaymentForm): IOption => {
    return {
      value: `${paymentForm.id}`,
      description: `${paymentForm.code} ${paymentForm.name}`,
    };
  };

  const listPaymentForms = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingPaymentForms(true);
      const url = `perPage=100&currentPage=1&orderBy=name&orderDirection=asc&filter=${filter}`;

      await listPaymentFormsDynamically(url)
        .then((result) => {
          if (result) {
            const options: IOption[] = result.data.map(paymentFormToOption);

            setPaymentFormOptions(options);
          } else {
            setPaymentFormOptions([]);
          }
        })
        .catch((error) => {
          setPaymentFormOptions([]);
          toastr.error(error.message);
        })
        .finally(() => {
          setLoadingPaymentForms(false);
        });
    }, timeout.current);
  };

  const supplierTypeToOption = (supplierType: ISupplierType): IOption => {
    return {
      value: `${supplierType.id}`,
      description: `${supplierType.description}`,
    };
  };

  const handleListSupplierTypes = useCallback(async (filter: string) => {
    setLoadingSupplierTypes(true);
    const url = `perPage=10&currentPage=1&orderBy=description&orderDirection=asc&filter=${filter}`;

    try {
      const result = await listAllSupplierTypes(url);
      if (result && result.data) {
        const options: IOption[] = result.data.map(supplierTypeToOption);
        setSupplierTypeOptions(options);
      } else if (result && result.data.length === 0) {
        setSupplierTypeOptions([]);
        setSupplierTypeOption(null);
      }
    } catch (error: unknown) {
      setSupplierTypeOptions([]);
      toastr.error(
        (error as Error).message || "Erro ao listar tipos de fornecedor"
      );
    } finally {
      setLoadingSupplierTypes(false);
    }
  }, []);

  const listSupplierTypes = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      handleListSupplierTypes(filter);
    }, timeout.current);
  };

  const handleListSupplier = useCallback(
    async (supplierId: string | null) => {
      let id = location.pathname.replace("/supplier", "").replace("/", "");

      if (!id && !!supplierId) {
        id = supplierId;
      }
      setSupplierId(id);

      if (id) {
        setLoading(true);

        await listSupplierById(id)
          .then((response) => {
            const supplier: ISupplier = response;

            setCode(supplier.code ? supplier.code : "");
            setCorporateName(supplier.corporateName);
            setTradingName(supplier.tradingName);
            setCorporateDocument(supplier.corporateDocument);
            setIsActive(supplier.isActive);
            setPhone1(supplier.phone1);
            setPhone2(supplier.phone2);
            setEmail1(supplier.email1);
            setEmail2(supplier.email2);
            setAddress(supplier.address);
            setAddressNumber(supplier.addressNumber);
            setNeighborhood(supplier.neighborhood);
            setComplement(supplier.complement);
            setCity(supplier.city);
            setState(supplier.state);
            setZipCode(supplier.zipCode);
            setContactName(supplier.contactName || "");

            setIsDraft(supplier.isDraft);

            if (supplier.supplierType && supplierTypeOptions.length > 0) {
              const selected = supplierTypeOptions.find(
                (opt) => opt.value === supplier.supplierTypeId
              );
              if (selected) setSupplierTypeOption(selected);
            }

            if (supplier.supplierType) {
              const supplierOption = supplierTypeToOption(
                supplier.supplierType
              );

              supplierOption && setSupplierTypeOption(supplierOption);
            }

            if (supplier.paymentCondition) {
              const supplierOption = paymentConditionToOption(
                supplier.paymentCondition
              );

              supplierOption && setPaymentConditionOption(supplierOption);
            }

            if (supplier.paymentForm) {
              const supplierOption = paymentFormToOption(supplier.paymentForm);

              supplierOption && setPaymentFormOption(supplierOption);
            }

            setAdditionalInfo(supplier.additionalInfo || "");
            setIntegrationDate(
              supplier.integrationDate
                ? new Date(supplier.integrationDate)
                : null
            );
            setSupplierErpStatus(supplier.supplierErpStatus || null);
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
    [navigate, signOut, toastr, supplierTypeOptions, location.pathname]
  );

  const handleSubmit = useCallback(
    async (goTo = false) => {
      setLoading(true);
      setFormErrors({});

      try {
        const result = validateCpfCnpj(corporateDocument);

        if (!result.isValid) {
          setFormErrors({
            ...formErrors,
            corporateDocument: "Por favor informe um documento válido",
          });
          return;
        }

        const data: ISupplier = {
          supplierTypeId: supplierTypeOption?.value || "",
          corporateName,
          corporateDocument,
          paymentConditionId: paymentConditionOption?.value || "",
          paymentFormId: paymentFormOption?.value || "",
          tradingName,
          isActive,
          contactName,
          phone1,
          phone2,
          email1,
          email2,
          address,
          addressNumber,
          neighborhood,
          complement,
          city,
          state,
          zipCode,
          additionalInfo,
          isDraft,
          integrationDate: integrationDate || undefined,
          supplierErpStatus: supplierErpStatus,
        };

        const schema = Yup.object().shape({
          supplierTypeId: Yup.string().required(
            "Tipo é obrigatório obrigatória"
          ),
          corporateName: Yup.string().required("Razão social obrigatória"),
          corporateDocument: Yup.string().required("Documento obrigatório"),
          paymentConditionId: Yup.string().required(
            "Condição de Pagamento é obrigatória"
          ),
          email1: Yup.string().email("Email inválido"),
          email2: Yup.string().email("Email inválido"),
        });

        await schema.validate(data, { abortEarly: false });

        if (supplierId) {
          await updateSupplier(supplierId, data)
            .then(async (response) => {
              const supplier: ISupplier = response;

              if (goTo) {
                navigate(`/supplier/${supplier.id}`);
                toastr.success("Fornecedor atualizado com sucesso");
                window.location.reload();
              }
            })
            .catch((error) => {
              if (error.status === 401) {
                signOut();
                navigate("/");
              }

              toastr.error(error?.message || "Contate a equipe de suporte");
            });
        } else {
          await createSupplier(data)
            .then(async (response) => {
              const supplier: ISupplier = response;

              if (goTo) {
                supplier.id && handleListSupplier(supplier.id);

                navigate(`/supplier/${supplier.id}`);
                toastr.success("Fornecedor criado com sucesso");
              }
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
    },
    [
      supplierId,
      supplierTypeOption,
      corporateName,
      tradingName,
      corporateDocument,
      isActive,
      contactName,
      paymentConditionOption,
      paymentFormOption,
      phone1,
      phone2,
      email1,
      email2,
      address,
      addressNumber,
      neighborhood,
      complement,
      city,
      state,
      zipCode,
      additionalInfo,
      isDraft,
      integrationDate,
      supplierErpStatus,
      navigate,
      signOut,
      updateSupplier,
      createSupplier,
      deleteSupplier,
      closeSupplier,
      toastr,
    ]
  );

  const handleDeleteSupplier = useCallback(async () => {
    setLoading(true);
    await deleteSupplier(supplierId)
      .then(async () => {
        toastr.success("Fornecedor deletado com sucesso");

        navigate("/suppliers");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [supplierId, toastr, navigate]);

  const handleCloseSupplier = useCallback(async () => {
    setLoading(true);

    try {
      await closeSupplier(supplierId).then(async () => {
        toastr.success("Cadastro de Fornecedor finalizado com sucesso");
        handleListSupplier(null);
      });
    } catch (error: Yup.ValidationError | any) {
      toastr.error(error?.message || "Contate a equipe de suporte");
    } finally {
      setLoading(false);
    }
  }, [supplierId, toastr, navigate, handleListSupplier]);

  const handleSetSupplierType = (option: IOption | null) => {
    if (option) {
      const selected = supplierTypeOptions.find((supplierTypeOption) => {
        return supplierTypeOption.value === option.value;
      });

      if (selected?.value) {
        setSupplierTypeOption(selected);
      } else {
        setSupplierTypeOption(null);
      }
    }
  };

  const handleSetPaymentCondition = (option: IOption | null) => {
    if (option) {
      const selected = paymentConditionOptions.find(
        (paymentConditionOption) =>
          paymentConditionOption.value === option.value
      );

      if (selected) {
        setPaymentConditionOption(selected);
      } else {
        setPaymentConditionOption(option);
      }
    } else {
      setPaymentConditionOption(null);
    }
  };

  const handleSetPaymentForm = (option: IOption | null) => {
    if (option) {
      const selected = paymentFormOptions.find(
        (paymentFormOption) => paymentFormOption.value === option.value
      );

      if (selected) {
        setPaymentFormOption(selected);
      } else {
        setPaymentFormOption(option);
      }
    } else {
      setPaymentFormOption(null);
    }
  };

  const handleResquestCep = useCallback(async () => {
    if (zipCode.length === 9) {
      setLoading(true);

      await listCep(zipCode)
        .then((response) => {
          setState(response.uf);
          setCity(response.localidade);
          setAddress(response.logradouro);
          setNeighborhood(response.bairro);
        })
        .catch((error) => {
          toastr.error(error?.message || "Contate a equipe de suporte");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [zipCode]);

  useEffect(() => {
    handleListSupplierTypes("");
    listPaymentConditions();
    handleListSupplier(null);
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Fornecedor</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.supplierType}
                sx={{ width: "100%" }}
              >
                <AsyncSearch
                  options={supplierTypeOptions}
                  setOptions={setSupplierTypeOptions}
                  option={supplierTypeOption}
                  setOption={handleSetSupplierType}
                  asyncSearch={listSupplierTypes}
                  loading={loadingSupplierTypes}
                  error={Boolean(formErrors?.supplierTypeId)}
                  errorMessage={formErrors?.supplierTypeId || null}
                  label="Tipo de Fornecedor"
                  required={true}
                  disabled={!isDraft}
                  autofocus={true}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.paymentCondition}
                sx={{ width: "100%" }}
              >
                <AsyncSearch
                  options={paymentConditionOptions}
                  setOptions={setPaymentConditionOptions}
                  option={paymentConditionOption}
                  setOption={handleSetPaymentCondition}
                  asyncSearch={listPaymentConditions}
                  loading={loadingPaymentConditions}
                  error={Boolean(formErrors?.paymentConditionId)}
                  errorMessage={formErrors?.paymentConditionId || null}
                  label="Condição de Pagamento"
                  required={true}
                  disabled={!isDraft}
                />
              </FormControl>
            </Grid>

            {supplierTypeOption?.value === "F" ? (
              <Grid item xs={12} md={6} sm={6}>
                <InputMask
                  mask={"999.999.999-99"}
                  value={corporateDocument}
                  onChange={(e) => setCorporateDocument(e.target.value)}
                  maskPlaceholder={null}
                  required
                  disabled={!isDraft}
                >
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="CPF"
                    helperText={formErrors.corporateDocument}
                    error={!!formErrors.corporateDocument}
                  />
                </InputMask>
              </Grid>
            ) : (
              <Grid item xs={12} md={6} sm={6}>
                <InputMask
                  mask={"99.999.999/9999-99"}
                  value={corporateDocument}
                  onChange={(e) => setCorporateDocument(e.target.value)}
                  maskPlaceholder={null}
                  required
                  disabled={!isDraft}
                >
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="CNPJ"
                    helperText={formErrors.corporateDocument}
                    error={!!formErrors.corporateDocument}
                  />
                </InputMask>
              </Grid>
            )}

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Razão Social"
                value={corporateName}
                onChange={(e) => setCorporateName(e.target.value)}
                helperText={formErrors.corporateName}
                error={!!formErrors.corporateName}
                required
                disabled={!isDraft}
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/suppliers")}
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>

            {supplierId && isDraft && (
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

            {isDraft && (
              <ButtonTheme
                onClick={() => handleSubmit(true)}
                disabled={loading}
                title="Salvar o cadastro ou alteração"
              >
                Salvar
              </ButtonTheme>
            )}

            {supplierId && isDraft && (
              <ButtonTheme
                onClick={async () => {
                  await handleSubmit();
                  setCloseDialogOpen(true);
                }}
                disabled={loading}
                color="info"
                title="Finaliza o cadastro, tornando-o disponível para integração com ERP"
              >
                Finalizar
              </ButtonTheme>
            )}
          </ButtonGroup>
        </Form>

        {loading && <BackdropCustom />}

        {supplierId && (
          <>
            <ConfirmationArea
              id={supplierId}
              dialogOpen={deleteDialogOpen}
              handleConfirmation={handleDeleteSupplier}
              title="Deseja realmente excluir esse fornecedor?"
              message=""
              deny={() => {
                setDeleteDialogOpen(false);
              }}
            />

            <ConfirmationArea
              id={supplierId}
              dialogOpen={closeDialogOpen}
              handleConfirmation={handleCloseSupplier}
              title="Deseja realmente finalizar o cadastro do Fornecedor?"
              message="Essa ação não poderá ser desfeita. Ao finalizar a solicitação, ela ficará disponível para a integração com o ERP."
              deny={() => {
                setCloseDialogOpen(false);
              }}
            />
          </>
        )}
      </PageCard>

      {supplierId && (
        <>
          <PageCard>
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Código"
                    value={code}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Nome Fantasia"
                    value={tradingName}
                    onChange={(e) => setTradingName(e.target.value)}
                    helperText={formErrors.tradingName}
                    error={!!formErrors.tradingName}
                    disabled={!isDraft}
                  />
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <InputMask
                    mask={"(99) 999999999"}
                    value={phone1}
                    maskPlaceholder={null}
                    onChange={(e) => setPhone1(e.target.value)}
                    disabled={!isDraft}
                  >
                    <TextField
                      sx={{ width: "100%" }}
                      size="small"
                      label="Telefone 1"
                      value={phone1}
                      helperText={formErrors.phone1}
                      error={!!formErrors.phone1}
                    />
                  </InputMask>
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <InputMask
                    mask={"(99) 999999999"}
                    value={phone2}
                    maskPlaceholder={null}
                    onChange={(e) => setPhone2(e.target.value)}
                    disabled={!isDraft}
                  >
                    <TextField
                      sx={{ width: "100%" }}
                      size="small"
                      label="Telefone 2"
                      value={phone2}
                      helperText={formErrors.phone2}
                      error={!!formErrors.phone2}
                    />
                  </InputMask>
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Email 1"
                    value={email1}
                    onChange={(e) => setEmail1(e.target.value)}
                    helperText={formErrors.email1}
                    error={!!formErrors.email1}
                    disabled={!isDraft}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Email 2"
                    value={email2}
                    onChange={(e) => setEmail2(e.target.value)}
                    helperText={formErrors.email2}
                    error={!!formErrors.email2}
                    disabled={!isDraft}
                  />
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <FormControl
                    size="small"
                    error={!!formErrors.paymentForm}
                    sx={{ width: "100%" }}
                  >
                    <AsyncSearch
                      options={paymentFormOptions}
                      setOptions={setPaymentFormOptions}
                      option={paymentFormOption}
                      setOption={handleSetPaymentForm}
                      asyncSearch={listPaymentForms}
                      loading={loadingPaymentForms}
                      error={Boolean(formErrors?.paymentFormId)}
                      errorMessage={formErrors?.paymentFormId || null}
                      label="Forma de Pagamento"
                      required={true}
                      disabled={!isDraft}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <InputMask
                    mask={"99999-999"}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    maskPlaceholder={null}
                    onBlur={handleResquestCep}
                    required
                    disabled={!isDraft}
                  >
                    <TextField
                      sx={{ width: "100%" }}
                      size="small"
                      label="CEP"
                      helperText={formErrors.zipCode}
                      error={!!formErrors.zipCode}
                    />
                  </InputMask>
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Estado"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    helperText={formErrors.state}
                    error={!!formErrors.state}
                    required
                    disabled={!isDraft}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    helperText={formErrors.city}
                    error={!!formErrors.city}
                    required
                    disabled={!isDraft}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    helperText={formErrors.neighborhood}
                    error={!!formErrors.neighborhood}
                    required
                    disabled={!isDraft}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Endereço"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    helperText={formErrors.address}
                    error={!!formErrors.address}
                    disabled={!isDraft}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Número"
                    value={addressNumber}
                    onChange={(e) => setAddressNumber(e.target.value)}
                    helperText={formErrors.addressNumber}
                    error={!!formErrors.addressNumber}
                    disabled={!isDraft}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Complemento"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    helperText={formErrors.complement}
                    error={!!formErrors.complement}
                    disabled={!isDraft}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Nome do Contato"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    helperText={formErrors.contactName}
                    error={!!formErrors.contactName}
                    disabled={!isDraft}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    label="Informações Adicionais"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    helperText={formErrors.additionalInfo}
                    error={!!formErrors.additionalInfo}
                    disabled={!isDraft}
                  />
                </Grid>
              </Grid>
            </Form>
          </PageCard>

          {supplierId && (
            <>
              <SuppliersBankDetailsList
                supplierId={supplierId}
                title="Dados Bancários"
                handleSave={handleSubmit}
                disableActions={!isDraft}
              />
              <SupplierAttachments
                supplierId={supplierId}
                title="Anexos"
                disableActions={!isDraft}
                handleSave={handleSubmit}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default Supplier;
