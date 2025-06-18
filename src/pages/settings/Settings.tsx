import React, { useState } from "react";

import { SettingsContainer } from "./Settings.styles";
import { Grid, Tab, Tabs } from "@mui/material";
import HeadOffices from "../headOffices/HeadOffices";
import Users from "../users/Users";
import ConfigureApplications from "../configureApplications/ConfigureApplications";
import { TitleContainer } from "../../components/titleContainer/TitleContainer";
import CustomFields from "../customFields/CustomFields";

interface ISettingsProps {
  title: string;
}

const Settings: React.FC<ISettingsProps> = ({ title, ...rest }) => {
  window.document.title = title;

  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <SettingsContainer>
      <TitleContainer>
        <h1>Configurações</h1>
      </TitleContainer>
      <Tabs value={value} onChange={handleTabChange}>
        <Tab label="Empresas" />
        <Tab label="Usuários" />
        <Tab label="Aplicações" />
        <Tab label="Customização" />
      </Tabs>
      <Grid container spacing={3}>
        {value === 0 && (
          <Grid item xs={12} md={12}>
            <HeadOffices title="Sicredi Dexis | Empresas" />
          </Grid>
        )}
        {value === 1 && (
          <Grid item xs={12} md={12}>
            <Users title="Sicredi Dexis | Usuários" />
          </Grid>
        )}
        {value === 2 && (
          <Grid item xs={12} md={12}>
            <ConfigureApplications title="Sicredi Dexis | Configuração de Aplicações" />
          </Grid>
        )}
        {value === 3 && (
          <Grid item xs={12} md={12}>
            <CustomFields title="Sicredi Dexis | Campos customizados" />
          </Grid>
        )}
      </Grid>
    </SettingsContainer>
  );
};

export default Settings;
