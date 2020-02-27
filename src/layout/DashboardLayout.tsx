/*
 * Copyright (C) 2019 - 2020 Rabobank Nederland
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
import React, { ReactNode } from "react";
import styled from "styled-components";

import ConnectionError from "../atoms/ConnectionError";
import DashboardNavbar from "../organisms/DashboardNavbar";

import { useRequestErrorStore } from "../stores/requestErrorStore";

interface IDashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayoutContainer = styled.div`
  background-color: #e0e0e0;
`;

const DashboardLayout: React.FC = ({ children }) => {
  const [requestError, _setRequestError] = useRequestErrorStore();

  return (
    <DashboardLayoutContainer>
      <DashboardNavbar />
      <ConnectionError error={requestError} />
      {children}
    </DashboardLayoutContainer>
  );
};

export default DashboardLayout;
