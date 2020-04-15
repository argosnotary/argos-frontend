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

import { generateKey } from "../security";

import { Warning } from "../atoms/Alerts";
import { LoaderIcon, PlusIcon } from "../atoms/Icons";
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFlexColumWrapper,
  ModalFooter
} from "../atoms/Modal";
import PageHeader from "../atoms/PageHeader";
import TransparentButton from "../atoms/TransparentButton";

import DataRequest from "../types/DataRequest";
import useDataApi from "../hooks/useDataApi";
import useToken from "../hooks/useToken";
import genericDataFetchReducer from "../stores/genericDataFetchReducer";
import PasswordView from "../atoms/PasswordView";
import { IPublicKey } from "../interfaces/IPublicKey";
import KeyContainer from "../atoms/KeyContainer";

const CreateKeyButton = styled(TransparentButton)`
  margin: 1.3rem 0;
`;

const copyInputCss = css`
  border: 0;
  outline: 0;
  background: none;
  font-size: 0.8rem;
`;



const clipboardWrapperCss = css`
  padding: 0.4rem;
  margin: 0 1rem;
  height: 1.8rem;
  width: 50%;
`;

const copyInputWrapperCss = css`
margin: 0;
`;

enum WizardStates {
  Loading,
  Error,
  KeyOverrideWarning,
  CopyKey
}

interface IKeyManagementModalProps {
  displayModal: boolean;
  setDisplayModal: (displayModal: boolean) => void;
  cbKeyCreated: (key: IPublicKey) => void;
}

const KeyManagementModal: React.FC<IKeyManagementModalProps> = ({
  setDisplayModal,
  cbKeyCreated
}) => {
  const [wizardState, setWizardState] = useState(
    WizardStates.KeyOverrideWarning
  );
  const theme = useContext(ThemeContext);
  const [localStorageToken] = useToken();
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [createKeyResponse, setCreateKeyDataRequest] = useDataApi(
    genericDataFetchReducer
  );

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(createKeyResponse, "data") &&
      !createKeyResponse.isLoading
    ) {
      setWizardState(WizardStates.CopyKey);
    }

    if (createKeyResponse.isLoading) {
      setWizardState(WizardStates.Loading);
    }

    if (createKeyResponse.error) {
      setWizardState(WizardStates.Error);
    }
  }, [createKeyResponse]);

  const postKeyData = async () => {
    const generatedKeys = await generateKey();
    const dataRequest: DataRequest = {
      data: generatedKeys.keys,
      method: "post",
      token: localStorageToken,
      url: "/api/personalaccount/me/key",
      cbSuccess: () => {
        cbKeyCreated(generatedKeys.keys);
      }
    };
    setGeneratedPassword(generatedKeys.password);
    setCreateKeyDataRequest(dataRequest);
  };

  const getModalContent = (currentWizardState: number) => {
    const disableModal = () => {
      setDisplayModal(false);
      setWizardState(WizardStates.KeyOverrideWarning);
    };

    switch (currentWizardState) {
      case WizardStates.Loading:
        return (
          <>
            <ModalBody>
              <LoaderIcon color={theme.loaderIcon.color} size={64} />
            </ModalBody>
          </>
        );
      case WizardStates.KeyOverrideWarning:
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
              <ModalButton onClick={disableModal}>No</ModalButton>
              <ModalButton onClick={postKeyData}>Continue</ModalButton>
            </ModalFooter>
          </>
        );
      case WizardStates.Error:
        return (
          <>
            <ModalBody>
              <Warning
                message={"Could not connect to server. Please try again later."}
              />
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={disableModal}>Close</ModalButton>
            </ModalFooter>
          </>
        );
      case WizardStates.CopyKey:
        return (
          <>
            <ModalBody>
              <PasswordView password={generatedPassword} />
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={disableModal}>Close</ModalButton>
            </ModalFooter>
          </>
        );
    }
  };

  return (
    <Modal>
      <ModalFlexColumWrapper>
        {getModalContent(wizardState)}
      </ModalFlexColumWrapper>
    </Modal>
  );
};

const KeyManagement = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const theme = useContext(ThemeContext);
  const [publicKey, setPublicKey] = useState({keyId: "",publicKey: ""});
  const [localStorageToken] = useToken();
  const enableModal = () => {
    setDisplayModal(true);
  };

  const cbKeyCreated = (publicKey: IPublicKey) => {
    setPublicKey(publicKey);
  };
  const getActivekeyDataRequest: DataRequest = {
    method: "get",
    token: localStorageToken,
    url: "/api/personalaccount/me/key",
    cbSuccess: (key: IPublicKey) => {
      setPublicKey(key);
    }
  };
  const [_getActiveKeyResponse] = useDataApi(
    genericDataFetchReducer,
    getActivekeyDataRequest
  );
  return (
    <>
      <PageHeader>Key management</PageHeader>

      <KeyContainer
        publicKey={publicKey}
        clipboardIconSize={16}
        inputCss={copyInputCss}
        clipboardWrapperCss={clipboardWrapperCss}
        copyInputWrapperCss={copyInputWrapperCss}
      />

      {displayModal ? (
        <KeyManagementModal
          displayModal={displayModal}
          setDisplayModal={setDisplayModal}
          cbKeyCreated={cbKeyCreated}
        />
      ) : (
        <CreateKeyButton onClick={enableModal}>
          <PlusIcon size={32} color={theme.keyManagementPage.iconColor} />
          Create new key
        </CreateKeyButton>
      )}
    </>
  );
};

export default KeyManagement;
