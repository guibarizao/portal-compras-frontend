import React, { useEffect, useState } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

import {
  DashboardCard,
  DashboardContainer,
  DashboardContent,
  ImageContainer,
} from "./Dashboard.styles";
import dayjs from "dayjs";
import { useAuth } from "../../hooks/auth";
import { useDashboardsService } from "../../services/useDashboardsService";
import IDashboardReport from "../../interfaces/IDashboardReport";
import { BackdropCustom } from "../../components/backdrop/Backdrop";
import logoSecundary from "../../assets/logo_secundaria.png";

interface IMonth {
  value: number;
  text: string;
}

interface IDashboardProps {
  title: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = -12;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 190,
    },
  },
};

const Dashboard: React.FC<IDashboardProps> = ({ title, ...rest }) => {
  window.document.title = title;

  const { state: userState } = useAuth();
  const { dashboardReports } = useDashboardsService();

  const [months] = useState<IMonth[]>(() => {
    return [
      { value: 0, text: "Ano Todo" },
      { value: 1, text: "Janeiro" },
      { value: 2, text: "Fevereiro" },
      { value: 3, text: "Março" },
      { value: 4, text: "Abril" },
      { value: 5, text: "Maio" },
      { value: 6, text: "Junho" },
      { value: 7, text: "Julho" },
      { value: 8, text: "Agosto" },
      { value: 9, text: "Setembro" },
      { value: 10, text: "Outubro" },
      { value: 11, text: "Novembro" },
      { value: 12, text: "Dezembro" },
    ];
  });
  const [years] = useState<Number[]>(() => {
    const arrayYears = [];
    for (let i = 2022; i <= 2050; i++) {
      arrayYears.push(i);
    }
    return arrayYears;
  });

  const [monthSelected, setMonthSelected] = useState(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth.toString();
  });
  const [yearSelected, setYearSelected] = useState(() => {
    const currentYear = new Date().getUTCFullYear();
    return currentYear.toString();
  });
  const [reports, setReports] = useState<IDashboardReport>({
    purchaseRequest: 0,
    stockRequest: 0,
    purchaseRequestPending: 0,
    stockRequestPending: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChangeMonth = async (event: SelectChangeEvent) => {
    setMonthSelected(String(event.target.value));
    await handleLoadinData({
      year: yearSelected,
      month: String(event.target.value),
    });
  };

  const handleChangeYear = async (event: SelectChangeEvent) => {
    setYearSelected(String(event.target.value));
    await handleLoadinData({
      year: String(event.target.value),
      month: monthSelected,
    });
  };

  const handleLoadinData = async ({
    year,
    month,
  }: {
    year: string;
    month: string;
  }) => {
    try {
      setLoading(true);

      let initialDate = `${year}-${
        Number(month) < 10 ? `0${month}` : month
      }-01`;
      let finalDate = dayjs(initialDate)
        .endOf("month")
        .add(1, "days")
        .format("YYYY-MM-DD");

      if (month === "0") {
        initialDate = `${year}-01-01`;
        finalDate = `${year}-12-31`;
      }

      if (!userState.resources.includes("administrador-portal-compras")) {
        const email = userState.email;

        await dashboardReports(initialDate, finalDate, email).then(
          (response: any) => {
            setReports(response);
          }
        );
      } else {
        await dashboardReports(initialDate, finalDate).then((response: any) => {
          setReports(response);
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadinData({
      year: yearSelected,
      month: monthSelected,
    });
  }, []);

  return (
    <DashboardContainer>
      <DashboardContent>
        {loading && <BackdropCustom />}
        <DashboardCard>
          <span>Competência</span>

          <div>
            <Select
              labelId="select-month-id"
              id="select-month-id"
              onChange={handleChangeMonth}
              value={monthSelected}
              sx={{ width: "242px", height: "30px" }}
              MenuProps={MenuProps}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.text}
                </MenuItem>
              ))}
            </Select>

            <Select
              labelId="select-year-id"
              id="select-year-id"
              onChange={handleChangeYear}
              value={yearSelected}
              sx={{ width: "242px", height: "30px", marginTop: "10px" }}
              MenuProps={MenuProps}
            >
              {years.map((y) => (
                <MenuItem key={String(y)} value={String(y)}>{`${y}`}</MenuItem>
              ))}
            </Select>
          </div>
        </DashboardCard>

        <DashboardCard>
          <span>Requisições de Estoque</span>

          <h1>{reports?.stockRequest}</h1>
        </DashboardCard>

        <DashboardCard>
          <span>Solicitações de Compra</span>

          <h1>{reports?.purchaseRequest}</h1>
        </DashboardCard>

        <DashboardCard>
          <span>Pendentes de Integração</span>

          <h1>
            {reports?.purchaseRequestPending + reports?.stockRequestPending}
          </h1>
        </DashboardCard>
      </DashboardContent>

      <ImageContainer>
        <img src={logoSecundary} alt="" />
      </ImageContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
