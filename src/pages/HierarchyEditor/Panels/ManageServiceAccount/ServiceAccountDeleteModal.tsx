import {
  HierarchyEditorActionTypes,
  HierarchyEditorStateContext
} from "../../../../stores/hierarchyEditorStore";
import DataRequest from "../../../../types/DataRequest";
import { removeObjectFromTree } from "../../utils";
import WarningModal from "../../../../molecules/WarningModal";
import React, { useContext } from "react";
import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import { Modal, ModalFlexColumWrapper } from "../../../../atoms/Modal";
import { useUserProfileContext } from "../../../../stores/UserProfile";

const ServiceAccountDeleteModal = () => {
  const [
    _serviceAccountGetRequestState,
    setServiceAccountDeleteRequest
  ] = useDataApi(genericDataFetchReducer);
  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );
  const { token } = useUserProfileContext();
  const getDeleteWarningContent = () => {
    const cancelHandler = () => {
      hierarchyEditorDispatch.editor({
        type: HierarchyEditorActionTypes.RESET
      });
    };

    const continueHandler = () => {
      const dataRequest: DataRequest = {
        method: "delete",
        token,
        url: `/api/serviceaccount/${hierarchyEditorState.editor.node.referenceId}`,
        cbSuccess: () => {
          removeObjectFromTree(hierarchyEditorState, hierarchyEditorDispatch);
          hierarchyEditorDispatch.editor({
            type: HierarchyEditorActionTypes.RESET
          });
        }
      };
      setServiceAccountDeleteRequest(dataRequest);
    };

    return (
      <WarningModal
        message="This service account will be deleted are you sure ?"
        continueHandler={continueHandler}
        cancelHandler={cancelHandler}
      />
    );
  };
  return (
    <Modal>
      <ModalFlexColumWrapper>{getDeleteWarningContent()}</ModalFlexColumWrapper>
    </Modal>
  );
};
export default ServiceAccountDeleteModal;
