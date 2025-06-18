import { useCallback, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import moment from "moment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { usePurchaseRequestService } from "../../services/usePurchaseRequestService";
import { useToastr } from "../../hooks/useToastr";
import IPurchaseRequest from "../../interfaces/IPurchaseRequest";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import IBranchOffice from "../../interfaces/IBranchOffice";
import { useBranchOfficeService } from "../../services/useBranchOfficeService";
import { usePurchaseRequestTypeService } from "../../services/usePurchaseRequestTypeService";
import PurchaseRequestItems from "./purchaseRequestItems/PurchaseRequestItems";
import PurchaseRequestAttachments from "./purchaseRequestAttachments/PurchaseRequestAttachments";
import { useSupplierService } from "../../services/useSupplierService";
import ISupplier from "../../interfaces/ISupplier";
import AsyncSearch from "../../components/asyncSearch/AsyncSearch";
import { ConfirmationArea } from "../../components/confirmationArea/ConfirmationArea";
import IPurchaseRequestCustomField from "../../interfaces/IPurchaseRequestCustomField";
import PurchaseRequestCustomFields from "./purchaseRequestCustomFields/PurchaseRequestCustomFields";
import { usePurchaseRequestReasonService } from "../../services/usePurchaseRequestReasonService";
import IPurchaseRequestReason from "../../interfaces/IPurchaseRequestReason";
import { usePurchaseRequestCustomFields } from "../../hooks/purchaseRequestCustomFieldsSession";
import PurchaseRequestEvents from "./purchaseRequestEvents/PurchaseRequestEvents";
import ISuppliersBankDetails from "../../interfaces/ISuppliersBankDetails";
import { useSuppliersBankDetailsService } from "../../services/useSuppliersBankDetailsService";
import { SuppliersBankDetailsArea } from "./PurchaseRequest.styles";
import { SuppliersBankDetailsDialog } from "./suppliersBankDetailsDialog/SuppliersBankDetailsDialog";
import { usePaymentFormService } from "../../services/usePaymentFormServices";
import IPaymentForm from "../../interfaces/IPaymentForm";
import IPurchaseRequestType from "../../interfaces/IPurchaseRequestType";
import PurchaseRequestMessages from "./purchaseRequestMessages/PurchaseRequestMessages";

interface IPurchaseRequestProps {
  title: string;
}

interface IOptions {
  value: string;
  description: string;
}

const PurchaseRequest: React.FC<IPurchaseRequestProps> = ({ title }) => {
  window.document.title = title;
  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut, state, currentHeadOffice } = useAuth();
  const timeout = useRef<any>(0);

  const {
    updatePurchaseRequestCustomFieldsSession,
    getPurchaseRequestCustomFieldsSession,
  } = usePurchaseRequestCustomFields();

  const {
    deletePurchaseRequest,
    listPurchaseRequestById,
    updatePurchaseRequest,
    createPurchaseRequest,
    closePurchaseRequest,
    generatePurchaseRequestReport,
  } = usePurchaseRequestService();

  const { listSuppliersBankDetailsBySupplierId } =
    useSuppliersBankDetailsService();

  const { listSuppliersDynamically } = useSupplierService();

  const { listPaymentFormsDynamically } = usePaymentFormService();

  const { listAllBranchesOffices } = useBranchOfficeService();

  const { listAllPurchaseRequestTypes } = usePurchaseRequestTypeService();

  const { listAllPurchaseRequestReasons } = usePurchaseRequestReasonService();

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

  const [purchaseRequestTypes, setPurchaseRequestTypes] = useState<
    IPurchaseRequestType[]
  >([]);

  const [purchaseRequestType, setPurchaseRequestType] =
    useState<IPurchaseRequestType | null>(() => {
      if (state.branchOffice?.headOffice?.purchaseRequestTypeId) {
        const purchaseRequestTypeExists = purchaseRequestTypes.some(
          (purchaseRequestType) =>
            purchaseRequestType.id ===
            state.branchOffice?.headOffice?.purchaseRequestType?.id
        );

        if (!purchaseRequestTypeExists) {
          const purchaseRequestType =
            state.branchOffice?.headOffice?.purchaseRequestType;

          if (purchaseRequestType) {
            setPurchaseRequestTypes([purchaseRequestType]);
          }
        }
        return state.branchOffice?.headOffice?.purchaseRequestType ?? null;
      }

      return null;
    });

  const [purchaseRequestTypeId, setPurchaseRequestTypeId] = useState(() => {
    if (state.branchOffice?.headOffice?.purchaseRequestTypeId) {
      const purchaseRequestTypeExists = purchaseRequestTypes.some(
        (purchaseRequestType) =>
          purchaseRequestType.id ===
          state.branchOffice?.headOffice?.purchaseRequestType?.id
      );

      if (!purchaseRequestTypeExists) {
        const purchaseRequestType =
          state.branchOffice?.headOffice?.purchaseRequestType;

        if (purchaseRequestType) {
          setPurchaseRequestTypes([purchaseRequestType]);
        }
      }
      return state.branchOffice?.headOffice?.purchaseRequestType?.id;
    }

    return "";
  });

  const [purchaseRequestReasonId, setPurchaseRequestReasonId] = useState("");
  const [purchaseRequestReasons, setPurchaseRequestReasons] = useState<
    IPurchaseRequestReason[]
  >([]);

  const [purchaseRequestReasonDetails, setPurchaseRequestReasonDetails] =
    useState("");

  const [purchaseRequestId, setPurchaseRequestId] = useState("");
  const [protocol, setProtocol] = useState("");
  const [requestNumber, setRequestNumber] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [createdAt, setCreatedAt] = useState("");
  const [username, setUsername] = useState("");
  const [integrationStatus, setIntegrationStatus] = useState("Pendente");
  const [integrationDate, setIntegrationDate] = useState("");

  const [loadingSuppliers, setLoadingSuppliers] = useState<boolean>(false);
  const [supplierOptions, setSupplierOptions] = useState<IOptions[]>([]);
  const [supplierOption, setSupplierOption] = useState<IOptions | null>(null);

  const [suppliersBankDetails, setSuppliersBankDetails] = useState<
    ISuppliersBankDetails[]
  >([]);
  const [suppliersBankDetailsId, setSuppliersBankDetailsId] = useState("");

  const [comments, setComments] = useState("");

  const [loadingPaymentForms, setLoadingPaymentForms] =
    useState<boolean>(false);
  const [paymentForms, setPaymentForms] = useState<IPaymentForm[]>([]);
  const [paymentFormOptions, setPaymentFormOptions] = useState<IOptions[]>([]);
  const [paymentFormOption, setPaymentFormOption] = useState<IOptions | null>(
    null
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const [dialogSuppliersBankDetailsOpen, setDialogSuppliersBankDetailsOpen] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});
  const [purchaseRequestCustomFields, setPurchaseRequestCustomFields] =
    useState<IPurchaseRequestCustomField[]>([]);

  const [showMoreFields, setShowMoreFields] = useState(true);

  const [supplierRequired, setSupplierRequired] = useState<boolean>(false);
  const [reasonRequired, setReasonRequired] = useState<boolean>(false);

  const [messages] = useState(() => location.search.includes("messages=true"));

  const [needBankDetails, setNeedBankDetails] = useState<boolean>(false);

  const supplierToOption = (supplier: ISupplier): IOptions => {
    return {
      value: `${supplier.id}`,
      description: `${supplier.code} ${supplier.corporateName} ${supplier.corporateDocument}`,
    };
  };

  const paymentFormToOption = (paymentForm: IPaymentForm): IOptions => {
    return {
      value: `${paymentForm.id}`,
      description: `${paymentForm.code} ${paymentForm.name}`,
    };
  };

  const handleShowMoreFields = (
    purchaseRequestTypeId: string | undefined,
    purchaseRequestTypes: IPurchaseRequestType[]
  ) => {
    if (purchaseRequestTypeId && purchaseRequestTypes) {
      const purchaseRequestType = purchaseRequestTypes.find(
        (purchaseRequestType) =>
          Number(purchaseRequestType.id) === Number(purchaseRequestTypeId)
      );

      if (purchaseRequestType && purchaseRequestType.showMoreFields) {
        setShowMoreFields(true);
      } else {
        setShowMoreFields(false);
      }
    } else {
      setShowMoreFields(false);
    }
  };

  const listSuppliers = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingSuppliers(true);
      const url = `perPage=50&currentPage=1&orderBy=corporateName&orderDirection=asc&filter=${filter}`;

      await listSuppliersDynamically(url, { isActive: true })
        .then((result) => {
          if (result) {
            const options: IOptions[] = result.data.map(supplierToOption);

            setSupplierOptions(options);
          } else {
            setSupplierOptions([]);
          }
        })
        .catch((error) => {
          setSupplierOptions([]);
          toastr.error(error.message);
        })
        .finally(() => {
          setLoadingSuppliers(false);
        });
    }, timeout.current);
  };

  const handleListBranchesOffices = useCallback(async () => {
    const url = `perPage=50&currentPage=1&orderBy=name&orderDirection=asc&filterField=name&filterValue=&precision=containing`;

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

  const handleListPurchaseRequestTypes = useCallback(async () => {
    const url = `perPage=50&currentPage=1&orderBy=id&orderDirection=asc&filterField=descriprion&filterValue=&precision=containing`;

    setLoading(true);

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

  const handleListPurchaseRequestReasons = useCallback(async () => {
    const url = `perPage=50&currentPage=1&orderBy=description&orderDirection=asc&filterField=description&filterValue=&precision=containing`;

    setLoading(true);

    await listAllPurchaseRequestReasons(url)
      .then((response) => {
        setPurchaseRequestReasons(response.data);
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

  const listPaymentForms = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingPaymentForms(true);
      const url = `perPage=50&currentPage=1&orderBy=code&orderDirection=asc&filter=${filter}`;

      await listPaymentFormsDynamically(url)
        .then((result) => {
          if (result) {
            setPaymentForms(result.data);
            const options: IOptions[] = result.data.map(paymentFormToOption);

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

  const handleListPurchaseRequest = useCallback(
    async (purchaseRequestId: string | null) => {
      let id = location.pathname
        .replace("/purchase-request", "")
        .replace("/", "");

      if (!id && !!purchaseRequestId) {
        id = purchaseRequestId;
      }

      setPurchaseRequestId(id);

      if (id) {
        setLoading(true);

        await listPurchaseRequestById(id)
          .then((response) => {
            const purchaseRequest: IPurchaseRequest = response;

            if (purchaseRequest?.branchOfficeId) {
              const branchOfficeExists = branchOffices.some(
                (branchOffice) =>
                  branchOffice.id === purchaseRequest.branchOffice?.id
              );

              if (!branchOfficeExists && purchaseRequest.branchOffice) {
                setBranchesOffices([purchaseRequest.branchOffice]);
              }
              setBranchOfficeId(purchaseRequest.branchOfficeId);
            }

            if (purchaseRequest?.purchaseRequestTypeId) {
              setPurchaseRequestTypeId(
                String(purchaseRequest.purchaseRequestTypeId)
              );
            }

            if (purchaseRequest?.purchaseRequestType) {
              setPurchaseRequestType(purchaseRequest?.purchaseRequestType);
            }

            purchaseRequest?.protocol && setProtocol(purchaseRequest.protocol);

            purchaseRequest?.requestNumber &&
              setRequestNumber(purchaseRequest.requestNumber);

            setIsDraft(purchaseRequest.isDraft);

            purchaseRequest?.created_at &&
              setCreatedAt(
                moment(purchaseRequest.created_at).format("DD/MM/YYYY HH:mm")
              );

            purchaseRequest.user?.username &&
              setUsername(purchaseRequest.user.username);

            purchaseRequest.integrationStatus === "PENDING" &&
              setIntegrationStatus("Pendente");

            purchaseRequest.integrationStatus === "ERROR" &&
              setIntegrationStatus("Erro");

            if (purchaseRequest.integrationStatus === "SUCCESS") {
              setIntegrationStatus("Sucesso");
            }

            purchaseRequest.integrationDate &&
              setIntegrationDate(
                moment(purchaseRequest.integrationDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              );

            if (purchaseRequest.supplier) {
              const supplierOption = supplierToOption(purchaseRequest.supplier);

              supplierOption && setSupplierOption(supplierOption);
            }

            if (purchaseRequest?.suppliersBankDetailsId) {
              const suppliersBankDetailsExists = suppliersBankDetails.some(
                (suppliersBankDetail) =>
                  suppliersBankDetail.id ===
                  purchaseRequest.suppliersBankDetails?.id
              );

              if (
                !suppliersBankDetailsExists &&
                purchaseRequest.suppliersBankDetails
              ) {
                setSuppliersBankDetails([purchaseRequest.suppliersBankDetails]);
              }
              setSuppliersBankDetailsId(purchaseRequest.suppliersBankDetailsId);
            }

            purchaseRequest.comments && setComments(purchaseRequest.comments);

            if (
              purchaseRequest.purchaseRequestCustomFields &&
              purchaseRequest.purchaseRequestCustomFields?.length > 0
            ) {
              setPurchaseRequestCustomFields(
                purchaseRequest.purchaseRequestCustomFields
              );
            }

            if (purchaseRequest?.purchaseRequestReasonId) {
              const reasonExists = purchaseRequestReasons.some(
                (reason) => reason.id === purchaseRequest.purchaseRequestReason
              );

              if (!reasonExists && purchaseRequest.purchaseRequestReason) {
                setPurchaseRequestReasons([
                  purchaseRequest.purchaseRequestReason,
                ]);
              }
              setPurchaseRequestReasonId(
                String(purchaseRequest.purchaseRequestReasonId)
              );
            }

            purchaseRequest.purchaseRequestReasonDetails &&
              setPurchaseRequestReasonDetails(
                purchaseRequest.purchaseRequestReasonDetails
              );

            purchaseRequest.purchaseRequestCustomFields &&
              updatePurchaseRequestCustomFieldsSession(
                purchaseRequest.purchaseRequestCustomFields || null
              );

            if (purchaseRequest.paymentForm) {
              const paymentFormOption = paymentFormToOption(
                purchaseRequest.paymentForm
              );

              paymentFormOption && setPaymentFormOption(paymentFormOption);
            }

            setSupplierRequired(
              Boolean(purchaseRequest.purchaseRequestType?.supplierRequired)
            );
            setReasonRequired(
              Boolean(purchaseRequest.purchaseRequestType?.reasonRequired)
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
    [
      purchaseRequestId,
      navigate,
      signOut,
      location.pathname,
      purchaseRequestTypes,
      updatePurchaseRequestCustomFieldsSession,
    ]
  );

  const handleDeletePurchaseRequest = useCallback(async () => {
    setLoading(true);
    await deletePurchaseRequest(purchaseRequestId)
      .then(async () => {
        toastr.success("Solicitação de compra deletada com sucesso");

        navigate("/purchase-requests");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [purchaseRequestId, toastr, navigate]);

  const handleCustomFieldValidation = (
    purchaseRequestCustomFieldsSession: IPurchaseRequestCustomField[]
  ) => {
    purchaseRequestCustomFieldsSession.forEach((field) => {
      if (
        field.customField.isRequired &&
        !(field.value && field.value?.length > 0) &&
        field.customField.typeId !== 6
      ) {
        throw new Error(`Campo ${field.customField.description} é obrigatório`);
      }

      if (field.customField.isRequired && field.customField.typeId === 6) {
        if (field.purchaseRequestCustomFieldListOptions.length < 1) {
          throw new Error(
            `Campo ${field.customField.description} é obrigatório, porém não posui opções listadas, contate o suporte`
          );
        }

        const hasSelected = field.purchaseRequestCustomFieldListOptions.some(
          (option) => option.selected
        );

        if (!hasSelected) {
          throw new Error(
            `Campo ${field.customField.description} é obrigatório, selecione ao menos uma opção`
          );
        }
      }
    });
  };

  const handleClosePurchaseRequest = useCallback(async () => {
    setLoading(true);

    try {
      const purchaseRequestCustomFieldsSession =
        getPurchaseRequestCustomFieldsSession();

      handleCustomFieldValidation(purchaseRequestCustomFieldsSession);

      await closePurchaseRequest(purchaseRequestId).then(async () => {
        toastr.success("Solicitação de compra finalizada com sucesso");
        handleListPurchaseRequest(null);
      });
    } catch (error: Yup.ValidationError | any) {
      toastr.error(error?.message || "Contate a equipe de suporte");
    } finally {
      setLoading(false);
    }
  }, [purchaseRequestId, toastr, navigate, handleListPurchaseRequest]);

  const handleSubmit = useCallback(
    async (goToItem = false) => {
      setLoading(true);
      setFormErrors({});

      const purchaseRequestCustomFieldsSession =
        getPurchaseRequestCustomFieldsSession();

      try {
        const data: IPurchaseRequest = {
          branchOfficeId,
          purchaseRequestTypeId: Number(purchaseRequestTypeId),
          isDraft,
          comments,
          suppliersBankDetailsId: suppliersBankDetailsId
            ? suppliersBankDetailsId
            : null,
          purchaseRequestReasonId: purchaseRequestReasonId
            ? Number(purchaseRequestReasonId)
            : null,
          purchaseRequestReasonDetails,
          purchaseRequestCustomFields: purchaseRequestCustomFieldsSession,
          paymentFormId: paymentFormOption?.value
            ? paymentFormOption.value
            : null,
          supplierId: supplierOption?.value ? supplierOption?.value : null,
        };

        const schema = Yup.object().shape({
          branchOfficeId: Yup.string().required("Filial obrigatória"),
          purchaseRequestTypeId: Yup.number()
            .required("Tipo de solicitação obrigatória")
            .positive("Tipo de solicitação obrigatória")
            .integer("Tipo de solicitação obrigatória"),
          comments: Yup.string().nullable(),
        });

        if (purchaseRequestId) {
          await schema.validate(data, {
            abortEarly: false,
          });

          handleCustomFieldValidation(purchaseRequestCustomFieldsSession);

          await updatePurchaseRequest(purchaseRequestId, data)
            .then(async (response) => {
              const purchaseRequest: IPurchaseRequest = response;

              purchaseRequest.purchaseRequestCustomFields &&
                updatePurchaseRequestCustomFieldsSession(
                  purchaseRequest.purchaseRequestCustomFields
                );

              if (!goToItem) {
                navigate(`/purchase-request/${purchaseRequest.id}`);
                toastr.success("Solicitação de compra atualizada com sucesso");
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
          await schema.validate(data, {
            abortEarly: false,
          });

          await createPurchaseRequest(data)
            .then(async (response) => {
              const purchaseRequest: IPurchaseRequest = response;

              if (!goToItem) {
                navigate(`/purchase-request/${purchaseRequest.id}`);
                window.location.reload();
                toastr.success("Solicitação de compra criada com sucesso");
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
      purchaseRequestId,
      branchOfficeId,
      purchaseRequestTypeId,
      isDraft,
      comments,
      suppliersBankDetailsId,
      purchaseRequestReasonId,
      purchaseRequestReasonDetails,
      paymentFormOption,
      supplierOption,
      navigate,
      signOut,
      handleListPurchaseRequest,
      updatePurchaseRequestCustomFieldsSession,
    ]
  );

  const handleFinish = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data = {
        supplierId: supplierOption?.value ? supplierOption.value : null,
        purchaseRequestReasonId: purchaseRequestReasonId
          ? purchaseRequestReasonId
          : null,
        supplierRequired,
        reasonRequired,
      };

      const schema = Yup.object().shape({
        supplierId: Yup.string()
          .nullable()
          .test(
            "requiredIfSupplierRequired",
            "Fornecedor obrigatório",
            function (value) {
              const { supplierRequired } = this.parent;
              if (supplierRequired) {
                return value !== null && value !== undefined && value !== "";
              }
              return true;
            }
          ),
        purchaseRequestReasonId: Yup.string()
          .nullable()
          .test(
            "requiredIfReasonRequired",
            "Motivo de Compra obrigatório",
            function (value) {
              const { reasonRequired } = this.parent;
              if (reasonRequired) {
                return value !== null && value !== undefined && value !== "";
              }
              return true;
            }
          ),
      });

      await schema.validate(data, {
        abortEarly: false,
        context: {
          supplierRequired,
          purchaseRequestReasonId,
        },
      });

      setCloseDialogOpen(true);
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
    supplierOption,
    supplierRequired,
    purchaseRequestReasonId,
    reasonRequired,
  ]);

  const handleChangeBranchOffice = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setBranchOfficeId(id);
  };

  const handleChangePurchaseRequestType = useCallback(
    (event: SelectChangeEvent) => {
      const id = event.target.value;
      setPurchaseRequestTypeId(id);

      setPurchaseRequestType(
        purchaseRequestTypes.find(
          (purchaseRequestType) => purchaseRequestType.id === id
        ) || null
      );
    },
    [purchaseRequestTypes]
  );

  const handleChangePurchaseRequestReason = (event: SelectChangeEvent) => {
    const id = event.target.value;

    if (id === "") {
      setPurchaseRequestReasonDetails("");
    }
    setPurchaseRequestReasonId(id);
  };

  const handleSetSupplier = (option: IOptions | null) => {
    if (option) {
      setSupplierOption(option);
      setSuppliersBankDetailsId("");
      const selected = supplierOptions.find((supplierOption) => {
        return supplierOption.value === option.value;
      });
      if (selected?.value) {
        setSupplierOption(selected);
      } else {
        setSupplierOption(null);
      }
    }
  };

  const handleSetPaymentForm = (option: IOptions | null) => {
    if (option) {
      setPaymentFormOption(option);
      const selected = paymentFormOptions.find((paymentFormOption) => {
        return paymentFormOption.value === option.value;
      });

      if (selected?.value) {
        setPaymentFormOption(selected);
      } else {
        setPaymentFormOption(null);
      }
    }
  };

  const handleChangeSuppliersBankDetails = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setSuppliersBankDetailsId(id);
  };

  const handleGenerateReport = useCallback(
    async (purchaseRequestId: string | null) => {
      let id = location.pathname
        .replace("/purchase-request", "")
        .replace("/", "");

      if (!id && !!purchaseRequestId) {
        id = purchaseRequestId;
      }

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
    [purchaseRequestId, requestNumber, navigate, signOut, location.pathname]
  );

  const handleListSuppliersBankDetails = async (supplierId: string) => {
    setLoading(true);
    await listSuppliersBankDetailsBySupplierId(supplierId)
      .then((response) => {
        setSuppliersBankDetails(response);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseDialogSuppliersBankDetails = () => {
    setDialogSuppliersBankDetailsOpen(false);
  };

  const handleOpenDialogSuppliersBankDetails = () => {
    setDialogSuppliersBankDetailsOpen(true);
  };

  const formatDetailBank = (detail: ISuppliersBankDetails): string => {
    let datailString = "";

    if (detail.bankCode) {
      datailString = datailString + `${detail.bankCode}`;
    }

    if (detail.agency) {
      datailString = datailString + ` | ${detail.agency}`;
    }

    if (detail.accountNumber) {
      datailString = datailString + ` | ${detail.accountNumber}`;
    }

    if (detail.pixKey) {
      datailString =
        datailString +
        `${datailString === "" ? "" : " | "}PIX: ${detail.pixKey}`;
    }

    return datailString;
  };

  useEffect(() => {
    handleListBranchesOffices();
  }, []);

  useEffect(() => {
    handleListPurchaseRequestTypes();
  }, []);

  useEffect(() => {
    handleListPurchaseRequest(null);
  }, []);

  useEffect(() => {
    handleListPurchaseRequestReasons();
  }, []);

  useEffect(() => {
    updatePurchaseRequestCustomFieldsSession([]);
  }, []);

  useEffect(() => {
    if (supplierOption?.value && !dialogSuppliersBankDetailsOpen) {
      handleListSuppliersBankDetails(supplierOption?.value);
    }
  }, [dialogSuppliersBankDetailsOpen, supplierOption]);

  useEffect(() => {
    if (purchaseRequestTypeId && purchaseRequestTypes) {
      handleShowMoreFields(purchaseRequestTypeId, purchaseRequestTypes);
    }
  }, [purchaseRequestTypeId, purchaseRequestTypes]);

  useEffect(() => {
    const paymentFormSelect = paymentForms.find(
      (paymentForm) => paymentForm.id === paymentFormOption?.value
    );

    setNeedBankDetails(paymentFormSelect?.needBankDetails || false);
  }, [paymentFormOption, paymentForms]);

  return (
    <>
      <TitleContainer>
        <h1>Solicitação de compra</h1>
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
                error={!!formErrors.purchaseRequestTypeId}
              >
                <InputLabel
                  id="purchase-request-type-select"
                  disabled={!isDraft}
                >
                  Tipo solicitação
                </InputLabel>
                <Select
                  labelId="purchase-request-type-select"
                  id="purchase-request-type"
                  value={purchaseRequestTypeId}
                  label="Tipo solicitação"
                  onChange={handleChangePurchaseRequestType}
                  style={{ textAlign: "start" }}
                  disabled={!isDraft}
                  autoFocus
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
                <FormHelperText>
                  {formErrors.purchaseRequestTypeId}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Observação"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={!isDraft}
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/purchase-requests")}
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>

            {purchaseRequestId && isDraft && (
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
                onClick={() => handleGenerateReport(purchaseRequestId)}
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

            {purchaseRequestId && isDraft && (
              <ButtonTheme
                onClick={() => handleFinish()}
                disabled={loading}
                color="info"
                title="Finaliza a solicitação, tonando-a disponível para integração com ERP"
              >
                Finalizar
              </ButtonTheme>
            )}
          </ButtonGroup>
        </Form>

        {loading && <BackdropCustom />}

        {purchaseRequestId && (
          <>
            <ConfirmationArea
              id={purchaseRequestId}
              dialogOpen={deleteDialogOpen}
              handleConfirmation={handleDeletePurchaseRequest}
              title="Deseja realmente excluir a solicitação de compra?"
              message=""
              deny={() => {
                setDeleteDialogOpen(false);
              }}
            />

            <ConfirmationArea
              id={purchaseRequestId}
              dialogOpen={closeDialogOpen}
              handleConfirmation={handleClosePurchaseRequest}
              title="Deseja realmente finalizar a solicitação de compra?"
              message="Essa ação não poderá ser desfeita. Ao finalizar a solicitação, ela ficará disponível para a integração com o ERP."
              deny={() => {
                setCloseDialogOpen(false);
              }}
            />
          </>
        )}
      </PageCard>

      {purchaseRequestId && !messages && (
        <Paper sx={{ margin: "16px" }} elevation={6}>
          <Accordion elevation={0} expanded={showMoreFields}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{ marginLeft: "2px" }}
              onClick={() => {
                setShowMoreFields(!showMoreFields);
              }}
            >
              Mostrar mais campos
            </AccordionSummary>
            <AccordionDetails sx={{ marginBottom: "24px" }}>
              <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
                <Grid item xs={12} md={6} sm={6}>
                  <FormControl
                    sx={{ width: "100%" }}
                    size="small"
                    error={!!formErrors.supplierId}
                    required={supplierRequired}
                  >
                    <AsyncSearch
                      options={supplierOptions}
                      setOptions={setSupplierOptions}
                      option={supplierOption}
                      setOption={handleSetSupplier}
                      asyncSearch={listSuppliers}
                      loading={loadingSuppliers && !loading}
                      error={Boolean(formErrors?.supplierId)}
                      errorMessage={formErrors?.supplierId || null}
                      label="Fornecedor"
                      disabled={!isDraft}
                      required={supplierRequired}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} sm={6}>
                  <FormControl
                    sx={{ width: "100%" }}
                    size="small"
                    error={!!formErrors.paymentFormId}
                  >
                    <AsyncSearch
                      options={paymentFormOptions}
                      setOptions={setPaymentFormOptions}
                      option={paymentFormOption}
                      setOption={handleSetPaymentForm}
                      asyncSearch={listPaymentForms}
                      loading={loadingPaymentForms && !loading}
                      error={Boolean(formErrors?.paymentFormId)}
                      errorMessage={formErrors?.paymentFormId || null}
                      label="Forma de pagamento"
                      disabled={!isDraft}
                    />
                  </FormControl>
                </Grid>

                {needBankDetails && (
                  <Grid item xs={12} md={6} sm={6}>
                    <SuppliersBankDetailsArea>
                      <FormControl
                        sx={{ width: "100%" }}
                        size="small"
                        error={!!formErrors.suppliersBankDetailsId}
                      >
                        <InputLabel id="suppliers-bank-details-select">
                          Dados bancários
                        </InputLabel>
                        <Select
                          labelId="suppliers-bank-details-select"
                          id="suppliers-bank-details"
                          value={suppliersBankDetailsId}
                          label="Dados bancários"
                          onChange={handleChangeSuppliersBankDetails}
                          style={{ textAlign: "start" }}
                          disabled={!isDraft}
                        >
                          {suppliersBankDetails.map((detail) => (
                            <MenuItem key={detail.id} value={detail.id}>
                              {formatDetailBank(detail)}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {formErrors.suppliersBankDetailsId}
                        </FormHelperText>
                      </FormControl>

                      {isDraft && (
                        <Tooltip
                          title="Adicionar dados bancários"
                          placement="top"
                        >
                          <IconButton
                            onClick={handleOpenDialogSuppliersBankDetails}
                            size="small"
                            color="primary"
                            sx={{ marginLeft: "16px" }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </SuppliersBankDetailsArea>

                    <SuppliersBankDetailsDialog
                      dialogOpen={dialogSuppliersBankDetailsOpen}
                      handleOpenDialog={handleOpenDialogSuppliersBankDetails}
                      handleCloseDialog={handleCloseDialogSuppliersBankDetails}
                      supplierId={
                        (supplierOption && supplierOption.value) || ``
                      }
                    />
                  </Grid>
                )}

                {purchaseRequestType?.reasonRequired && (
                  <>
                    <Grid item xs={12} md={6} sm={6}>
                      <FormControl
                        sx={{ width: "100%" }}
                        size="small"
                        error={!!formErrors.purchaseRequestReasonId}
                        required={reasonRequired}
                      >
                        <InputLabel id="reason-select">
                          Motivo de compra
                        </InputLabel>
                        <Select
                          labelId="reason-select"
                          id="reason"
                          value={purchaseRequestReasonId}
                          label="Motivo de compra"
                          onChange={handleChangePurchaseRequestReason}
                          style={{ textAlign: "start" }}
                          disabled={!isDraft}
                          required={reasonRequired}
                        >
                          <MenuItem key="none" value="">
                            Nenhum
                          </MenuItem>
                          {purchaseRequestReasons.map(
                            (purchaseRequestReason) => (
                              <MenuItem
                                key={purchaseRequestReason.id}
                                value={purchaseRequestReason.id}
                              >
                                {purchaseRequestReason.id} -{" "}
                                {purchaseRequestReason.description}
                              </MenuItem>
                            )
                          )}
                        </Select>
                        <FormHelperText>
                          {formErrors.purchaseRequestReasonId}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {purchaseRequestReasonId && (
                      <Grid item xs={12} md={6} sm={6}>
                        <TextField
                          sx={{ width: "100%" }}
                          size="small"
                          label="Qual o motivo da compra fora do fluxo?"
                          value={purchaseRequestReasonDetails}
                          onChange={(e) =>
                            setPurchaseRequestReasonDetails(e.target.value)
                          }
                          disabled={!isDraft}
                        />
                      </Grid>
                    )}
                  </>
                )}

                {purchaseRequestCustomFields.length > 0 && (
                  <PurchaseRequestCustomFields isDraft={isDraft} />
                )}

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

      {purchaseRequestId && (
        <>
          <PurchaseRequestItems
            title="Itens"
            purchaseRequestId={purchaseRequestId}
            purchaseRequestDisableEdit={!isDraft}
            expanded={!messages}
            handleSubmitGeneralData={() => handleSubmit(true)}
          />

          {!messages && (
            <PurchaseRequestAttachments
              title="Anexos"
              purchaseRequestId={purchaseRequestId}
              purchaseRequestDisableEdit={!isDraft}
            />
          )}

          {!messages && (
            <PurchaseRequestEvents
              title="Eventos"
              purchaseRequestId={purchaseRequestId}
            />
          )}

          {messages && (
            <PurchaseRequestMessages
              title="Mensagens"
              purchaseRequestId={purchaseRequestId}
              expanded={messages}
            />
          )}
        </>
      )}
    </>
  );
};

export default PurchaseRequest;
