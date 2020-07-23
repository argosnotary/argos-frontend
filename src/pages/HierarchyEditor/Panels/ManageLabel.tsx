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
import React, { useContext, useEffect } from "react";

import DataRequest from "../../../types/DataRequest";
import ILabelPostResponse from "../../../interfaces/ILabelPostResponse";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import { IGenericFormSchema } from "../../../interfaces/IGenericFormSchema";
import { Panel } from "../../../molecules/Panel";
import {
  HierarchyEditorStateContext,
  HierarchyEditorPanelModes,
  HierarchyEditorActionTypes
} from "../../../stores/hierarchyEditorStore";
import ITreeNode from "../../../interfaces/ITreeNode";
import {
  updateTreeObject,
  addObjectToTree,
  removeObjectFromTree
} from "../utils";
import PanelBreadCrumb from "../../../molecules/PanelBreadCrumb";
import { Modal, ModalFlexColumWrapper } from "../../../atoms/Modal";
import WarningModal from "../../../molecules/WarningModal";
import useFormBuilder, {
  IFormBuilderConfig,
  FormSubmitButtonHandlerTypes
} from "../../../hooks/useFormBuilder";

interface ILabelNameFormValues {
  labelname: string;
}

const formSchema: IGenericFormSchema = [
  {
    labelValue: "Label name*",
    name: "labelname",
    formType: "text"
  }
];

const validate = (values: ILabelNameFormValues) => {
  const errors = {} as any;

  if (!values.labelname) {
    errors.labelname = "Please fill in a label name.";
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/.test(values.labelname)) {
    errors.labelname =
      "Invalid label name (only lowercase alphanumeric characters and underscore allowed).";
  }

  return errors;
};

const ManageLabel = () => {
  const [treeChildrenApiResponse, setTreeChildrenApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [labelPostState, setLabelPostRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );

  const updateMode =
    hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.UPDATE;

  const formConfig: IFormBuilderConfig = {
    schema: formSchema,
    permission: hierarchyEditorState.editor.permission,
    isLoading: labelPostState.isLoading || treeChildrenApiResponse.isLoading,
    validate,
    onCancel: () => {
      hierarchyEditorDispatch.editor({
        type: HierarchyEditorActionTypes.RESET
      });
    },
    onSubmit: values => {
      if (!updateMode) {
        postNewLabel(values);
      }

      if (updateMode) {
        updateLabel(values);
      }
    },
    confirmationLabel: !updateMode ? "Add label" : "Update label",
    cancellationLabel: "Cancel",
    autoFocus: !updateMode,
    buttonHandler: FormSubmitButtonHandlerTypes.CLICK
  };

  const [formJSX, formApi] = useFormBuilder(formConfig);

  const postNewLabel = (values: ILabelNameFormValues) => {
    const data: any = {};

    data.name = values.labelname;

    if (hierarchyEditorState.editor.node.referenceId !== "") {
      data.parentLabelId = hierarchyEditorState.editor.node.referenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      url: "/api/label",
      cbSuccess: (label: ILabelPostResponse) => {
        const hierarchyDataRequest: DataRequest = {
          params: {
            HierarchyMode: "NONE"
          },
          method: "get",
          url: `/api/hierarchy/${label.id}`,
          cbSuccess: (node: ITreeNode) => {
            addObjectToTree(
              hierarchyEditorState,
              hierarchyEditorDispatch,
              node
            );
          }
        };
        setTreeChildrenApiRequest(hierarchyDataRequest);
      }
    };

    setLabelPostRequest(dataRequest);
  };

  const updateLabel = (values: ILabelNameFormValues) => {
    const data: any = {};

    data.name = values.labelname;

    if (hierarchyEditorState.editor.node.referenceId !== "") {
      data.labelId = hierarchyEditorState.editor.node.referenceId;
    }

    if (hierarchyEditorState.editor.node.parentId !== "") {
      data.parentLabelId = hierarchyEditorState.editor.node.parentId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      url: `/api/label/${hierarchyEditorState.editor.node.referenceId}`,
      cbSuccess: (label: ILabelPostResponse) => {
        const hierarchyDataRequest: DataRequest = {
          params: {
            HierarchyMode: "ALL"
          },
          method: "get",
          url: `/api/hierarchy/${label.id}`,
          cbSuccess: (node: ITreeNode) => {
            updateTreeObject(
              hierarchyEditorState,
              hierarchyEditorDispatch,
              node
            );
          }
        };
        setTreeChildrenApiRequest(hierarchyDataRequest);
      }
    };

    setLabelPostRequest(dataRequest);
  };

  useEffect(() => {
    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.UPDATE) {
      formApi.setInitialFormValues({
        labelname: hierarchyEditorState.editor.node.name
      });
    }

    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.CREATE) {
      formApi.setInitialFormValues({ labelname: "" });
    }
  }, [hierarchyEditorState.editor.node, hierarchyEditorState.editor.mode]);

  const labelForm = () => {
    return (
      <Panel
        maxWidth={"37.5vw"}
        resizable={false}
        last={true}
        title={
          updateMode
            ? "Update selected label"
            : "Add child label to selected label"
        }>
        <PanelBreadCrumb
          node={hierarchyEditorState.editor.node}
          breadcrumb={hierarchyEditorState.editor.breadcrumb}
        />
        {formJSX}
      </Panel>
    );
  };

  const deleteWarning = () => {
    const cancelHandler = () => {
      hierarchyEditorDispatch.editor({
        type: HierarchyEditorActionTypes.RESET
      });
    };
    const continueHandler = () => {
      const dataRequest: DataRequest = {
        method: "delete",
        url: `/api/label/${hierarchyEditorState.editor.node.referenceId}`,
        cbSuccess: () => {
          removeObjectFromTree(hierarchyEditorState, hierarchyEditorDispatch);
          hierarchyEditorDispatch.editor({
            type: HierarchyEditorActionTypes.RESET
          });
        }
      };
      setLabelPostRequest(dataRequest);
    };

    return (
      <Modal>
        <ModalFlexColumWrapper>
          <WarningModal
            message={
              hierarchyEditorState.editor.node.name +
              " label will be deleted are you sure ?"
            }
            continueHandler={continueHandler}
            cancelHandler={cancelHandler}
          />
        </ModalFlexColumWrapper>
      </Modal>
    );
  };

  if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.DELETE) {
    return deleteWarning();
  } else {
    return labelForm();
  }
};

export default ManageLabel;
