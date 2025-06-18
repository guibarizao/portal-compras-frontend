import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, TextField } from "@mui/material";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import ICategory from "../../interfaces/ICategory";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { useCategoryService } from "../../services/useCategoryService";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";

interface ICategoryProps {
  title: string;
}

const Category: React.FC<ICategoryProps> = ({ title }) => {
  window.document.title = title;

  const { listCategoryById } = useCategoryService();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListCategory = useCallback(async () => {
    const categoryId = location.pathname
      .replace("/category", "")
      .replace("/", "");

    if (categoryId) {
      setLoading(true);

      await listCategoryById(categoryId)
        .then((response) => {
          const category: ICategory = response;

          setCode(category.code ? category.code : "");
          setDescription(category.description);
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

  useEffect(() => {
    handleListCategory();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Categoria</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Código ERP"
                value={code}
                required
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
                autoFocus
                required
                disabled
              />
            </Grid>
          </Grid>

          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/categories")}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Voltar
            </ButtonTheme>
          </ButtonGroup>
        </Form>

        {loading && <BackdropCustom />}
      </PageCard>
    </>
  );
};

export default Category;
