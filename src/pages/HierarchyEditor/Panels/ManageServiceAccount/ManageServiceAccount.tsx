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
import { CancelButton } from "../../../../atoms/Button";
import ContentSeparator from "../../../../atoms/ContentSeparator";
import DataRequest from "../../../../types/DataRequest";
import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import IServiceAccountApiResponse from "../../../../interfaces/IServiceAccountApiResponse";
import PasswordView from "../../../../atoms/PasswordView";
import FlexRow from "../../../../atoms/FlexRow";
import { cryptoAvailable } from "../../../../security";
import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";
import KeyContainer from "../../../../atoms/KeyContainer";
import { IPublicKey } from "../../../../interfaces/IPublicKey";
import { NoCryptoWarning } from "../../../../molecules/NoCryptoWarning";
import { FormPermissions } from "../../../../types/FormPermission";
import { Panel } from "../../../../molecules/Panel";
import {
  HierarchyEditorActionTypes,
  HierarchyEditorPanelModes,
  HierarchyEditorPanelTypes,
  HierarchyEditorStateContext
} from "../../../../stores/hierarchyEditorStore";
import { addObjectToTree, updateTreeObject } from "../../utils";
import ITreeNode from "../../../../interfaces/ITreeNode";
import PanelBreadCrumb from "../../../../molecules/PanelBreadCrumb";
import useFormBuilder, {
  FormSubmitButtonHandlerTypes,
  IFormBuilderConfig
} from "../../../../hooks/useFormBuilder";
import {
  ServiceAccountGenerateKeyWizard,
  WizardModes
} from "./ServiceAccountGenerateKeyWizard";
import styled, { css } from "styled-components";
import ServiceAccountDeleteModal from "./ServiceAccountDeleteModal";

interface IServiceAccountFormValues {
  serviceaccountname: string;
}

const CloseButton = styled(CancelButton)`
  margin: 0;
`;

const formSchema: IGenericFormSchema = [
  {
    labelValue: "Service account name*",
    name: "serviceaccountname",
    formType: "text"
  }
];

const validate = (values: IServiceAccountFormValues) => {
  const errors = {} as any;

  if (!values.serviceaccountname) {
    errors.serviceaccountname = "Please fill in a service account name.";
  } else if (!/^([a-z]|[a-z][a-z0-9-]*[a-z0-9])?$/.test(values.serviceaccountname)) {
    errors.serviceaccountname =
      "Invalid serviceaccount name (only lowercase alphanumeric characters and hyphen allowed).";
  }

  return errors;
};

const copyInputCss = css`
  border: 0;
  outline: 0;
  font-size: 0.8rem;
`;

const copyInputWrapperCss = css`
  margin: 0 0 1rem;
`;
const clipboardWrapperCss = css`
  padding: 0.4rem;
  margin: 0 1rem;
  height: 1.8rem;
`;

const ManageServiceAccount = () => {
  const [
    serviceAccountDataRequestState,
    setServiceAccountDataRequest
  ] = useDataApi(genericDataFetchReducer);
  const [
    _serviceAccountGetRequestState,
    setServiceAccountGetRequest
  ] = useDataApi(genericDataFetchReducer);

  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );

  const updateMode =
    hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.UPDATE;

  const [serviceAccountKey, setServiceAccountKey] = useState({} as IPublicKey);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const [wizardMode, setWizardMode] = useState(WizardModes.MANUAL);
  const [displayKeyGenerationWizard, setDisplayKeyGenerationWizard] = useState(
    false
  );
  const [displayDeleteWarningModal, setDisplayDeleteWarningModal] = useState(
    false
  );
  const [_treeChildrenApiResponse, setTreeChildrenApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const formConfig: IFormBuilderConfig = {
    schema: formSchema,
    permission: updateMode
      ? hierarchyEditorState.editor.permission
      : cryptoAvailable()
      ? hierarchyEditorState.editor.permission
      : FormPermissions.READ,
    isLoading: serviceAccountDataRequestState.isLoading,
    validate,
    onCancel: () => {
      hierarchyEditorDispatch.editor({
        type: HierarchyEditorActionTypes.RESET
      });
    },
    onSubmit: values => {
      if (!updateMode) {
        postNewServiceAccount(values);
      }

      if (updateMode) {
        updateServiceAccount(values);
      }
    },
    confirmationLabel: updateMode
      ? "Update Service Account"
      : "Add Service Account",
    cancellationLabel: "Cancel",
    autoFocus: true,
    buttonHandler: FormSubmitButtonHandlerTypes.CLICK
  };

  const [formJSX, formApi] = useFormBuilder(formConfig);

  const resetState = () => {
    setWizardMode(WizardModes.MANUAL);
    setServiceAccountKey({} as IPublicKey);
    setDisplayKeyGenerationWizard(false);
    setGeneratedPassword("");
    setDisplayDeleteWarningModal(false);
  };

  const generateNode = (serviceaccount: IServiceAccountApiResponse) => {
    const node = {} as ITreeNode;
    node.referenceId = serviceaccount.id;
    node.parentId = serviceaccount.parentLabelId;
    node.name = serviceaccount.name;
    node.type = HierarchyEditorPanelTypes.SERVICE_ACCOUNT;

    return node;
  };

  const cbKeyGenerated = (keypair: IPublicKey, generatedPassword: string) => {
    setServiceAccountKey({
      publicKey: keypair.publicKey,
      keyId: keypair.keyId
    });
    setGeneratedPassword(generatedPassword);
    setDisplayKeyGenerationWizard(false);
  };

  const postNewServiceAccount = (values: IServiceAccountFormValues) => {
    const data: any = {};

    data.name = values.serviceaccountname;

    if (hierarchyEditorState.editor.node.referenceId !== "") {
      data.parentLabelId = hierarchyEditorState.editor.node.referenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      url: "/api/serviceaccount",
      cbSuccess: async (serviceaccount: IServiceAccountApiResponse) => {
        setWizardMode(WizardModes.AUTOMATIC);
        const hierarchyDataRequest: DataRequest = {
          params: {
            HierarchyMode: "NONE"
          },
          method: "get",
          url: `/api/hierarchy/${serviceaccount.id}`,
          cbSuccess: (node: ITreeNode) => {
            hierarchyEditorDispatch.editor({
              type: HierarchyEditorActionTypes.SET_PANEL,
              node: node,
              breadcrumb: "",
              permission: FormPermissions.EDIT,
              panel: HierarchyEditorPanelTypes.SERVICE_ACCOUNT_KEY_GENERATOR,
              mode: HierarchyEditorPanelModes.UPDATE
            });
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
    setServiceAccountDataRequest(dataRequest);
  };

  const updateServiceAccount = (values: IServiceAccountFormValues) => {
    const data: any = {};

    data.name = values.serviceaccountname;

    if (hierarchyEditorState.editor.node.referenceId !== "") {
      data.labelId = hierarchyEditorState.editor.node.referenceId;
    }

    if (hierarchyEditorState.editor.node.parentId !== "") {
      data.parentLabelId = hierarchyEditorState.editor.node.parentId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      url: `/api/serviceaccount/${hierarchyEditorState.editor.node.referenceId}`,
      cbSuccess: (serviceaccount: IServiceAccountApiResponse) => {
        const node = generateNode(serviceaccount);
        updateTreeObject(hierarchyEditorState, hierarchyEditorDispatch, node);
      }
    };

    setServiceAccountDataRequest(dataRequest);
  };

  const getKeyId = (id: string) => {
    const dataRequest: DataRequest = {
      method: "get",
      url: `/api/serviceaccount/${id}/key`,
      cbSuccess: (n: IPublicKey) => {
        setServiceAccountKey(n);
      }
    };
    setServiceAccountGetRequest(dataRequest);
  };

  useEffect(() => {
    resetState();
    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.UPDATE) {
      formApi.setInitialFormValues({
        serviceaccountname: hierarchyEditorState.editor.node.name
      });

      if (
        hierarchyEditorState.editor.panel !==
        HierarchyEditorPanelTypes.SERVICE_ACCOUNT_KEY_GENERATOR
      ) {
        getKeyId(hierarchyEditorState.editor.node.referenceId);
      }
    }
    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.CREATE) {
      formApi.setInitialFormValues({ serviceaccountname: "" });
    }
    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.DELETE) {
      setDisplayDeleteWarningModal(true);
    }
    if (
      hierarchyEditorState.editor.panel ===
        HierarchyEditorPanelTypes.SERVICE_ACCOUNT_KEY_GENERATOR &&
      hierarchyEditorState.editor.mode
    ) {
      setDisplayKeyGenerationWizard(true);
    }
  }, [
    hierarchyEditorState.editor.node,
    hierarchyEditorState.editor.mode,
    hierarchyEditorState.editor.panel
  ]);

  if (displayKeyGenerationWizard) {
    return (
      <ServiceAccountGenerateKeyWizard
        initialWizardMode={wizardMode}
        cbKeyGenerated={cbKeyGenerated}
      />
    );
  }
  if (displayDeleteWarningModal) {
    return <ServiceAccountDeleteModal />;
  }
  if (
    generatedPassword.length > 0 &&
    hierarchyEditorState.editor.panel ===
      HierarchyEditorPanelTypes.SERVICE_ACCOUNT_KEY_GENERATOR
  ) {
    return (
      <Panel
        maxWidth={"37.5vw"}
        resizable={false}
        last={true}
        title={
          updateMode
            ? "Update selected service account"
            : "Add child service account to selected label"
        }>
        <PanelBreadCrumb
          node={hierarchyEditorState.editor.node}
          breadcrumb={hierarchyEditorState.editor.breadcrumb}
        />
        {Object.keys(serviceAccountKey).length ? (
          <KeyContainer
            publicKey={serviceAccountKey}
            clipboardIconSize={16}
            clipboardWrapperCss={clipboardWrapperCss}
            inputCss={copyInputCss}
            copyInputWrapperCss={copyInputWrapperCss}
          />
        ) : null}
        <ContentSeparator />
        <PasswordView password={generatedPassword} margin={"0 0 1rem"} />
        <FlexRow>
          <CloseButton
            type="button"
            onClick={() =>
              hierarchyEditorDispatch.editor({
                type: HierarchyEditorActionTypes.RESET
              })
            }>
            Close
          </CloseButton>
        </FlexRow>
      </Panel>
    );
  }

  if (
    hierarchyEditorState.editor.panel ===
      HierarchyEditorPanelTypes.SERVICE_ACCOUNT ||
    hierarchyEditorState.editor.panel ===
      HierarchyEditorPanelTypes.SERVICE_ACCOUNT_KEY_GENERATOR
  ) {
    return (
      <Panel
        maxWidth={"37.5vw"}
        resizable={false}
        last={true}
        title={
          updateMode
            ? "Update selected service account"
            : "Add child service account to selected label"
        }>
        <PanelBreadCrumb
          node={hierarchyEditorState.editor.node}
          breadcrumb={hierarchyEditorState.editor.breadcrumb}
        />
        {Object.keys(serviceAccountKey).length ? (
          <>
            <KeyContainer
              publicKey={serviceAccountKey}
              clipboardIconSize={16}
              clipboardWrapperCss={clipboardWrapperCss}
              inputCss={copyInputCss}
              copyInputWrapperCss={copyInputWrapperCss}
            />
            <ContentSeparator />
          </>
        ) : null}
        {formJSX}
        {!updateMode && !cryptoAvailable() ? <NoCryptoWarning /> : null}
      </Panel>
    );
  }

  return null;
};
export default ManageServiceAccount;
