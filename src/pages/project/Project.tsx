import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import moment from "moment";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import IProject from "../../interfaces/IProject";
import { useAuth } from "../../hooks/auth";
import { Form } from "../../components/form/Form";
import { ButtonGroup } from "../../components/buttonGroup/ButtonGroup";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import { ButtonTheme } from "../../components/buttonTheme/ButtonTheme";
import { useProjectService } from "../../services/useProjectServices";
import IFormError from "../../interfaces/IFormError";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import getValidationError from "../../util/getValidationError";
import { useCostCenterService } from "../../services/useCostCentersServices";
import AsyncSearch from "../../components/asyncSearch/AsyncSearch";
import ICostCenter from "../../interfaces/ICostCenter";
import IProjectSituation from "../../interfaces/IProjectSituation";
import IProjectValue from "../../interfaces/IProjectValue";
import { CustomMenuItem } from "../../components/table/CustomMenuItem/CustomMenuItem";
import { CustomTableCell } from "../../components/table/CustomTableCell/CustomTableCell";
import { CustomNoContentTableBody } from "../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import useFormatIntegerDecimalValues from "../../util/useFormatIntegerDecimalValues";
import { useProjectSituationsService } from "../../services/useProjectSituationsServices";

interface IProjectProps {
  title: string;
}

interface IOption {
  description: string;
  value: string;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator={"."}
        decimalScale={2}
        decimalSeparator=","
        valueIsNumericString
      />
    );
  }
);

const Project: React.FC<IProjectProps> = ({ title }) => {
  window.document.title = title;

  const navigate = useNavigate();
  const location = useLocation();
  const toastr = useToastr();
  const { signOut, state } = useAuth();
  const timeout = useRef<any>(0);
  const { formatIntegerDecimalValues } = useFormatIntegerDecimalValues();

  const { listProjectById, createProject, updateProject } = useProjectService();
  const { listCostCentersDynamically } = useCostCenterService();
  const { listAllProjectSituations } = useProjectSituationsService();

  const [projectId] = useState(() => {
    return location.pathname.replace("/project", "").replace("/", "") || null;
  });

  const [project, setProject] = useState<IProject | null>(null);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [yearSequential, setYearSequential] = useState("");
  const [details, setDetails] = useState("");
  const [estimatedStartDate, setEstimatedStartDate] = useState<Date>(
    moment().toDate()
  );
  const [estimatedEndDate, setEstimatedEndDate] = useState<Date>(
    moment().add(1, "years").toDate()
  );
  const [complementValue, setComplementValue] = useState("");
  const [complementDescription, setComplementDescription] = useState("");
  const [endDate, setEndDate] = useState<string>("");

  // Cost Center
  const [loadingCostCenters, setLoadingCostCenters] = useState<boolean>(false);
  const [costCenterOptions, setCostCenterOptions] = useState<IOption[]>([]);
  const [costCenterOption, setCostCenterOption] = useState<IOption | null>(
    () => {
      if (state.costCenter) {
        return {
          value: `${state.costCenter.id}`,
          description: `${state.costCenter.code} ${state.costCenter.description}`,
        };
      }
      return null;
    }
  );
  const [situation, setSituation] = useState<IProjectSituation | null>(null);
  const [showValues, setShowValues] = useState(true);
  const [projectValues, setProjectValues] = useState<IProjectValue[]>([]);

  const [loadingProjectSituations, setLoadingProjectSituations] =
    useState<boolean>(false);
  const [projectSituationsOpions, setProjectSituationsOptions] = useState<
    IOption[]
  >([]);
  const [projectSituationOption, setProjectSituationOption] =
    useState<IOption | null>(null);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFormError>({});

  const costCenterToOption = (costCenter: ICostCenter): IOption => {
    return {
      value: `${costCenter.id}`,
      description: `${costCenter.code} ${costCenter.description}`,
    };
  };

  const projectSituationToOption = (
    projectSituation: IProjectSituation
  ): IOption => {
    return {
      value: `${projectSituation.id}`,
      description: `${projectSituation.id} - ${projectSituation.name}`,
    };
  };

  const listProjectSituations = async () => {
    setLoadingProjectSituations(true);

    await listAllProjectSituations()
      .then((result) => {
        if (result) {
          const options: IOption[] = result.map(projectSituationToOption);

          setProjectSituationsOptions(options);
        } else {
          setProjectSituationsOptions([]);
        }
      })
      .catch((error) => {
        setProjectSituationsOptions([]);
        toastr.error(error.message);
      })
      .finally(() => {
        setLoadingProjectSituations(false);
      });
  };

  const listCostCenters = async (filter = "") => {
    clearInterval(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoadingCostCenters(true);
      const url = `perPage=100&currentPage=1&orderBy=description&orderDirection=asc&filter=${filter}`;

      await listCostCentersDynamically(url)
        .then((result) => {
          if (result) {
            const options: IOption[] = result.data.map(costCenterToOption);

            setCostCenterOptions(options);
          } else {
            setCostCenterOptions([]);
          }
        })
        .catch((error) => {
          setCostCenterOptions([]);
          toastr.error(error.message);
        })
        .finally(() => {
          setLoadingCostCenters(false);
        });
    }, timeout.current);
  };

  const handleListProject = useCallback(async () => {
    const projectId = location.pathname
      .replace("/project", "")
      .replace("/", "");

    if (projectId) {
      setLoading(true);

      await listProjectById(projectId)
        .then((response) => {
          const project: IProject = response;

          setProject(project);

          setCode(project.code ? project.code : "");
          setDescription(project.description);
          setYearSequential(
            project.yearSequential ? String(project.yearSequential) : ""
          );
          setValue(
            project.value
              ? `R$ ${formatIntegerDecimalValues(project.value, "DECIMAL")}`
              : "R$ 0,00"
          );
          setDetails(project.details || "");
          setEstimatedStartDate(new Date(project.estimatedStartDate));
          setEstimatedEndDate(new Date(project.estimatedEndDate));
          setComplementValue(
            project.complementValue ? String(project.complementValue) : ""
          );
          setComplementDescription(project.complementDescription || "");

          if (project.costCenterId) {
            setCostCenterOption({
              value: project.costCenterId,
              description: project.costCenter
                ? `${project.costCenter.code} ${project.costCenter.description}`
                : "",
            });
          }

          if (project.situationId) {
            setProjectSituationOption({
              value: project.situationId,
              description: project.situation
                ? `${project.situation.id} -  ${project.situation.name}`
                : "",
            });
          }

          if (project.situation) {
            setSituation(project.situation);
          }

          if (project.projectValues) {
            setProjectValues(project.projectValues);
          }

          if (project.endDate) {
            setEndDate(moment(project.endDate).format("DD/MM/YYYY") || "");
          }
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
  }, [navigate, signOut, toastr, location.pathname, listProjectById]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setFormErrors({});

    try {
      const data: IProject = {
        description,
        details,
        costCenterId: costCenterOption?.value || "",
        estimatedStartDate: estimatedStartDate,
        estimatedEndDate: estimatedEndDate,
        complementValue: complementValue
          ? parseFloat(complementValue.replace(".", "").replace(",", "."))
          : undefined,
        complementDescription,
        situationId: projectSituationOption?.value || "P",
      };

      const schema = Yup.object().shape({
        description: Yup.string().required("Nome é obrigatório"),
        details: Yup.string().required("Detalhes obrigatórios").nullable(),
        costCenterId: Yup.string().required("Centro de custo obrigatório"),
        estimatedStartDate: Yup.date().required(
          "Data de início estimada obrigatória"
        ),
        estimatedEndDate: Yup.date().required(
          "Data de término estimada obrigatória"
        ),
      });

      if (projectId) {
        await schema.validate(data, {
          abortEarly: false,
        });

        await updateProject(projectId, data)
          .then(async () => {
            await handleListProject();
            toastr.success("Projeto atualizado com sucesso");
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

        await createProject(data)
          .then(async (project) => {
            toastr.success("Projeto criado com sucesso");
            navigate(`/project/${project.id}`);
            window.location.reload();
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
    projectId,
    description,
    value,
    details,
    costCenterOption,
    estimatedStartDate,
    estimatedEndDate,
    complementValue,
    complementDescription,
    projectSituationOption,
    navigate,
    signOut,
    handleListProject,
    toastr,
    updateProject,
    createProject,
  ]);

  const handleSetCostCenter = (option: IOption | null) => {
    if (option) {
      const selected = costCenterOptions.find((costCenterOption) => {
        return costCenterOption.value === option.value;
      });

      if (selected?.value) {
        setCostCenterOption(selected);
      } else {
        setCostCenterOption(null);
      }
    }
  };

  const handleSetProjectSituation = (value: string | null) => {
    if (value) {
      const selected = projectSituationsOpions.find((projectSituation) => {
        return projectSituation.value === value;
      });

      if (selected?.value) {
        setProjectSituationOption(selected);
      } else {
        setProjectSituationOption(null);
      }
    }
  };

  useEffect(() => {
    listProjectSituations();
    handleListProject();
    listCostCenters();
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Projeto</h1>
      </TitleContainer>
      <PageCard>
        <Form>
          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Sequencial Anual"
                value={yearSequential}
                onChange={(e) => setYearSequential(e.target.value)}
                disabled
              />
            </Grid>

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
                label="Valor Aprovado"
                sx={{ width: "100%" }}
                value={value}
                size="small"
                variant="outlined"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl fullWidth size="small" disabled>
                <InputLabel id="select-filter">Situação do Projeto</InputLabel>
                <Select
                  label="Situação do Projeto"
                  value={projectSituationOption?.value || ""}
                  onChange={(e) =>
                    handleSetProjectSituation(String(e.target.value))
                  }
                  disabled
                >
                  {projectSituationsOpions.map((situation) => {
                    return (
                      <MenuItem
                        key={situation.description}
                        value={situation.value}
                        disabled={situation.value === "P"}
                      >
                        {situation.description}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                label="Status Integração ERP"
                sx={{ width: "100%" }}
                value={
                  project?.statusIntegrationErp === "SUCCESS"
                    ? "Sucesso"
                    : project?.statusIntegrationErp === "ERROR"
                    ? "Erro"
                    : "Pendente"
                }
                name="value"
                size="small"
                variant="outlined"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                label="Data de Encerramento"
                sx={{ width: "100%" }}
                value={endDate}
                size="small"
                variant="outlined"
                disabled
              />
            </Grid>
          </Grid>

          <Divider sx={{ marginBottom: "24px" }} />

          <Grid container spacing={3} sx={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Nome"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                required
                disabled={!!projectId && code !== "0"}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.costCenterId}
                sx={{ width: "100%" }}
                disabled={!!projectId && code !== "0"}
              >
                <AsyncSearch
                  options={costCenterOptions}
                  setOptions={setCostCenterOptions}
                  option={costCenterOption}
                  setOption={handleSetCostCenter}
                  asyncSearch={listCostCenters}
                  loading={loadingCostCenters}
                  error={Boolean(formErrors?.costCenterId)}
                  errorMessage={formErrors?.costCenterId || null}
                  label="Centro de custo"
                  required={true}
                  disabled={!!projectId && code !== "0"}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Detalhamento"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                multiline
                rows={4}
                required
                error={!!formErrors.details}
                helperText={formErrors.details}
                disabled={!!projectId && code !== "0"}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                type="date"
                sx={{ width: "100%" }}
                size="small"
                label="Data de Início Estimada"
                value={estimatedStartDate.toISOString().split("T")[0]}
                onChange={(e) =>
                  setEstimatedStartDate(new Date(e.target.value))
                }
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.estimatedStartDate}
                helperText={formErrors.estimatedStartDate}
                required
                disabled={!!projectId && code !== "0"}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <TextField
                type="date"
                sx={{ width: "100%" }}
                size="small"
                label="Data de Término Estimada"
                value={estimatedEndDate.toISOString().split("T")[0]}
                onChange={(e) => setEstimatedEndDate(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.estimatedEndDate}
                helperText={formErrors.estimatedEndDate}
                required
                disabled={!!projectId && code !== "0"}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <FormControl
                size="small"
                error={!!formErrors.complementValue}
                sx={{ width: "100%" }}
              >
                <TextField
                  label="Valor Solicitado/Complemento"
                  value={complementValue}
                  onChange={(event) => setComplementValue(event.target.value)}
                  name="complementValue"
                  size="small"
                  InputProps={{
                    inputComponent: NumericFormatCustom as any,
                  }}
                  variant="outlined"
                  error={!!formErrors.complementValue}
                  disabled={
                    !!projectId && code !== "0" && situation?.id === "F"
                  }
                  autoFocus={
                    !!projectId && code !== "0" && situation?.id !== "F"
                  }
                />
                <FormHelperText>{formErrors.complementValue}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <TextField
                sx={{ width: "100%" }}
                size="small"
                label="Descrição Solicitado/Complemento"
                value={complementDescription}
                onChange={(e) => setComplementDescription(e.target.value)}
                disabled={!!projectId && code !== "0" && situation?.id === "F"}
                error={!!formErrors.complementDescription}
                helperText={formErrors.complementDescription}
              />
            </Grid>
          </Grid>
          <ButtonGroup justformobilie>
            <ButtonTheme
              onClick={() => navigate("/projects")}
              variant="contained"
              color="inherit"
              disabled={loading}
            >
              Cancelar
            </ButtonTheme>

            {situation?.id !== "F" && (
              <ButtonTheme onClick={() => handleSubmit()} disabled={loading}>
                Confirmar
              </ButtonTheme>
            )}
          </ButtonGroup>
        </Form>

        {loading && <BackdropCustom />}
      </PageCard>

      {projectId && (
        <Paper sx={{ margin: "16px" }} elevation={6}>
          <Accordion elevation={0} expanded={showValues}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{ marginLeft: "2px" }}
              onClick={() => {
                setShowValues(!showValues);
              }}
            >
              Valores do projeto
            </AccordionSummary>
            <AccordionDetails sx={{ marginBottom: "24px" }}>
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

                      <TableCell>Valor</TableCell>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Situação</TableCell>
                      <TableCell>Usuário</TableCell>
                      <TableCell>Solicitado em</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectValues.length > 0 &&
                      projectValues.map((projectValue) => {
                        return (
                          <TableRow
                            key={projectValue.id}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <CustomMenuItem
                              id={projectValue.id ? projectValue.id : ""}
                              disableButton={true}
                            />

                            <CustomTableCell size="small" width={100}>
                              {formatIntegerDecimalValues(
                                projectValue.value || 0,
                                "DECIMAL"
                              )}
                            </CustomTableCell>
                            <CustomTableCell
                              size="small"
                              width={400}
                              title={projectValue.description}
                            >
                              {projectValue.description}
                            </CustomTableCell>
                            <CustomTableCell size="small" width={200}>
                              {projectValue.status.description}
                            </CustomTableCell>
                            <CustomTableCell size="small" width={200}>
                              {projectValue.user.username}
                            </CustomTableCell>
                            <CustomTableCell size="small" width={200}>
                              {moment(projectValue.created_at).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </CustomTableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>

                {projectValues.length === 0 && (
                  <CustomNoContentTableBody>
                    <p>Nenhum valor de projeto encontrado</p>
                  </CustomNoContentTableBody>
                )}
              </TableContainer>

              {(loading || loadingProjectSituations) && <BackdropCustom />}
            </AccordionDetails>
          </Accordion>
        </Paper>
      )}
    </>
  );
};

export default Project;
