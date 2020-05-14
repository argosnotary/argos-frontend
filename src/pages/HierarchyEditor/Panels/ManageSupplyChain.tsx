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

import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import ContentSeparator from "../../../atoms/ContentSeparator";
import DataRequest from "../../../types/DataRequest";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import ISupplyChainApiResponse from "../../../interfaces/ISupplyChainApiResponse";
import GenericForm, {
  IGenericFormSchema
} from "../../../organisms/GenericForm";
import { Panel } from "../../../molecules/Panel";
import { StateContext } from "../HierarchyEditor";
import {
  HierarchyEditorDataActionTypes,
  HierarchyEditorPaneActionTypes
} from "../../../stores/hierarchyEditorStore";
import { useUserProfileContext } from "../../../stores/UserProfile";

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
  const [state, dispatch] = useContext(StateContext);
  const [supplyChainApiResponseState, setSupplyChainApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [initialFormValues, setInitialFormValues] = useState(
    {} as ISupplyChainNameFormValues
  );

  const postSupplyChain = (values: ISupplyChainNameFormValues) => {
    const data: any = {};

    data.name = values.supplychainname;

    if (state.nodeReferenceId !== "") {
      data.parentLabelId = state.nodeReferenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      token,
      url: "/api/supplychain",
      cbSuccess: (supplyChain: ISupplyChainApiResponse) => {
        dispatch({
          type: HierarchyEditorDataActionTypes.POST_SUPPLY_CHAIN,
          supplyChain
        });
      }
    };

    setSupplyChainApiRequest(dataRequest);
  };

  const updateSupplyChain = (values: ISupplyChainNameFormValues) => {
    const data: any = {};

    data.name = values.supplychainname;

    if (state.nodeReferenceId !== "") {
      data.supplyChainId = state.nodeReferenceId;
    }

    if (state.nodeParentId !== "") {
      data.parentLabelId = state.nodeParentId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      token,
      url: `/api/supplychain/${state.nodeReferenceId}`,
      cbSuccess: (supplyChain: ISupplyChainApiResponse) => {
        dispatch({
          type: HierarchyEditorDataActionTypes.PUT_SUPPLY_CHAIN,
          supplyChain
        });
      }
    };

    setSupplyChainApiRequest(dataRequest);
  };

  useEffect(() => {
    if (
      state.firstPanelView ===
      HierarchyEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE
    ) {
      setInitialFormValues({ supplychainname: state.selectedNodeName });
    }

    if (
      state.firstPanelView ===
      HierarchyEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE
    ) {
      setInitialFormValues({ supplychainname: "" });
    }
  }, [state.selectedNodeName, state.firstPanelView]);

  const updateMode =
    state.firstPanelView ===
    HierarchyEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE;

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
      {state.selectedNodeName !== "" ? (
        <>
          <NodesBreadCrumb>
            Selected: {state.breadcrumb}
            <LastBreadCrumb>
              {state.breadcrumb.length > 0 ? " / " : ""}
              {state.selectedNodeName}
            </LastBreadCrumb>
          </NodesBreadCrumb>
          <ContentSeparator />
        </>
      ) : null}
      <GenericForm
        schema={formSchema}
        permission={state.panePermission}
        isLoading={supplyChainApiResponseState.isLoading}
        validate={validate}
        onCancel={() => {
          dispatch({
            type: HierarchyEditorPaneActionTypes.RESET_PANE
          });
        }}
        onSubmit={values => {
          if (
            state.firstPanelView ===
            HierarchyEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE
          ) {
            postSupplyChain(values);
          }

          if (
            state.firstPanelView ===
            HierarchyEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE
          ) {
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
