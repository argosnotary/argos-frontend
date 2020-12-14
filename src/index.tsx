/*
 * Copyright (C) 2020 Argos Notary
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// polyfills
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "element-closest-polyfill";
import "custom-event-polyfill";
import "webcrypto-liner";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import theme from "./theme/base.json";
import GlobalStyle from "./globalStyle";

import App from "./App";

import configureStore from "./redux/configureStore";

const { store, persistor } = configureStore();

ReactDOM.render(
    <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Router>
                <ThemeProvider theme={theme}>
                    <GlobalStyle />
                    <App />
                </ThemeProvider>
            </Router>
        </PersistGate>
    </ReduxProvider>,
    document.getElementById("root")
);
