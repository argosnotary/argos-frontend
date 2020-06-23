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
import styled, { css, ThemeContext } from "styled-components";

import { CancelButton } from "../../../atoms/Button";
import ContentSeparator from "../../../atoms/ContentSeparator";
import DataRequest from "../../../types/DataRequest";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import IServiceAccountApiResponse from "../../../interfaces/INpaApiResponse";
import PasswordView from "../../../atoms/PasswordView";
import FlexRow from "../../../atoms/FlexRow";
import { cryptoAvailable, generateKey } from "../../../security";
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFlexColumWrapper,
  ModalFooter
} from "../../../atoms/Modal";
import { IGenericFormSchema } from "../../../interfaces/IGenericFormSchema";
import KeyContainer from "../../../atoms/KeyContainer";
import { IPublicKey } from "../../../interfaces/IPublicKey";
import { NoCryptoWarning } from "../../../molecules/NoCryptoWarning";
import { FormPermissions } from "../../../types/FormPermission";
import { CryptoExceptionWarning } from "../../../molecules/CryptoExceptionWarning";
import { Panel } from "../../../molecules/Panel";
import { useUserProfileContext } from "../../../stores/UserProfile";
import {
  HierarchyEditorActionTypes,
  HierarchyEditorPanelModes,
  HierarchyEditorPanelTypes,
  HierarchyEditorStateContext
} from "../../../stores/hierarchyEditorStore";
import {
  addObjectToTree,
  removeObjectFromTree,
  updateTreeObject
} from "../utils";
import ITreeNode from "../../../interfaces/ITreeNode";
import { LoaderIcon } from "../../../atoms/Icons";
import PanelBreadCrumb from "../../../molecules/PanelBreadCrumb";
import WarningModal from "../../../molecules/WarningModal";
import useFormBuilder, {
  IFormBuilderConfig,
  FormSubmitButtonHandlerTypes
} from "../../../hooks/useFormBuilder";

interface IServiceAccountFormValues {
  serviceaccountname: string;
}

enum WizardStates {
  KEY_OVERRIDE_WARNING,
  LOADING,
  NO_CRYPTO_SUPPORT,
  CRYPTO_EXCEPTION,
  DEFAULT
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
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/.test(values.serviceaccountname)) {
    errors.serviceaccountname =
      "Invalid serviceaccount name (only lowercase alphanumeric characters and underscore allowed).";
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
  const { token } = useUserProfileContext();
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
  const [wizardState, setWizardState] = useState(
    cryptoAvailable()
      ? WizardStates.KEY_OVERRIDE_WARNING
      : WizardStates.NO_CRYPTO_SUPPORT
  );

  const [displayModal, setDisplayModal] = useState(false);
  const [deleteWarningModal, setDeletewarningModal] = useState(false);
  const [cryptoException, setCryptoException] = useState(false);
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

  const generateNode = (serviceaccount: IServiceAccountApiResponse) => {
    const node = {} as ITreeNode;
    node.referenceId = serviceaccount.id;
    node.parentId = serviceaccount.parentLabelId;
    node.name = serviceaccount.name;
    node.type = HierarchyEditorPanelTypes.SERVICE_ACCOUNT;

    return node;
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
      token,
      url: "/api/serviceaccount",
      cbSuccess: async (serviceaccount: IServiceAccountApiResponse) => {
        try {
          const generatedKeys = await generateKey(true);
          const keyDataRequest: DataRequest = {
            data: generatedKeys.keys,
            method: "post",
            token,
            url: `/api/serviceaccount/${serviceaccount.id}/key`,
            cbSuccess: () => {
              setGeneratedPassword(generatedKeys.password);
              setServiceAccountKey({
                publicKey: generatedKeys.keys.publicKey,
                keyId: generatedKeys.keys.keyId
              });
              const hierarchyDataRequest: DataRequest = {
                params: {
                  HierarchyMode: "NONE"
                },
                method: "get",
                token,
                url: `/api/hierarchy/${serviceaccount.id}`,
                cbSuccess: (node: ITreeNode) => {
                  hierarchyEditorDispatch.editor({
                    type: HierarchyEditorActionTypes.SET_PANEL,
                    node: node,
                    breadcrumb: "",
                    permission: FormPermissions.EDIT,
                    panel:
                      HierarchyEditorPanelTypes.SERVICE_ACCOUNT_KEY_GENERATOR,
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
              setWizardState(WizardStates.DEFAULT);
            }
          };
          setServiceAccountDataRequest(keyDataRequest);
        } catch (e) {
          setCryptoException(true);
          throw e;
        }
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
      token,
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
      token,
      url: `/api/serviceaccount/${id}/key`,
      cbSuccess: (n: IPublicKey) => {
        setServiceAccountKey(n);
      }
    };

    setServiceAccountGetRequest(dataRequest);
  };

  useEffect(() => {
    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.UPDATE) {
      formApi.setInitialFormValues({
        serviceaccountname: hierarchyEditorState.editor.node.name
      });
      getKeyId(hierarchyEditorState.editor.node.referenceId);
    }

    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.CREATE) {
      formApi.setInitialFormValues({ serviceaccountname: "" });
    }
    if (hierarchyEditorState.editor.mode === HierarchyEditorPanelModes.DELETE) {
      setDeletewarningModal(true);
    }
    if (
      hierarchyEditorState.editor.panel ===
        HierarchyEditorPanelTypes.SERVICE_ACCOUNT_KEY_GENERATOR &&
      hierarchyEditorState.editor.mode
    ) {
      setDisplayModal(true);
    }
  }, [
    hierarchyEditorState.editor.node,
    hierarchyEditorState.editor.mode,
    hierarchyEditorState.editor.panel
  ]);

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
      setServiceAccountGetRequest(dataRequest);
    };

    return (
      <WarningModal
        message="This service account will be deleted are you sure ?"
        continueHandler={continueHandler}
        cancelHandler={cancelHandler}
      />
    );
  };
  const getModalContent = (currentWizardState: number) => {
    const theme = useContext(ThemeContext);

    const cancelHandler = () => {
      setDeletewarningModal(false);
      hierarchyEditorDispatch.editor({
        type: HierarchyEditorActionTypes.RESET
      });
    };

    const continueHandler = async () => {
      setWizardState(WizardStates.LOADING);
      try {
        const generatedKeys = await generateKey(true);
        const dataRequest: DataRequest = {
          data: generatedKeys.keys,
          method: "post",
          token,
          url: `/api/serviceaccount/${hierarchyEditorState.editor.node.referenceId}/key`,
          cbSuccess: () => {
            setGeneratedPassword(generatedKeys.password);
            setServiceAccountKey({
              publicKey: generatedKeys.keys.publicKey,
              keyId: generatedKeys.keys.keyId
            });
            setDisplayModal(false);
            setWizardState(WizardStates.DEFAULT);
          }
        };

        setServiceAccountDataRequest(dataRequest);
      } catch (e) {
        setWizardState(WizardStates.CRYPTO_EXCEPTION);
        throw e;
      }
    };

    if (wizardState == WizardStates.DEFAULT) {
      continueHandler();
    }

    switch (currentWizardState) {
      case WizardStates.LOADING:
        return (
          <>
            <ModalBody>
              <LoaderIcon color={theme.loaderIcon.color} size={64} />
            </ModalBody>
          </>
        );
      case WizardStates.KEY_OVERRIDE_WARNING:
        return (
          <WarningModal
            message="Existing key will be deactivated. Are you sure you want to continue ?"
            continueHandler={continueHandler}
            cancelHandler={cancelHandler}
          />
        );
      case WizardStates.NO_CRYPTO_SUPPORT:
        return (
          <>
            <ModalBody>
              <NoCryptoWarning />
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={cancelHandler}>Close</ModalButton>
            </ModalFooter>
          </>
        );
      case WizardStates.CRYPTO_EXCEPTION:
        return (
          <>
            <ModalBody>
              <CryptoExceptionWarning />
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={cancelHandler}>Close</ModalButton>
            </ModalFooter>
          </>
        );
    }
  };

  if (displayModal) {
    return (
      <Modal>
        <ModalFlexColumWrapper>
          {getModalContent(wizardState)}
        </ModalFlexColumWrapper>
      </Modal>
    );
  }

  if (deleteWarningModal) {
    return (
      <Modal>
        <ModalFlexColumWrapper>
          {getDeleteWarningContent()}
        </ModalFlexColumWrapper>
      </Modal>
    );
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
        {cryptoException ? <CryptoExceptionWarning /> : null}
      </Panel>
    );
  }

  return null;
};

export default ManageServiceAccount;
