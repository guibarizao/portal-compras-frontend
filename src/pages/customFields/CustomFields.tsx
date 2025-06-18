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
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import ICustomField from "../../interfaces/ICustomField";
import { useCustomFieldService } from "../../services/useCustomFieldService";
import CustomTableSortLabel from "../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import CustomTablePagination from "../../components/table/CustomTablePagination/CustomTablePagination";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { useToastr } from "../../hooks/useToastr";
import { CustomMenuItem } from "../../components/table/CustomMenuItem/CustomMenuItem";
import { CustomTableCell } from "../../components/table/CustomTableCell/CustomTableCell";
import { CustomNoContentTableBody } from "../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { GridFilterArea } from "../../components/table/GridFilterArea/GridFilterArea";
import { FilterButtonGroup } from "../../components/table/FilterButtonGroup/FilterButtonGroup";

const fields = [
  {
    field: "id",
    label: "ID",
  },
  {
    field: "description",
    label: "Descrição",
  },
  {
    field: "descriptionType",
    label: "Tipo",
  },
  {
    field: "descriptionDocumentType",
    label: "Tipo do documento",
  },
];

interface ICustomFieldsProps {
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

const CustomFields: React.FC<ICustomFieldsProps> = ({ title }) => {
  window.document.title = title;

  const { listAllCustomFields } = useCustomFieldService();
  const toastr = useToastr();
  const timeout = useRef<any>(null);
  const [customFields, setCustomFields] = useState<ICustomField[]>([]);

  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderField, setOrderField] = useState<string>("id");
  const [loading, setLoading] = useState(false);

  const [gridFilterAreaOpen, setGridFilterAreaOpen] = useState(false);
  const [filterField, setFilterField] = useState<string>("");
  const [filterPrecision, setFilterPrecision] = useState<string>("equal");
  const [filterValue, setFilterValue] = useState<string>("");
  const [delay, setDelay] = useState(0);

  const navigate = useNavigate();

  const handleToCustomFields = useCallback(
    (id: string | null) => {
      !!id ? navigate(`/custom-field/${id}`) : navigate("/custom-field");
    },
    [navigate]
  );

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
      await listAllCustomFields(url)
        .then((response) => {
          if (response?.data?.length > 0) {
            setCustomFields(response.data);
            setTotalRows(response.totalRows);
            setLoading(false);
          } else {
            setCustomFields([]);
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

  const handleTextFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setTotalRows(0);
    setCurrentPage(0);
    setDelay(500);
  };

  return (
    <>
      <TitleContainer>
        <h1>Campos customizados</h1>
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
          <Tooltip title="Adicionar tipo" placement="top">
            <IconButton
              onClick={() => handleToCustomFields(null)}
              size="small"
              color="primary"
              style={{ alignItems: "flex-end" }}
            >
              <AddIcon />
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
                  field="descriptionType"
                  label="Tipo"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="descriptionDocumentoType"
                  label="Tipo de documento"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="isRequire"
                  label="Obrigatório"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />

                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="isActive"
                  label="Ativo"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {customFields.length > 0 &&
                customFields.map((customField) => {
                  return (
                    <TableRow
                      key={customField.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <CustomMenuItem
                        id={customField.id ? String(customField.id) : ""}
                        handleToEdit={handleToCustomFields}
                      />

                      <CustomTableCell size="small" width={200}>
                        {customField.description}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={150}>
                        {customField.type ? customField?.type.description : ""}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={150}>
                        {customField.documentType
                          ? customField?.documentType.description
                          : ""}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={150}>
                        {customField.isRequired ? "Sim" : "Não"}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={150}>
                        {customField.isActive ? "Sim" : "Não"}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {customFields.length === 0 && (
            <CustomNoContentTableBody>
              <p>Nenhum campo customizado encontrado</p>
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

export default CustomFields;
