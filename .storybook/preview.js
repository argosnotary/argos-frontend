import React from 'react';
import { addDecorator } from '@storybook/react';
import styled, { ThemeProvider } from "styled-components";

import theme from "../src/theme/base.json";
import GlobalStyle from "../src/globalStyle";

addDecorator(storyFn => <ThemeProvider theme={theme}><GlobalStyle />{storyFn()}</ThemeProvider>);

