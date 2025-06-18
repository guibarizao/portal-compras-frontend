import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useCustomFieldService } from "../../services/useCustomFieldService";
import { useToastr } from "../../hooks/useToastr";
import ICustomField from "../../interfaces/ICustomField";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ListOptionsArea } from "./CustomField.styles";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { useCustomFieldTypeService } from "../../services/useCustomFieldTypeService";
import ICustomFieldType from "../../interfaces/ICustomFieldType";
import { useCustomFieldDocumentTypeService } from "../../services/useCustomFieldDocumentTypeService";
import ICustomFieldListType from "../../interfaces/ICustomFieldListType";
import CustomFieldListOption from "./customFieldListOption/CustomFieldListOption";
import { useCustomFieldListOptions } from "../../hooks/customFieldsListOptions";
import { AppError } from "../../util/errors/AppError";
import { useCustomFieldListOptionsService } from "../../services/useCustomFieldListOptionsService";

interface ICustomFieldProps {
  title: string;
}

const CustomField: React.FC<ICustomFieldProps> = ({ title }) => {
  window.document.title = title;
  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const {
    customFieldListOptionsContext,
    setCustomFieldListOptionsContext,
    clearCustomFieldListOptionsContext,
    initializeCustomFieldListOptionsContext,
  } = useCustomFieldListOptions();

  const {
    deleteCustomField,
    listCustomFieldById,
    updateCustomField,
    createCustomField,
  } = useCustomFieldService();

  const { deleteCustomFieldListOption } = useCustomFieldListOptionsService();
  const { listAllCustomFieldTypes } = useCustomFieldTypeService();
  const { listAllCustomFieldDocumentTypes } =
    useCustomFieldDocumentTypeService();

  const [customFieldId, setCustomFieldId] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const [customFieldTypes, setCustomFieldTypes] = useState<ICustomFieldType[]>(
    []
  );
  const [customFieldTypeId, setCustomFieldTypeId] = useState("");

  const [customFieldDocumentTypes, setCustomFieldDocumentTypes] = useState<
    ICustomFieldType[]
  >([]);
  const [customFieldDocumentTypeId, setCustomFieldDocumentTypeId] =
    useState("");

  const [customFieldListTypes] = useState<ICustomFieldListType[]>([
    {
      value: "SIMPLE",
      description: "Simples",
    },
    {
      value: "MULTIPLE",
      description: "Múltiplos",
    },
  ]);
  const [customFieldListType, setCustomFieldListType] = useState("SIMPLE");

  const [isActive, setIsActive] = useState(true);
  const [isRequired, setIsRequired] = useState(true);

  const handleChangeIsActive = (event: ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked);
  };

  const handleChangeIsRequire = (event: ChangeEvent<HTMLInputElement>) => {
    setIsRequired(event.target.checked);
  };

  const handleListCustomField = useCallback(async () => {
    const id = location.pathname.replace("/custom-field", "").replace("/", "");

    setCustomFieldId(id);

    if (id) {
      setLoading(true);

      await listCustomFieldById(id)
        .then((response) => {
          const customField: ICustomField = response;
          setDescription(customField.description);
          if (customField?.typeId) {
            const customFieldTypeExists = customFieldTypes.some(
              (customFieldType) => customFieldType.id === customField.type?.id
            );

            if (!customFieldTypeExists && customField.type) {
              setCustomFieldTypes([customField.type]);
            }
            setCustomFieldTypeId(String(customField.typeId));
          }

          if (customField?.documentTypeId) {
            const customFieldDocumentTypeExists = customFieldDocumentTypes.some(
              (customFieldDocumentType) =>
                customFieldDocumentType.id === customField.documentType?.id
            );

            if (!customFieldDocumentTypeExists && customField.documentType) {
              setCustomFieldDocumentTypes([customField.documentType]);
            }
            setCustomFieldDocumentTypeId(String(customField.documentTypeId));
          }

          if (customField.typeId === 6 && customField.customFieldListOptions) {
            customField.customFieldListOptions.length > 0
              ? initializeCustomFieldListOptionsContext(
                  customField.customFieldListOptions.sort(
                    (a, b) => a.sequence - b.sequence
                  )
                )
              : customFieldListOptionsContext.length === 0 && handleAddItem();
          }

          setCustomFieldListType(
            customField.listType ? customField.listType : "SIMPLE"
          );

          setIsActive(customField.isActive);

          setIsRequired(customField.isRequired);
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");

          navigate("/custom-fields");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    navigate,
    signOut,
    toastr,
    location.pathname,
    initializeCustomFieldListOptionsContext,
  ]);

  const handleListCustomFieldTypes = useCallback(async () => {
    const url = `perPage=10&currentPage=1&orderBy=name&orderDirection=asc&filterField=name&filterValue=&precision=containing`;

    setLoading(true);

    await listAllCustomFieldTypes(url)
      .then((response) => {
        setCustomFieldTypes(response.data);
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

  const handleListCustomFieldDocumentTypes = useCallback(async () => {
    const url = `perPage=10&currentPage=1&orderBy=name&orderDirection=asc&filterField=name&filterValue=&precision=containing`;

    setLoading(true);

    await listAllCustomFieldDocumentTypes(url)
      .then((response) => {
        setCustomFieldDocumentTypes(response.data);
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

  const handleDeleteCustomField = useCallback(async () => {
    setLoading(true);
    await deleteCustomField(customFieldId)
      .then(async () => {
        toastr.success("Campo customizado deletado com sucesso");

        navigate("/custom-fields");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [customFieldId, toastr, navigate]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: ICustomField = {
        description,
        documentTypeId: Number(customFieldDocumentTypeId),
        isActive: isActive,
        typeId: Number(customFieldTypeId),
        isRequired: isRequired,
        listType: customFieldListType === "MULTIPLE" ? "MULTIPLE" : "SIMPLE",
        customFieldListOptions: customFieldListOptionsContext,
      };

      if (data.typeId === 6) {
        if (!data.customFieldListOptions) {
          throw new AppError(
            "É necessário preencher uma opção para o tipo lista"
          );
        }

        const hasDescription = data.customFieldListOptions.some(
          (option) => option.description.length > 0
        );

        if (!hasDescription) {
          throw new AppError(
            "É necessário preencher uma opção para o tipo lista"
          );
        }
      }

      const schema = Yup.object().shape({
        description: Yup.string().required("Descrição obrigatória"),

        typeId: Yup.number()
          .test(
            "Tipo do campo é obrigatório",
            "Tipo do campo é obrigatório",
            (value) => !!value && value > 0
          )
          .required("Tipo do campo é obrigatório"),
        documentTypeId: Yup.number()
          .test(
            "Tipo de documento é obrigatório",
            "Tipo de documento é obrigatório",
            (value) => !!value && value > 0
          )
          .required("Tipo de documento é obrigatório"),
      });

      if (customFieldId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updateCustomField(customFieldId, data)
          .then(async () => {
            await handleListCustomField();

            navigate("/custom-fields");
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

        await createCustomField(data)
          .then(async () => {
            await handleListCustomField();

            toastr.success("Campo customizado criado com sucesso");

            navigate("/custom-fields");
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
    customFieldId,
    description,
    isActive,
    isRequired,
    customFieldTypeId,
    customFieldDocumentTypeId,
    customFieldListOptionsContext,
    navigate,
    signOut,
    handleListCustomField,
  ]);

  const handleChengeCustomFieldType = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setCustomFieldTypeId(id);
  };

  const handleChengeCustomFieldDocumentType = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setCustomFieldDocumentTypeId(id);
  };

  const handleResetSelection = async () => {
    const newCustomFieldListOptions = customFieldListOptionsContext.map(
      (option) => {
        option.selectedDefault = false;

        return option;
      }
    );

    setCustomFieldListOptionsContext(newCustomFieldListOptions);
  };

  const handleChengeCustomFieldListType = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setCustomFieldListType(value);

    handleResetSelection();
  };

  const handleAddItem = () => {
    setCustomFieldListOptionsContext([
      ...customFieldListOptionsContext,
      {
        id: uuidv4(),
        sequence: new Date().getTime(),
        customFieldId: "",
        description: "",
        selectedDefault: false,
      },
    ]);
  };

  const handleDeleteItem = async (id: string) => {
    if (customFieldListOptionsContext.length > 1) {
      setLoading(true);
      await deleteCustomFieldListOption(id)
        .then(() => {
          const newList = customFieldListOptionsContext.filter(
            (option) => option.id !== id
          );

          setCustomFieldListOptionsContext(newList);
        })
        .catch((error: Yup.ValidationError | any) => {
          if (error instanceof Yup.ValidationError) {
            const errors = getValidationError(error);
            setFormErrors(errors);
            return;
          }

          toastr.error(error?.message || "Contate a equipe de suporte");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    handleListCustomField();
  }, []);

  useEffect(() => {
    handleListCustomFieldTypes();
  }, []);

  useEffect(() => {
    handleListCustomFieldDocumentTypes();
  }, []);

  useEffect(() => {
    clearCustomFieldListOptionsContext();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Campo customizado</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={6} md={6} sm={6}>
              <FormControlLabel
                label="Obrigatório"
                control={
                  <Checkbox
                    checked={isRequired}
                    onChange={handleChangeIsRequire}
                  />
                }
              />
            </Grid>

            <Grid item xs={6} md={6} sm={6}>
              <FormControlLabel
                label="Ativo"
                control={
                  <Checkbox
                    checked={isActive}
                    onChange={handleChangeIsActive}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                sx={{ width: "100%" }}
                size="small"
                error={!!formErrors.documentTypeId}
                required
              >
                <InputLabel id="custom-field-document-type-select">
                  Tipo de Documento
                </InputLabel>
                <Select
                  labelId="custom-field-document-type-select"
                  id="custom-field-document-type"
                  value={customFieldDocumentTypeId}
                  label="Tipo de Documento"
                  onChange={handleChengeCustomFieldDocumentType}
                  style={{ textAlign: "start" }}
                  required
                  autoFocus
                >
                  {customFieldDocumentTypes.map((customFieldDocumentType) => (
                    <MenuItem
                      key={customFieldDocumentType.id}
                      value={customFieldDocumentType.id}
                    >
                      {customFieldDocumentType.description}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formErrors.documentTypeId}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                sx={{ width: "100%" }}
                size="small"
                error={!!formErrors.typeId}
                required
              >
                <InputLabel id="custom-field-type-select">Tipo</InputLabel>
                <Select
                  labelId="custom-field-type-select"
                  id="custom-field-type"
                  value={customFieldTypeId}
                  label="Tipo"
                  onChange={handleChengeCustomFieldType}
                  style={{ textAlign: "start" }}
                  required
                >
                  {customFieldTypes.map((customFieldType) => (
                    <MenuItem
                      key={customFieldType.id}
                      value={customFieldType.id}
                    >
                      {customFieldType.description}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formErrors.typeId}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                helperText={formErrors.description}
                error={!!formErrors.description}
                required
              />
            </Grid>

            {Number(customFieldTypeId) === 6 && (
              <Grid item xs={12} md={6} sm={6}>
                <FormControl sx={{ width: "100%" }} size="small" required>
                  <InputLabel id="custom-field-list-type-select">
                    Tipo da Lista
                  </InputLabel>
                  <Select
                    labelId="custom-field-list-type-select"
                    id="custom-field-list-type"
                    value={customFieldListType}
                    label="Tipo da Lista"
                    onChange={handleChengeCustomFieldListType}
                    style={{ textAlign: "start" }}
                    required
                  >
                    {customFieldListTypes.map((customFieldListType) => (
                      <MenuItem
                        key={customFieldListType.value}
                        value={customFieldListType.value}
                      >
                        {customFieldListType.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {Number(customFieldTypeId) === 6 && (
              <ListOptionsArea>
                <span>
                  Marque com {<Checkbox checked={true} />}os itens que devem
                  estar pré-selecionados, caso não deseje ter um campo padrão,
                  basta não selecionar nenhum.
                </span>

                <Grid item xs={12} md={6} sm={12}>
                  {customFieldListOptionsContext.map(
                    (customFieldListOption, index) => (
                      <CustomFieldListOption
                        itemIndex={index}
                        key={customFieldListOption.id}
                        customFieldListOption={customFieldListOption}
                        handleAddItem={handleAddItem}
                        handleDeleteItem={() =>
                          handleDeleteItem(customFieldListOption.id)
                        }
                        listType={
                          customFieldListType === "MULTIPLE"
                            ? "MULTIPLE"
                            : "SIMPLE"
                        }
                      />
                    )
                  )}
                </Grid>
              </ListOptionsArea>
            )}
          </Grid>

          <ButtonGroup justformobilie>
            {customFieldId && (
              <ButtonTheme
                onClick={handleDeleteCustomField}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            <ButtonTheme
              onClick={() => navigate("/settings")}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Cancelar
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

export default CustomField;
