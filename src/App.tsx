import { useMemo, useState } from "react";
import * as locales from "@mui/material/locale";
import { HashRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Content from "./components/content/Content";
import { AppProvider } from "./hooks/AppProvider";
import AppMenu from "./components/appMenu/AppMenu";
import AppContainer from "./components/appContainer/AppContainer";
import AppFooter from "./components/appFooter/AppFooter";

type SupportedLocales = keyof typeof locales;

function App() {
  const [locale] = useState<SupportedLocales>("ptBR");

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: '"Exo 2", sans-serif',
          fontSize: 14,
        },
        palette: {
          primary: {
            light: "#3fa110",
            main: "#3fa110",
            dark: "#33820d",
            contrastText: "#fff",
          },
        },
      }),
    []
  );

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme]
  );

  return (
    <HashRouter>
      <ThemeProvider theme={themeWithLocale}>
        <AppProvider>
          <AppContainer>
            <AppMenu />
            <Content />
            <AppFooter />
          </AppContainer>
        </AppProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
