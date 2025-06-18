import { useCallback, useEffect, useRef, useState } from "react";
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { useNavigate } from "react-router-dom";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import CustomTableSortLabel from "../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import CustomTablePagination from "../../components/table/CustomTablePagination/CustomTablePagination";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { useToastr } from "../../hooks/useToastr";
import IProduct from "../../interfaces/IProduct";
import { useProductService } from "../../services/useProductService";
import { CustomMenuItem } from "../../components/table/CustomMenuItem/CustomMenuItem";
import { CustomTableCell } from "../../components/table/CustomTableCell/CustomTableCell";
import useFormatIntegerDecimalValues from "../../util/useFormatIntegerDecimalValues";
import { CustomNoContentTableBody } from "../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { GridFilterArea } from "../../components/table/GridFilterArea/GridFilterArea";
import { FilterButtonGroup } from "../../components/table/FilterButtonGroup/FilterButtonGroup";
import { useAuth } from "../../hooks/auth";
import { ButtonOutlined } from "../../components/buttonOutlined/ButtonOutlined";

const fields = [
  { field: "code", label: "Código" },
  { field: "description", label: "Nome" },
];

const STORAGE_KEY = "@PORTAL-COMPRAS:productsFilters";

const getInitialState = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed[key] !== undefined ? parsed[key] : defaultValue;
  }
  return defaultValue;
};

interface IProductsProps {
  title: string;
}

interface IParams {
  perPage: number;
  currentPage: number;
  orderField: string;
  orderDirection: "asc" | "desc";
  field?: string;
  value?: string;
  precision?: string;
  delay?: number;
}

const Products: React.FC<IProductsProps> = ({ title }) => {
  window.document.title = title;
  const { formatIntegerDecimalValues } = useFormatIntegerDecimalValues();
  const { listAllProducts, generateProductReport } = useProductService();
  const toastr = useToastr();
  const timeout = useRef<any>(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(() => getInitialState("perPage", 10));
  const [currentPage, setCurrentPage] = useState(() =>
    getInitialState("currentPage", 0)
  );
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">(() =>
    getInitialState("orderDirection", "asc")
  );
  const [orderField, setOrderField] = useState<string>(() =>
    getInitialState("orderField", "description")
  );
  const [loading, setLoading] = useState(false);

  const [gridFilterAreaOpen, setGridFilterAreaOpen] = useState(() =>
    getInitialState("gridFilterAreaOpen", false)
  );
  const [filterField, setFilterField] = useState<string>(() =>
    getInitialState("filterField", "")
  );
  const [filterPrecision, setFilterPrecision] = useState<string>(() =>
    getInitialState("filterPrecision", "equal")
  );
  const [filterValue, setFilterValue] = useState<string>(() =>
    getInitialState("filterValue", "")
  );
  const [delay, setDelay] = useState(0);

  const { signOut } = useAuth();

  const handlePagination = async (
    perPage: number,
    currentPage: number,
    orderField: string,
    orderDirection: "asc" | "desc"
  ) => {
    handleListAll({
      perPage,
      currentPage,
      orderField,
      orderDirection,
      field: filterField,
      value: filterValue,
      precision: filterPrecision,
      delay: 0,
    });
  };

  const handleToProductReport = useCallback(
    async (productId: string | null) => {
      if (productId) {
        setLoading(true);

        await generateProductReport(productId)
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
              link.download = `${productId}.pdf`;
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

    [signOut, navigate]
  );

  const handleListAll = async ({
    perPage,
    currentPage,
    orderField,
    orderDirection,
    field,
    value,
    precision,
    delay,
  }: IParams) => {
    let url = `perPage=${perPage}&currentPage=${
      currentPage + 1
    }&orderBy=${orderField}&orderDirection=${orderDirection}`;

    if (field && value && precision) {
      url =
        url +
        `&filterField=${field}&filterValue=${value}&precision=${precision}`;
    }

    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoading(true);
      await listAllProducts(url)
        .then((response) => {
          if (response?.data?.length > 0) {
            setProducts(response.data);
            setTotalRows(response.totalRows);
            setLoading(false);
          } else {
            setProducts([]);
            setTotalRows(0);
            setPerPage(10);
            setCurrentPage(0);
            setLoading(false);
          }
        })
        .catch((error) => {
          toastr.error(error?.message || "Contate a equipe de suporte");
        })
        .finally(() => {
          setLoading(false);
        });
    }, delay || 0);
  };

  useEffect(() => {
    handlePagination(perPage, 0, orderField, "asc");
  }, [orderField]);

  useEffect(() => {
    const field = filterField;
    const value = filterValue;
    const precision = filterPrecision;

    handleListAll({
      perPage,
      currentPage,
      orderField,
      orderDirection,
      field,
      value,
      precision,
      delay,
    });
  }, [filterField, filterPrecision, filterValue, delay]);

  useEffect(() => {
    const filters = {
      filterField,
      filterPrecision,
      filterValue,
      gridFilterAreaOpen,
      currentPage,
      perPage,
      orderField,
      orderDirection,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [
    filterField,
    filterPrecision,
    filterValue,
    gridFilterAreaOpen,
    currentPage,
    perPage,
    orderField,
    orderDirection,
  ]);

  const handleTextFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setTotalRows(0);
    setCurrentPage(0);
    setDelay(500);
  };

  const handleClearFilters = () => {
    setFilterField("");
    setFilterPrecision("equal");
    setFilterValue("");
    setCurrentPage(0);
    setPerPage(10);
    setOrderField("description");
    setOrderDirection("asc");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      <TitleContainer>
        <h1>Produtos</h1>
      </TitleContainer>
      <PageCard>
        <FilterButtonGroup>
          <Tooltip title="Filtros" placement="top">
            <IconButton
              onClick={() => setGridFilterAreaOpen(!gridFilterAreaOpen)}
              size="small"
              color="primary"
              style={{ alignItems: "flex-end" }}
            >
              {gridFilterAreaOpen ? (
                <FilterAltOffOutlinedIcon />
              ) : (
                <FilterAltOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </FilterButtonGroup>

        {gridFilterAreaOpen && (
          <GridFilterArea container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="select-filter">Filtrar por</InputLabel>
                <Select
                  label="Filtrar Por"
                  value={`${filterField}`}
                  onChange={(e) => {
                    setFilterField(`${e.target.value}`);
                  }}
                >
                  {fields.map((filter) => {
                    return (
                      <MenuItem key={filter.field} value={filter.field}>
                        {filter.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Precisão</InputLabel>
                <Select
                  label="Precisão"
                  value={`${filterPrecision}`}
                  onChange={(e) => {
                    setFilterPrecision(`${e.target.value}`);
                  }}
                >
                  <MenuItem key={"equal"} value={"equal"}>
                    Igual
                  </MenuItem>
                  <MenuItem key={"containing"} value={"containing"}>
                    Contendo
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                label="Valor a filtrar"
                placeholder="Valor a filtrar"
                value={filterValue}
                onChange={handleTextFilterChange}
                size="small"
              />
            </Grid>

            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <ButtonOutlined
                style={{ margin: "0px" }}
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </ButtonOutlined>
            </Grid>
          </GridFilterArea>
        )}

        <TableContainer
          sx={{
            minHeight: "250px",
          }}
        >
          <Table
            sx={{
              padding: "16px",
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    borderBottom: 1,
                    borderColor: "#E5E5E5",
                  },
                }}
              >
                <TableCell size="small" width={60}>
                  Ações
                </TableCell>

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="code"
                  label="Cód."
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="description"
                  label="Descrição"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="stockQuantity"
                  label="Estoque Disponível"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="averagePrice"
                  label="Preço Médio"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="category_code"
                  label="Cod. Categoria"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="category_description"
                  label="Descrição. Categoria"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 &&
                products.map((product) => {
                  return (
                    <TableRow
                      key={product.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <CustomMenuItem
                        id={product.id ? product.id : ""}
                        handleToPrintOut={handleToProductReport}
                        requestNumber={product.code}
                      />

                      <CustomTableCell
                        size="small"
                        title={product.code}
                        width={100}
                      >
                        {product.code}
                      </CustomTableCell>
                      <CustomTableCell
                        size="small"
                        title={product.description}
                        width={200}
                      >
                        {product.description}
                      </CustomTableCell>
                      <CustomTableCell size="small" width={100}>
                        {formatIntegerDecimalValues(
                          product.stockQuantity,
                          "ALL"
                        )}
                      </CustomTableCell>
                      <CustomTableCell size="small" width={100}>
                        {formatIntegerDecimalValues(
                          product.averagePrice,
                          "DECIMAL"
                        )}
                      </CustomTableCell>

                      <CustomTableCell
                        size="small"
                        title={product.category.code}
                        width={100}
                      >
                        {product.category.code}
                      </CustomTableCell>
                      <CustomTableCell
                        size="small"
                        title={product.category.description}
                        width={200}
                      >
                        {product.category.description}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {products.length === 0 && (
            <CustomNoContentTableBody>
              <p>Nenhum produto encontrado</p>
            </CustomNoContentTableBody>
          )}
        </TableContainer>
        <CustomTablePagination
          totalRows={totalRows}
          currentPage={currentPage}
          perPage={perPage}
          handleRequest={handlePagination}
          setPerPage={setPerPage}
          setCurrentPage={setCurrentPage}
          orderField={orderField}
          orderDirection={orderDirection}
        />

        {loading && <BackdropCustom />}
      </PageCard>
    </>
  );
};

export default Products;
