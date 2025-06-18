import { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import dayjs from "dayjs";
import EventIcon from "@mui/icons-material/Event";

import { PageCard } from "../../components/pageCard/PageCard";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import { useToastr } from "../../hooks/useToastr";
import { useAuth } from "../../hooks/auth";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import styled from "styled-components";
import { IApprovalOption, IApprovalTask } from "../../interfaces/IApprovalTask";
import { ApprovalDetailsDialog } from "./approvalDetailsDialog/ApprovalDetailsDialog";
import { useApprovalsService } from "../../services/useApprovalsService";
import CustomTablePagination from "../../components/table/CustomTablePagination/CustomTablePagination";

const STORAGE_KEY = "@PORTAL-COMPRAS:approvals";

const getInitialState = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed[key] !== undefined ? parsed[key] : defaultValue;
  }
  return defaultValue;
};
interface IApprovalsProps {
  title: string;
}

export const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 24px;
  box-sizing: border-box;
  gap: 16px;
`;

export const ItemActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 4px;
  margin-top: 18px;
`;

const ItemHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  gap: 8px;
  & > h1 {
    font-size: 1.25rem;
    font-weight: 500;
    color: #333;
  }
  & > p {
    font-size: 0.875rem;
    color: #666;
  }
`;

const Approvals: React.FC<IApprovalsProps> = ({ title }) => {
  window.document.title = title;

  const toastr = useToastr();
  const { signOut, state: userState } = useAuth();
  const { getPendingTasks, listTasks, updateAnsweredTasks } =
    useApprovalsService();

  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(() =>
    getInitialState("perPage", 9999) > 0
      ? getInitialState("perPage", 9999)
      : 9999
  );
  const [currentPage, setCurrentPage] = useState(0);

  const [orderField] = useState<string>(() =>
    getInitialState("orderField", "creationDate")
  );
  const [orderDirection] = useState<"asc" | "desc">(() =>
    getInitialState("orderDirection", "desc")
  );

  const [loading, setLoading] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<IApprovalTask[] | []>([]);
  const [tasksTabs, setTasksTabs] = useState<string[]>([]);
  const [subjectSelected, setSubjectSelected] = useState<string>("");
  const [
    dialogApprovalTaskDetailsDetailsOpen,
    setDialogApprovalTaskDetailsDetailsOpen,
  ] = useState(false);
  const [approvalTask, setApprovalTask] = useState<IApprovalTask | null>(null);

  const handleOpenDialogApprovalTaskDetailsDetails = useCallback(
    (task: IApprovalTask) => {
      setApprovalTask(task);
      setDialogApprovalTaskDetailsDetailsOpen(true);
    },
    []
  );

  const handleCloseDialogApprovalTaskDetailsDetails = useCallback(() => {
    setDialogApprovalTaskDetailsDetailsOpen(false);
    setApprovalTask(null);
    handleListPendingTasks(perPage, currentPage);
  }, [perPage, currentPage]);

  const handleListPendingTasks = useCallback(
    async (perPage: number, currentPage: number) => {
      setLoading(true);

      await getPendingTasks(userState.access_token)
        .then(async () => {
          await listTasks(userState.access_token, {
            offset: currentPage,
            limit: perPage || 9999,
            sortField: orderField,
            sortDirection: orderDirection.toUpperCase() as "ASC" | "DESC",
          }).then((response) => {
            setPendingTasks(response.tasks);
            setTotalRows(response.total);

            let tasksTabsNames: string[] = [];
            response.tasks.forEach((task: IApprovalTask) => {
              if (!tasksTabsNames.some((t) => t === task.subject)) {
                tasksTabsNames.push(task.subject);
              }
            });

            setTasksTabs(tasksTabsNames);
          });
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            toastr.error("Sessão expirada. Por favor, faça login novamente.");
            signOut();
          } else {
            toastr.error("Erro ao carregar tarefas pendentes.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [orderField, orderDirection, tasksTabs, toastr, signOut]
  );

  const handlePagination = async (perPage: number, currentPage: number) => {
    handleListPendingTasks(perPage, currentPage);
  };

  const handleChangeSubject = (_: React.SyntheticEvent, newValue: string) => {
    setSubjectSelected(newValue);
  };

  const handleSubmit = useCallback(
    async (option: IApprovalOption) => {
      setLoading(true);
      try {
        await updateAnsweredTasks({
          accessToken: userState.access_token,
          taskId: option.taskId,
          answerDate: dayjs().toISOString(),
          takenOptionId: option.id,
          note: "",
        })
          .then(() => {
            toastr.success("Resposta enviada com sucesso");
            handleListPendingTasks(perPage, currentPage);
          })
          .catch((error) => {
            if (error.status === 401) {
              toastr.error("Sessão expirada, por favor faça login novamente");
              signOut();
              return;
            }
            toastr.error(error?.message || "Contate a equipe de suporte");
          });
      } catch (error) {
        toastr.error("Erro ao aprovar a tarefa.");
      } finally {
        setLoading(false);
      }
    },
    [
      toastr,
      userState.access_token,
      handleListPendingTasks,
      perPage,
      currentPage,
      signOut,
    ]
  );

  const TabPanel = useCallback(
    (subject: string) => {
      const showTasks = pendingTasks.filter(
        (task: IApprovalTask) => task.subject === subject
      );
      return (
        <Box
          sx={{
            display: subjectSelected === subject ? "block" : "none",
            padding: 2,
          }}
          key={subject}
        >
          <Grid container spacing={3}>
            {showTasks.map((task: IApprovalTask) => (
              <Grid item lg={4} md={6} xs={12} sm={12} key={task.id}>
                <ItemContent>
                  <ItemHeader>
                    <Typography variant="h6" color="textPrimary" fontSize={16}>
                      {task.box}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <EventIcon
                        sx={{ marginRight: "4px", color: "#3fa110" }}
                      />
                      {dayjs(task.creationDate).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </ItemHeader>

                  <Typography variant="body1" color="textPrimary">
                    {task.description}
                  </Typography>

                  <Typography variant="body1" color="textPrimary">
                    {task.senderName}
                  </Typography>

                  <ItemActions>
                    <Button
                      sx={{ marginLeft: "8px", textTransform: "none" }}
                      variant="outlined"
                      color="inherit"
                      onClick={() =>
                        handleOpenDialogApprovalTaskDetailsDetails(task)
                      }
                    >
                      Detalhes
                    </Button>
                    {task.options &&
                      task.options.length > 0 &&
                      task.options
                        .sort((option) => {
                          if (option.code === "Aprov") return 1;
                          if (option.code === "Repro") return -1;
                          return 0;
                        })
                        .map((option) => (
                          <Button
                            key={option.id}
                            sx={{ marginLeft: "8px", textTransform: "none" }}
                            variant="outlined"
                            color={
                              option.code === "Aprov" ? "primary" : "error"
                            }
                            onClick={() => handleSubmit(option)}
                          >
                            {option.description}
                          </Button>
                        ))}
                  </ItemActions>
                </ItemContent>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    },
    [subjectSelected, pendingTasks]
  );

  useEffect(() => {
    if (tasksTabs.length > 0) {
      setSubjectSelected(
        tasksTabs.some((t) => t === subjectSelected)
          ? subjectSelected
          : tasksTabs[0]
      );
    }
  }, [tasksTabs]);

  const saveFiltersToSessionStorage = useCallback(() => {
    const filters = {
      perPage,
      orderField,
      orderDirection,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [currentPage, perPage, orderField, orderDirection]);

  useEffect(() => {
    saveFiltersToSessionStorage();
  }, [currentPage, perPage]);

  useEffect(() => {
    handleListPendingTasks(perPage, currentPage);
  }, []);

  return (
    <>
      <TitleContainer>
        <h1>Aprovacões</h1>
      </TitleContainer>
      <PageCard>
        {tasksTabs.length > 0 ? (
          <>
            <Box sx={{ flexGrow: 1, bgcolor: "background.paper" }}>
              <Tabs
                value={subjectSelected}
                onChange={handleChangeSubject}
                variant="scrollable"
                scrollButtons
                aria-label="visible arrows tabs example"
              >
                {tasksTabs.map((tab, index) => (
                  <Tab key={index} label={tab} value={tab} />
                ))}
              </Tabs>
            </Box>
            {tasksTabs.map((tab, index) => TabPanel(tab))}
          </>
        ) : (
          <Grid container spacing={3} mt={10} mb={14}>
            <Grid item xs={12} md={12} sm={12}>
              <Typography variant="h6" align="center">
                Nenhuma tarefa pendente encontrada.
              </Typography>
            </Grid>
          </Grid>
        )}

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

      {approvalTask && (
        <ApprovalDetailsDialog
          dialogOpen={dialogApprovalTaskDetailsDetailsOpen}
          handleOpenDialog={handleOpenDialogApprovalTaskDetailsDetails}
          handleCloseDialog={handleCloseDialogApprovalTaskDetailsDetails}
          approvalTask={approvalTask}
        />
      )}
    </>
  );
};

export default Approvals;
