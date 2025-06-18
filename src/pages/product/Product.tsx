import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, TextField } from "@mui/material";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import IProduct from "../../interfaces/IProduct";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { useProductService } from "../../services/useProductService";

interface IProductProps {
  title: string;
}

const Product: React.FC<IProductProps> = ({ title }) => {
  window.document.title = title;

  const { listProductById } = useProductService();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut } = useAuth();

  const handleListProduct = useCallback(async () => {
    const productId = location.pathname
      .replace("/product", "")
      .replace("/", "");

    if (productId) {
      setLoading(true);

      await listProductById(productId)
        .then((response) => {
          const product: IProduct = response;

          setCode(product.code ? product.code : "");
          setDescription(product.description);
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
    handleListProduct();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Produto</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
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
              onClick={() => navigate("/products")}
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

export default Product;
