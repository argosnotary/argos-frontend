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

const ServiceAccountDeleteModal = () => {
  const [
    _serviceAccountGetRequestState,
    setServiceAccountDeleteRequest
  ] = useDataApi(genericDataFetchReducer);
  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );
  const getDeleteWarningContent = () => {
    const cancelHandler = () => {
      hierarchyEditorDispatch.editor({
        type: HierarchyEditorActionTypes.RESET
      });
    };

    const continueHandler = () => {
      const dataRequest: DataRequest = {
        method: "delete",
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
