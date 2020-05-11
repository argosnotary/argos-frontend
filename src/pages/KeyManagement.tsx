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

import { cryptoAvailable, generateKey } from "../security";

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
import genericDataFetchReducer from "../stores/genericDataFetchReducer";
import PasswordView from "../atoms/PasswordView";
import { IPublicKey } from "../interfaces/IPublicKey";
import KeyContainer from "../atoms/KeyContainer";
import FlexColumn from "../atoms/FlexColumn";
import { NoCryptoWarning } from "../molecules/NoCryptoWarning";
import { CryptoExceptionWarning } from "../molecules/CryptoExceptionWarning";
import { useUserProfileContext } from "../stores/UserProfile";

export const CreateKeyButton = styled(TransparentButton)`
  margin: 1.3rem 0;
`;
const copyInputCss = css`
  border: 0;
  outline: 0;
  font-size: 0.8rem;
`;

const clipboardWrapperCss = css`
  padding: 0.4rem;
  margin: 0 1rem;
  height: 1.8rem;
`;

const copyInputWrapperCss = css`
  margin: 0;
  width: 30vw;
`;

const NoActiveKeyWarning = styled.p`
  margin: 0.25rem 0 0;
  padding: 1rem;
  max-width: 50%;
  color: ${props => props.theme.keyManagementPage.noActiveKeyWarning.textColor};
  border: 1px solid
    ${props => props.theme.keyManagementPage.noActiveKeyWarning.borderColor};
  background: white;
`;
const LoaderContainer = styled(FlexColumn)`
  height: 100%;
  justify-content: center;
  align-items: center;
`;
enum WizardStates {
  Loading,
  Error,
  KeyOverrideWarning,
  CopyKey,
  CryptoError
}

interface IKeyManagementModalProps {
  displayModal: boolean;
  setDisplayModal: (displayModal: boolean) => void;
  cbKeyCreated: (key: IPublicKey) => void;
  createFirstKey: boolean;
}

export const KeyManagementModal: React.FC<IKeyManagementModalProps> = ({
  setDisplayModal,
  cbKeyCreated,
  createFirstKey
}) => {
  const [wizardState, setWizardState] = useState(
    WizardStates.KeyOverrideWarning
  );
  const theme = useContext(ThemeContext);
  const { token } = useUserProfileContext();
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [createKeyResponse, setCreateKeyDataRequest] = useDataApi(
    genericDataFetchReducer
  );
  useEffect(() => {
    if (createFirstKey) {
      setWizardState(WizardStates.Loading);
      postKeyData();
    }
  }, [createFirstKey]);
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
    try {
      const generatedKeys = await generateKey();
      const dataRequest: DataRequest = {
        data: generatedKeys.keys,
        method: "post",
        token: token,
        url: "/api/personalaccount/me/key",
        cbSuccess: () => {
          cbKeyCreated(generatedKeys.keys);
        }
      };
      setGeneratedPassword(generatedKeys.password);
      setCreateKeyDataRequest(dataRequest);
    } catch (e) {
      setWizardState(WizardStates.CryptoError);
      throw e;
    }
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
      case WizardStates.CryptoError:
        return (
          <>
            <ModalBody>
              <CryptoExceptionWarning />
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
  const [keyAvailable, setKeyAvailable] = useState(true);
  const theme = useContext(ThemeContext);
  const [publicKey, setPublicKey] = useState({} as IPublicKey);
  const { token } = useUserProfileContext();
  const createNewKey = () => {
    setDisplayModal(true);
  };

  const cbKeyCreated = (key: IPublicKey) => {
    setKeyAvailable(true);
    setPublicKey(key);
  };
  const getActivekeyDataRequest: DataRequest = {
    method: "get",
    token: token,
    url: "/api/personalaccount/me/key",
    cbSuccess: (key: IPublicKey) => {
      setPublicKey(key);
      setKeyAvailable(true);
    },
    cbFailure: (error): boolean => {
      setKeyAvailable(false);
      return error.response && error.response.status === 404;
    }
  };
  const [getActiveKeyResponse] = useDataApi(
    genericDataFetchReducer,
    getActivekeyDataRequest
  );

  return (
    <>
      <PageHeader>Key management</PageHeader>
      {keyAvailable && !getActiveKeyResponse.isLoading ? (
        <KeyContainer
          publicKey={publicKey}
          clipboardIconSize={16}
          inputCss={copyInputCss}
          clipboardWrapperCss={clipboardWrapperCss}
          copyInputWrapperCss={copyInputWrapperCss}
        />
      ) : !getActiveKeyResponse.isLoading ? (
        <NoActiveKeyWarning>
          There is no key currently active. Please create a new key.
        </NoActiveKeyWarning>
      ) : getActiveKeyResponse.isLoading ? (
        <LoaderContainer>
          <LoaderIcon size={32} color={theme.loaderIcon.color} />
        </LoaderContainer>
      ) : null}

      {displayModal ? (
        <KeyManagementModal
          displayModal={displayModal}
          setDisplayModal={setDisplayModal}
          cbKeyCreated={cbKeyCreated}
          createFirstKey={!keyAvailable}
        />
      ) : null}
      {!cryptoAvailable() ? <NoCryptoWarning /> : null}
      {!displayModal && cryptoAvailable() ? (
        <CreateKeyButton onClick={createNewKey}>
          <PlusIcon size={32} color={theme.keyManagementPage.iconColor} />
          Create new key
        </CreateKeyButton>
      ) : null}
    </>
  );
};
export default KeyManagement;
