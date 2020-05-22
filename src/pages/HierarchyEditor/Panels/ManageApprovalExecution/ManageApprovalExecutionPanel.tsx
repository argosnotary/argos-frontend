import { Panel } from "../../../../molecules/Panel";
import React, { useContext, useEffect } from "react";
import { useUserProfileContext } from "../../../../stores/UserProfile";
import DataRequest from "../../../../types/DataRequest";
import { StateContext } from "../../../../stores/hierarchyEditorStore";
import useDataApi from "../../../../hooks/useDataApi";
import { customGenericDataFetchReducer } from "../../../../stores/genericDataFetchReducer";
import AlternateLoader from "../../../../atoms/Icons/AlternateLoader";
import { ThemeContext } from "styled-components";
import { IApprovalConfig } from "../../../../interfaces/IApprovalConfig";
import {
  ApprovalExecutionStoreContext,
  createApprovalExecutionStoreContext
} from "../../../../stores/ApprovalExecutionStore";
import ApprovalExecutionDetailsPanel from "./ApprovalExecutionDetailsPanel";

interface IApprovalStepsResponse {
  isLoading: boolean;
  data: Array<IApprovalConfig>;
}

const ManageApprovalExecutionPanel: React.FC = () => {
  const theme = useContext(ThemeContext);
  const { token } = useUserProfileContext();
  const [state, _dispatch] = useContext(StateContext);
  const [approvalStepsResponse, setApprovalSteps] = useDataApi<
    IApprovalStepsResponse,
    Array<IApprovalConfig>
  >(customGenericDataFetchReducer);
  const approvalExecutionStoreContext = createApprovalExecutionStoreContext();
  const renderApprovalStepList = (
    approvalStepsResponse: IApprovalStepsResponse
  ) => {
    if (!approvalStepsResponse.data) {
      return null;
    }
    return (
      <ul>
        {approvalStepsResponse?.data.map(approvalStep => (
          <li>
            {approvalStep.segmentName} {approvalStep.stepName}
          </li>
        ))}
      </ul>
    );
  };
  useEffect(() => {
    const dataRequest: DataRequest = {
      method: "get",
      token,
      url: `/api/supplychain/${state.nodeReferenceId}/layout/approvalconfig/me`
    };
    setApprovalSteps(dataRequest);
  }, [state.nodeReferenceId]);

  return (
    <>
      <ApprovalExecutionStoreContext.Provider
        value={approvalExecutionStoreContext}>
        <Panel
          width={"37.5vw"}
          resizable={true}
          title={"Select step to approve"}>
          {approvalStepsResponse.isLoading ? (
            <AlternateLoader size={32} color={theme.alternateLoader.color} />
          ) : null}
          {renderApprovalStepList(approvalStepsResponse)}
        </Panel>
        <ApprovalExecutionDetailsPanel />
      </ApprovalExecutionStoreContext.Provider>
    </>
  );
};
export default ManageApprovalExecutionPanel;
