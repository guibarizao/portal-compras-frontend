import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useCustomFieldTypeService } from "../../services/useCustomFieldTypeService";
import { useToastr } from "../../hooks/useToastr";
import ICustomFieldType from "../../interfaces/ICustomFieldType";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { Grid, TextField } from "@mui/material";

interface ICustomFieldTypeProps {
  title: string;
}

const CustomFieldType: React.FC<ICustomFieldTypeProps> = ({ title }) => {
  window.document.title = title;

  const {
    deleteCustomFieldType,
    listCustomFieldTypeById,
    updateCustomFieldType,
    createCustomFieldType,
  } = useCustomFieldTypeService();

  const [customFieldTypeId, setCustomFieldTypeId] = useState("");

  const [id, setId] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListCustomFieldType = useCallback(async () => {
    const id = location.pathname
      .replace("/custom-field-type", "")
      .replace("/", "");

    setCustomFieldTypeId(id);

    if (id) {
      setLoading(true);

      await listCustomFieldTypeById(Number(id))
        .then((response) => {
          const customFieldType: ICustomFieldType = response;

          setId(customFieldType.id ? String(customFieldType.id) : "");
          setDescription(customFieldType.description);
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");

          navigate("/custom-field-types");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate, signOut, toastr, location.pathname]);

  const handleDeleteCustomFieldType = useCallback(async () => {
    setLoading(true);
    await deleteCustomFieldType(Number(customFieldTypeId))
      .then(async () => {
        toastr.success("Tipo de campo customizado deletado com sucesso");

        navigate("/custom-field-types");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [customFieldTypeId, toastr, navigate]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: ICustomFieldType = {
        description,
      };

      const schema = Yup.object().shape({
        description: Yup.string().required("Descrição obrigatória"),
      });

      if (customFieldTypeId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updateCustomFieldType(Number(customFieldTypeId), data)
          .then(async () => {
            await handleListCustomFieldType();

            navigate("/custom-field-types");
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

        await createCustomFieldType(data)
          .then(async () => {
            await handleListCustomFieldType();

            toastr.success("Tipo de campo customizado criado com sucesso");

            navigate("/custom-field-types");
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
    customFieldTypeId,
    description,
    navigate,
    signOut,
    handleListCustomFieldType,
  ]);

  useEffect(() => {
    handleListCustomFieldType();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Tipo de campo customizado</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="id"
                value={id}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                helperText={formErrors.description}
                error={!!formErrors.description}
                autoFocus
                required
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            {customFieldTypeId && (
              <ButtonTheme
                onClick={handleDeleteCustomFieldType}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            <ButtonTheme
              onClick={() => navigate("/custom-field-types")}
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

export default CustomFieldType;
