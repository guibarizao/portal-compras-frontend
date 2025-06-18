import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";

import { useToastr } from "../../../hooks/useToastr";
import { CustomMenuItem } from "../../../components/table/CustomMenuItem/CustomMenuItem";
import CustomTableSortLabel from "../../../components/table/CustomTableSortLabel/CustomTableSortLabel";
import { BackdropCustom } from "../../../components/backdrop/Backdrop";
import { CustomTableCell } from "../../../components/table/CustomTableCell/CustomTableCell";
import { useSuppliersBankDetailsService } from "../../../services/useSuppliersBankDetailsService";
import ISuppliersBankDetails from "../../../interfaces/ISuppliersBankDetails";
import { useNavigate } from "react-router-dom";
import { CustomNoContentTableBody } from "../../../components/table/CustomNoContentTableBody/CustomNoContentTableBody";
import { FilterButtonGroup } from "../../../components/table/FilterButtonGroup/FilterButtonGroup";

interface ISuppliersBankDetailsProps {
  title: string;
  supplierId: string;
  handleSave: () => Promise<void>;
  disableActions: boolean;
}

const SuppliersBankDetailsList: React.FC<ISuppliersBankDetailsProps> = ({
  supplierId,
  title,
  handleSave,
  disableActions,
}) => {
  const toastr = useToastr();
  const navigate = useNavigate();
  const { listSuppliersBankDetailsBySupplierId, deleteSuppliersBankDetails } =
    useSuppliersBankDetailsService();

  const [perPage] = useState(10);
  const [currentPage] = useState(0);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderField, setOrderField] = useState<string>("date");

  const [suppliersBankDetails, setSuppliersBankDetails] = useState<
    ISuppliersBankDetails[]
  >([]);

  const [loading, setLoading] = useState(false);

  const handleToSupplierBankDetails = useCallback(
    (id: string | null) => {
      !!id
        ? navigate(`/suppliers-bank-details/${id}?supplierId=${supplierId}`)
        : navigate(`/suppliers-bank-details?supplierId=${supplierId}`);
    },
    [navigate]
  );

  const handleListAll = async () => {
    setLoading(true);
    await listSuppliersBankDetailsBySupplierId(supplierId)
      .then((response) => {
        setSuppliersBankDetails(response);
      })
      .catch((error) => {
        toastr.error(error?.message || "Contate a equipe de suporte");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteSuppliersBankDetails = useCallback(
    async (id: string | null) => {
      if (id) {
        setLoading(true);
        await deleteSuppliersBankDetails(id)
          .then(async () => {
            toastr.success("Dados bancários deletados com sucesso");

            handleListAll();
          })
          .catch((error) => {
            toastr.error(error?.message || "Contate a equipe de suporte");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [supplierId, toastr, navigate]
  );

  useEffect(() => {
    handleListAll();
  }, []);

  return (
    <Paper sx={{ margin: "16px" }} elevation={6}>
      <Accordion elevation={0} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ marginLeft: "2px" }}
        >
          {title}
        </AccordionSummary>
        <AccordionDetails>
          <FilterButtonGroup>
            <div></div>
            <Tooltip title="Adicionar contas" placement="top">
              <IconButton
                onClick={async () => {
                  await handleSave();
                  handleToSupplierBankDetails(null);
                }}
                size="small"
                color="primary"
                style={{ alignItems: "flex-end" }}
                disabled={disableActions}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </FilterButtonGroup>

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
                    perPage={10}
                    currentPage={1}
                    orderField={orderField}
                    field="bankCode"
                    label="Banco"
                    handleRequest={handleListAll}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="accountType"
                    label="Tipo da conta"
                    handleRequest={handleListAll}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="agency"
                    label="Agência"
                    handleRequest={handleListAll}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                  <CustomTableSortLabel
                    perPage={perPage}
                    currentPage={currentPage}
                    orderField={orderField}
                    field="accountNumber"
                    label="Nº Conta"
                    handleRequest={handleListAll}
                    orderDirection={orderDirection}
                    setField={setOrderField}
                    setDirection={setOrderDirection}
                    disableOrder
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliersBankDetails?.length > 0 &&
                  suppliersBankDetails.map((suppliersBankDetail) => {
                    return (
                      <TableRow
                        key={suppliersBankDetail.id}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <CustomMenuItem
                          id={
                            suppliersBankDetail.id ? suppliersBankDetail.id : ""
                          }
                          disableButton={disableActions}
                          handleToEdit={() =>
                            handleToSupplierBankDetails(
                              suppliersBankDetail.id
                                ? suppliersBankDetail.id
                                : null
                            )
                          }
                          handleToDelete={() =>
                            handleDeleteSuppliersBankDetails(
                              suppliersBankDetail.id
                                ? suppliersBankDetail.id
                                : null
                            )
                          }
                        />

                        <CustomTableCell size="small" width={200}>
                          {suppliersBankDetail.bankCode}
                        </CustomTableCell>

                        <CustomTableCell size="small" width={200}>
                          {suppliersBankDetail.accountType === "CURRENT"
                            ? "Corrente"
                            : "Poupança"}
                        </CustomTableCell>

                        <CustomTableCell size="small" width={200}>
                          {suppliersBankDetail.agency}
                        </CustomTableCell>
                        <CustomTableCell size="small" width={100}>
                          {suppliersBankDetail.accountNumber}
                        </CustomTableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {suppliersBankDetails?.length === 0 && (
              <CustomNoContentTableBody>
                <p>Nenhuma conta encontrada</p>
              </CustomNoContentTableBody>
            )}
          </TableContainer>

          {loading && <BackdropCustom />}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default SuppliersBankDetailsList;
