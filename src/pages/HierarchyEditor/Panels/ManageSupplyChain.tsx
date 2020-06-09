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
import React, { useContext, useEffect, useState } from "react";

import DataRequest from "../../../types/DataRequest";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import ISupplyChainApiResponse from "../../../interfaces/ISupplyChainApiResponse";
import GenericForm, {
  IGenericFormSchema
} from "../../../organisms/GenericForm";
import { Panel } from "../../../molecules/Panel";
import { useUserProfileContext } from "../../../stores/UserProfile";
import {
  HierarchyEditorStateContext,
  HierarchyEditorActionTypes,
  HierarchyEditorPanelModes
} from "../../../stores/hierarchyEditorStore";
import ITreeNode from "../../../interfaces/ITreeNode";
import { addObjectToTree, updateTreeObject } from "../utils";
import PanelBreadCrumb from "../../../molecules/PanelBreadCrumb";

interface ISupplyChainNameFormValues {
  supplychainname: string;
}

const formSchema: IGenericFormSchema = [
  {
    labelValue: "Supply chain name*",
    name: "supplychainname",
    formType: "text"
  }
];

const validate = (values: ISupplyChainNameFormValues) => {
  const errors = {} as ISupplyChainNameFormValues;

  if (!values.supplychainname) {
    errors.supplychainname = "Please fill in a supply chain name.";
  } else if (!/^([a-z]{1}[a-z0-9-]*)?$/.test(values.supplychainname)) {
    errors.supplychainname =
      "Invalid supply chain name (only lowercase alphanumeric characters and hyphen is allowed).";
  }

  return errors;
};

const ManageSupplyChain = () => {
  const { token } = useUserProfileContext();
  const [supplyChainApiResponseState, setSupplyChainApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [treeChildrenApiResponse, setTreeChildrenApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );

  const [initialFormValues, setInitialFormValues] = useState(
    {} as ISupplyChainNameFormValues
  );

  const postSupplyChain = (values: ISupplyChainNameFormValues) => {
    const data: any = {};

    data.name = values.supplychainname;

    if (hierarchyEditorState.editor.node.referenceId !== "") {
      data.parentLabelId = hierarchyEditorState.editor.node.referenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      token,
      url: "/api/supplychain",
      cbSuccess: (supplyChain: ISupplyChainApiResponse) => {
        const hierarchyDataRequest: DataRequest = {
          params: {
            HierarchyMode: "NONE"
          },
          method: "get",
          token,
          url: `/api/hierarchy/${supplyChain.id}`,
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

    setSupplyChainApiRequest(dataRequest);
  };

  const updateSupplyChain = (values: ISupplyChainNameFormValues) => {
    const data: any = {};

    data.name = values.supplychainname;

    if (hierarchyEditorState.editor.node.referenceId !== "") {
      data.labelId = hierarchyEditorState.editor.node.referenceId;
    }

    if (hierarchyEditorState.editor.node.parentId !== "") {
      data.parentLabelId = hierarchyEditorState.editor.node.parentId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      token,
      url: `/api/supplychain/${hierarchyEditorState.editor.node.referenceId}`,
      cbSuccess: (supplyChain: ISupplyChainApiResponse) => {
        const hierarchyDataRequest: DataRequest = {
          params: {
            HierarchyMode: "ALL"
          },
          method: "get",
          token,
          url: `/api/hierarchy/${supplyChain.id}`,
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

    setSupplyChainApiRequest(dataRequest);
  };

  useEffect(() => {
    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.UPDATE) {
      setInitialFormValues({
        supplychainname: hierarchyEditorState.editor.node.name
      });
    }

    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.CREATE) {
      setInitialFormValues({ supplychainname: "" });
    }
  }, [hierarchyEditorState.editor.node, hierarchyEditorState.editor.mode]);

  const updateMode =
    hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.UPDATE;

  return (
    <Panel
      maxWidth={"37.5vw"}
      resizable={false}
      last={true}
      title={
        updateMode
          ? "Update selected supply chain"
          : "Add child supply chain to selected label"
      }>
      <PanelBreadCrumb
        node={hierarchyEditorState.editor.node}
        breadcrumb={hierarchyEditorState.editor.breadcrumb}
      />
      <GenericForm
        schema={formSchema}
        permission={hierarchyEditorState.editor.permission}
        isLoading={
          supplyChainApiResponseState.isLoading ||
          treeChildrenApiResponse.isLoading
        }
        validate={validate}
        onCancel={() => {
          hierarchyEditorDispatch.editor({
            type: HierarchyEditorActionTypes.RESET
          });
        }}
        onSubmit={values => {
          if (!updateMode) {
            postSupplyChain(values);
          }

          if (updateMode) {
            updateSupplyChain(values);
          }
        }}
        confirmationLabel={
          !updateMode ? "Add supply chain" : "Update supply chain"
        }
        cancellationLabel={"Cancel"}
        initialValues={initialFormValues}
      />
    </Panel>
  );
};

export default ManageSupplyChain;
