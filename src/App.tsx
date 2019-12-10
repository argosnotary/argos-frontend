import React from "react";
import styled, { ThemeProvider } from "styled-components";

import GlobalStyle from "./globalStyle";
import Routes from "./routes";
import theme from "./theme/base.json";

const AppContainer = styled.main``;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Routes />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
