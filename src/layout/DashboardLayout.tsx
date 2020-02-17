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
