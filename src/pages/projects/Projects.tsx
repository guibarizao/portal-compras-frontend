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

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import CustomTableSortLabel from "../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import CustomTablePagination from "../../components/table/CustomTablePagination/CustomTablePagination";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { useToastr } from "../../hooks/useToastr";
import { CustomMenuItem } from "../../components/table/CustomMenuItem/CustomMenuItem";
import { useNavigate } from "react-router-dom";
import { useProjectService } from "../../services/useProjectServices";
import IProject from "../../interfaces/IProject";
import { CustomTableCell } from "../../components/table/CustomTableCell/CustomTableCell";
import useFormatIntegerDecimalValues from "../../util/useFormatIntegerDecimalValues";
import { CustomNoContentTableBody } from "../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { GridFilterArea } from "../../components/table/GridFilterArea/GridFilterArea";
import { FilterButtonGroup } from "../../components/table/FilterButtonGroup/FilterButtonGroup";
import { useAuth } from "../../hooks/auth";
import moment from "moment";

const fields = [
  {
    field: "code",
    label: "Código",
  },
  {
    field: "description",
    label: "Nome",
  },
  {
    field: "value",
    label: "Valor",
  },
];

interface IProjectsProps {
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

const Projects: React.FC<IProjectsProps> = ({ title }) => {
  window.document.title = title;
  const { formatIntegerDecimalValues } = useFormatIntegerDecimalValues();

  const { listAllProjects, generateProjectReport } = useProjectService();
  const toastr = useToastr();
  const timeout = useRef<any>(null);
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderField, setOrderField] = useState<string>("yearSequential");
  const [loading, setLoading] = useState(false);

  const [gridFilterAreaOpen, setGridFilterAreaOpen] = useState(false);
  const [filterField, setFilterField] = useState<string>("");
  const [filterPrecision, setFilterPrecision] = useState<string>("equal");
  const [filterValue, setFilterValue] = useState<string>("");
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

  const handleToProject = useCallback(
    (id: string | null) => {
      !!id ? navigate(`/project/${id}`) : navigate("/project");
    },
    [navigate]
  );

  const handleToProjectReport = useCallback(
    async (projectId: string | null) => {
      if (projectId) {
        setLoading(true);

        await generateProjectReport(projectId)
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
              link.download = `${projectId}.pdf`;
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
      await listAllProjects(url)
        .then((response) => {
          if (response?.data?.length > 0) {
            setProjects(response.data);
            setTotalRows(response.totalRows);
            setLoading(false);
          } else {
            setProjects([]);
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
        <h1>Projetos</h1>
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
          <Tooltip title="Criar projeto" placement="top">
            <IconButton
              onClick={() => handleToProject(null)}
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
                  field="yearSequential"
                  label="Seq."
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
                  label="Nome"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="projectValue"
                  label="Valor aprovado"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="situation"
                  label="Situação"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="costCenter"
                  label="Centro de custo"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="user"
                  label="Usuário"
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
                <CustomTableSortLabel
                  perPage={perPage}
                  currentPage={currentPage}
                  orderField={orderField}
                  field="endDate"
                  label="Data de Encerramento"
                  handleRequest={handlePagination}
                  orderDirection={orderDirection}
                  setField={setOrderField}
                  setDirection={setOrderDirection}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length > 0 &&
                projects.map((project) => {
                  return (
                    <TableRow
                      key={project.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <CustomMenuItem
                        id={project.id ? project.id : ""}
                        handleToPrintOut={handleToProjectReport}
                        requestNumber={project.code}
                        handleToEdit={() => handleToProject(project.id || null)}
                      />

                      <CustomTableCell size="small" width={150}>
                        {project.code}
                      </CustomTableCell>

                      <CustomTableCell size="small" width={150}>
                        {project.yearSequential || ""}
                      </CustomTableCell>
                      <CustomTableCell
                        size="small"
                        title={project.description}
                        width={400}
                      >
                        {project.description}
                      </CustomTableCell>
                      <CustomTableCell size="small" width={200}>
                        R${" "}
                        {formatIntegerDecimalValues(
                          project?.value || 0,
                          "DECIMAL"
                        )}
                      </CustomTableCell>
                      <CustomTableCell size="small" width={200}>
                        {project?.situation?.name || ""}
                      </CustomTableCell>
                      <CustomTableCell size="small" width={200}>
                        {project?.costCenter?.description || ""}
                      </CustomTableCell>
                      <CustomTableCell size="small" width={200}>
                        {project?.user?.username || ""}
                      </CustomTableCell>
                      <CustomTableCell size="small">
                        {project?.isActive ? "Sim" : "Não"}
                      </CustomTableCell>
                      <CustomTableCell size="small" width={200}>
                        {project?.endDate
                          ? moment(project?.endDate).format("DD/MM/YYYY")
                          : ""}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {projects.length === 0 && (
            <CustomNoContentTableBody>
              <p>Nenhum projeto encontrado</p>
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

export default Projects;
