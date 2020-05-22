import { Panel } from "../../../molecules/Panel";
import React, { useContext, useEffect } from "react";
import { useUserProfileContext } from "../../../stores/UserProfile";
import DataRequest from "../../../types/DataRequest";
import { StateContext } from "../../../stores/hierarchyEditorStore";
import useDataApi from "../../../hooks/useDataApi";
import { customGenericDataFetchReducer } from "../../../stores/genericDataFetchReducer";
import AlternateLoader from "../../../atoms/Icons/AlternateLoader";
import { ThemeContext } from "styled-components";

interface IApprovalStep {
  stepName: string;
  segmentName: string;
}

interface IApprovalStepsResponse {
  isLoading: boolean;
  data: Array<IApprovalStep>;
}

const ApproveStepPanel: React.FC = () => {
  const theme = useContext(ThemeContext);
  const { token } = useUserProfileContext();
  const [state, _dispatch] = useContext(StateContext);
  const [approvalStepsResponse, setApprovalSteps] = useDataApi<
    IApprovalStepsResponse,
    Array<IApprovalStep>
  >(customGenericDataFetchReducer);

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
    <Panel
      maxWidth={"37.5vw"}
      resizable={false}
      last={true}
      title="select approval to execute">
      {approvalStepsResponse.isLoading ? (
        <AlternateLoader size={32} color={theme.alternateLoader.color} />
      ) : null}
      {renderApprovalStepList(approvalStepsResponse)}
    </Panel>
  );
};
export default ApproveStepPanel;
