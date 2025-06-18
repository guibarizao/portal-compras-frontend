import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useCustomFieldDocumentTypeService } from "../../services/useCustomFieldDocumentTypeService";
import { useToastr } from "../../hooks/useToastr";
import ICustomFieldDocumentType from "../../interfaces/ICustomFieldDocumentType";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import IFormError from "../../interfaces/IFormError";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import getValidationError from "../../util/getValidationError";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { Grid, TextField } from "@mui/material";

interface ICustomFieldDocumentTypeProps {
  title: string;
}

const CustomFieldDocumentType: React.FC<ICustomFieldDocumentTypeProps> = ({
  title,
}) => {
  window.document.title = title;

  const {
    deleteCustomFieldDocumentType,
    listCustomFieldDocumentTypeById,
    updateCustomFieldDocumentType,
    createCustomFieldDocumentType,
  } = useCustomFieldDocumentTypeService();

  const [customFieldDocumentTypeId, setCustomFieldDocumentTypeId] =
    useState("");

  const [id, setId] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListCustomFieldDocumentType = useCallback(async () => {
    const id = location.pathname
      .replace("/custom-field-document-type", "")
      .replace("/", "");

    setCustomFieldDocumentTypeId(id);

    if (id) {
      setLoading(true);

      await listCustomFieldDocumentTypeById(Number(id))
        .then((response) => {
          const customFieldDocumentType: ICustomFieldDocumentType = response;

          setId(
            customFieldDocumentType.id ? String(customFieldDocumentType.id) : ""
          );
          setDescription(customFieldDocumentType.description);
        })
        .catch((error) => {
          if (error.status === 401) {
            signOut();
            navigate("/");
          }

          toastr.error(error?.message || "Contate a equipe de suporte");

          navigate("/custom-field-document-types");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate, signOut, toastr, location.pathname]);

  const handleDeleteCustomFieldDocumentType = useCallback(async () => {
    setLoading(true);
    await deleteCustomFieldDocumentType(Number(customFieldDocumentTypeId))
      .then(async () => {
        toastr.success(
          "Tipo de documento dos campos customizados deletado com sucesso"
        );

        navigate("/custom-field-document-types");
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [customFieldDocumentTypeId, toastr, navigate]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: ICustomFieldDocumentType = {
        description,
      };

      const schema = Yup.object().shape({
        description: Yup.string().required("Descrição obrigatória"),
      });

      if (customFieldDocumentTypeId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updateCustomFieldDocumentType(
          Number(customFieldDocumentTypeId),
          data
        )
          .then(async () => {
            await handleListCustomFieldDocumentType();

            navigate("/custom-field-document-types");
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

        await createCustomFieldDocumentType(data)
          .then(async () => {
            await handleListCustomFieldDocumentType();

            toastr.success(
              "Tipo de documento dos campos customizados criado com sucesso"
            );

            navigate("/custom-field-document-types");
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
    customFieldDocumentTypeId,
    description,
    navigate,
    signOut,
    handleListCustomFieldDocumentType,
  ]);

  useEffect(() => {
    handleListCustomFieldDocumentType();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Tipo de documento dos campos customizados</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="id"
                value={id}
                disabled
              />
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
                autoFocus
                required
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            {customFieldDocumentTypeId && (
              <ButtonTheme
                onClick={handleDeleteCustomFieldDocumentType}
                disabled={loading}
                color="error"
              >
                Excluir
              </ButtonTheme>
            )}

            <ButtonTheme
              onClick={() => navigate("/custom-field-document-types")}
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

export default CustomFieldDocumentType;
