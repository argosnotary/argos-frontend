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
import styled, { css } from "styled-components";

import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import { CancelButton } from "../../../atoms/Button";
import ContentSeparator from "../../../atoms/ContentSeparator";
import DataRequest from "../../../types/DataRequest";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import INpaApiResponse from "../../../interfaces/INpaApiResponse";
import PasswordView from "../../../atoms/PasswordView";
import FlexRow from "../../../atoms/FlexRow";
import { cryptoAvailable, generateKey } from "../../../security";
import { Warning } from "../../../atoms/Alerts";
import {
  ModalBody,
  ModalFlexColumWrapper,
  ModalFooter,
  ModalButton,
  Modal
} from "../../../atoms/Modal";
import GenericForm, {
  IGenericFormSchema
} from "../../../organisms/GenericForm";
import KeyContainer from "../../../atoms/KeyContainer";
import { IPublicKey } from "../../../interfaces/IPublicKey";
import { NoCryptoWarning } from "../../../molecules/NoCryptoWarning";
import { FormPermissions } from "../../../types/FormPermission";
import { CryptoExceptionWarning } from "../../../molecules/CryptoExceptionWarning";
import { Panel } from "../../../molecules/Panel";
import { StateContext } from "../HierarchyEditor";
import {
  HierarchyEditorDataActionTypes,
  HierarchyEditorPaneActionTypes
} from "../../../stores/hierarchyEditorStore";
import { useUserProfileContext } from "../../../stores/UserProfile";

interface INpaFormValues {
  serviceaccountname: string;
}

enum WizardStates {
  KEY_OVERRIDE_WARNING,
  NO_CRYPTO_SUPPORT,
  CRYPTO_EXCEPTION
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

const validate = (values: INpaFormValues) => {
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

const ManageNpa = () => {
  const { token } = useUserProfileContext();
  const [state, dispatch] = useContext(StateContext);
  const [serviceAccountPostState, setNpaPostRequest] = useDataApi(
    genericDataFetchReducer
  );
  const [_serviceAccountGetRequestState, setNpaGetRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [initialFormValues, setInitialFormValues] = useState(
    {} as INpaFormValues
  );

  const [serviceAccountKey, setNpaKey] = useState({} as IPublicKey);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [wizardState, setWizardState] = useState(
    cryptoAvailable()
      ? WizardStates.KEY_OVERRIDE_WARNING
      : WizardStates.NO_CRYPTO_SUPPORT
  );

  const [displayModal, setDisplayModal] = useState(false);
  const [cryptoException, setCryptoException] = useState(false);

  const postNewNpa = (values: INpaFormValues) => {
    const data: any = {};

    data.name = values.serviceaccountname;

    if (state.nodeReferenceId !== "") {
      data.parentLabelId = state.nodeReferenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      token,
      url: "/api/serviceaccount",
      cbSuccess: async (serviceaccount: INpaApiResponse) => {
        try {
          const generatedKeys = await generateKey(true);

          const keyDataRequest: DataRequest = {
            data: generatedKeys.keys,
            method: "post",
            token,
            url: `/api/serviceaccount/${serviceaccount.id}/key`,
            cbSuccess: () => {
              setGeneratedPassword(generatedKeys.password);

              setNpaKey({
                publicKey: generatedKeys.keys.publicKey,
                keyId: generatedKeys.keys.keyId
              });

              dispatch({
                type: HierarchyEditorDataActionTypes.POST_NEW_SERVICE_ACCOUNT,
                serviceaccount: {
                  ...serviceaccount,
                  keyId: generatedKeys.keys.keyId
                }
              });
            }
          };

          setNpaPostRequest(keyDataRequest);
        } catch (e) {
          setCryptoException(true);
          throw e;
        }
      }
    };

    setNpaPostRequest(dataRequest);
  };

  const updateNpa = (values: INpaFormValues) => {
    const data: any = {};

    data.name = values.serviceaccountname;

    if (state.nodeReferenceId !== "") {
      data.serviceAccountId = state.nodeReferenceId;
    }

    if (state.nodeParentId !== "") {
      data.parentLabelId = state.nodeParentId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      token,
      url: `/api/serviceaccount/${state.nodeReferenceId}`,
      cbSuccess: (serviceaccount: INpaApiResponse) => {
        dispatch({
          type: HierarchyEditorDataActionTypes.PUT_SERVICE_ACCOUNT,
          serviceaccount
        });
      }
    };

    setNpaPostRequest(dataRequest);
  };

  const getKeyId = (id: string) => {
    const dataRequest: DataRequest = {
      method: "get",
      token,
      url: `/api/serviceaccount/${id}/key`,
      cbSuccess: (n: IPublicKey) => {
        setNpaKey(n);
      }
    };

    setNpaGetRequest(dataRequest);
  };

  useEffect(() => {
    if (
      state.firstPanelView ===
      HierarchyEditorPaneActionTypes.SHOW_UPDATE_SERVICE_ACCOUNT_PANE
    ) {
      setInitialFormValues({ serviceaccountname: state.selectedNodeName });
      getKeyId(state.nodeReferenceId);
    }

    if (
      state.firstPanelView ===
      HierarchyEditorPaneActionTypes.SHOW_ADD_SERVICE_ACCOUNT_PANE
    ) {
      setInitialFormValues({ serviceaccountname: "" });
    }

    if (
      state.firstPanelView ===
      HierarchyEditorPaneActionTypes.SHOW_UPDATE_SERVICE_ACCOUNT_KEY_MODAL
    ) {
      setDisplayModal(true);
    }
  }, [state.selectedNodeName, state.firstPanelView]);

  const updateMode =
    state.firstPanelView ===
    HierarchyEditorPaneActionTypes.SHOW_UPDATE_SERVICE_ACCOUNT_PANE;

  if (
    state.dataAction === HierarchyEditorDataActionTypes.DATA_ACTION_COMPLETED
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
        <NodesBreadCrumb>
          Selected: {state.breadcrumb}
          <LastBreadCrumb>
            {state.breadcrumb.length > 0 ? " / " : ""}
            {state.selectedNodeName}
          </LastBreadCrumb>
        </NodesBreadCrumb>
        <ContentSeparator />
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
              dispatch({
                type: HierarchyEditorPaneActionTypes.RESET_PANE
              })
            }>
            Close
          </CloseButton>
        </FlexRow>
      </Panel>
    );
  }

  const getModalContent = (currentWizardState: number) => {
    const cancelHandler = () => {
      dispatch({ type: HierarchyEditorPaneActionTypes.RESET_PANE });
    };

    const continueHandler = async () => {
      try {
        const generatedKeys = await generateKey(true);
        const dataRequest: DataRequest = {
          data: generatedKeys.keys,
          method: "post",
          token,
          url: `/api/serviceaccount/${state.nodeReferenceId}/key`,
          cbSuccess: () => {
            setGeneratedPassword(generatedKeys.password);

            dispatch({
              type: HierarchyEditorDataActionTypes.DATA_ACTION_COMPLETED,
              data: { keyId: generatedKeys.keys.keyId }
            });
          }
        };

        setNpaPostRequest(dataRequest);
      } catch (e) {
        setWizardState(WizardStates.CRYPTO_EXCEPTION);
        throw e;
      }
    };

    switch (currentWizardState) {
      case WizardStates.KEY_OVERRIDE_WARNING:
        return (
          <>
            <ModalBody>
              <Warning
                message={
                  "Existing key will be deactivated. Are you sure you want to continue?"
                }
              />
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={cancelHandler}>No</ModalButton>
              <ModalButton onClick={continueHandler}>Continue</ModalButton>
            </ModalFooter>
          </>
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

  if (
    state.firstPanelView ===
      HierarchyEditorPaneActionTypes.SHOW_UPDATE_SERVICE_ACCOUNT_KEY_MODAL &&
    displayModal
  ) {
    return (
      <Modal>
        <ModalFlexColumWrapper>
          {getModalContent(wizardState)}
        </ModalFlexColumWrapper>
      </Modal>
    );
  }

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
      <GenericForm
        schema={formSchema}
        permission={
          updateMode
            ? state.panePermission
            : cryptoAvailable()
            ? state.panePermission
            : FormPermissions.READ
        }
        isLoading={serviceAccountPostState.isLoading}
        validate={validate}
        onCancel={() => {
          dispatch({
            type: HierarchyEditorPaneActionTypes.RESET_PANE
          });
        }}
        onSubmit={values => {
          if (
            state.firstPanelView ===
            HierarchyEditorPaneActionTypes.SHOW_ADD_SERVICE_ACCOUNT_PANE
          ) {
            postNewNpa(values);
          }

          if (
            state.firstPanelView ===
            HierarchyEditorPaneActionTypes.SHOW_UPDATE_SERVICE_ACCOUNT_PANE
          ) {
            updateNpa(values);
          }
        }}
        confirmationLabel={
          updateMode ? "Update Service Account" : "Add Service Account"
        }
        cancellationLabel={"Cancel"}
        initialValues={initialFormValues}
      />
      {!updateMode && !cryptoAvailable() ? <NoCryptoWarning /> : null}
      {cryptoException ? <CryptoExceptionWarning /> : null}
    </Panel>
  );
};

export default ManageNpa;
