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
import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { ThemeContext } from "styled-components";

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

const CreateKeyButton = styled(TransparentButton)`
  margin: 1.3rem 0;
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
}

const KeyManagementModal: React.FC<IKeyManagementModalProps> = ({
  setDisplayModal
}) => {
  const [wizardState, setWizardState] = useState(
    WizardStates.KeyOverrideWarning
  );
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [response, setDataRequest] = useDataApi(genericDataFetchReducer);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const theme = useContext(ThemeContext);
  const [localStorageToken] = useToken();

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(response, "data") &&
      !response.isLoading
    ) {
      setWizardState(WizardStates.CopyKey);
    }

    if (response.isLoading) {
      setWizardState(WizardStates.Loading);
    }

    if (response.error) {
      setWizardState(WizardStates.Error);
    }
  }, [response]);

  const postKeyData = async () => {
    const generatedKeys = await generateKey();

    const dataRequest: DataRequest = {
      data: generatedKeys.keys,
      method: "post",
      token: localStorageToken,
      url: "/api/personalaccount/me/key"
    };

    setGeneratedPassword(generatedKeys.password);
    setDataRequest(dataRequest);
  };

  const getModalContent = (currentWizardState: number) => {
    const disableModal = () => {
      setDisplayModal(false);
      setWizardState(WizardStates.KeyOverrideWarning);
    };

    const copyPasswordToClipboard = () => {
      if (passwordInputRef.current) {
        passwordInputRef.current.select();
        passwordInputRef.current.setSelectionRange(0, 99999);
        const document: any = window.document || {};
        document.execCommand("copy");
        document.getSelection().removeAllRanges();

        const oldPassword = generatedPassword;
        setGeneratedPassword("Copied");

        setTimeout(() => {
          setGeneratedPassword(oldPassword);
        }, 1000);
      }
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
              <ModalButton onClick={copyPasswordToClipboard}>
                Copy to clipboard
              </ModalButton>
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

  const enableModal = () => {
    setDisplayModal(true);
  };

  return (
    <>
      <PageHeader>Key management</PageHeader>
      {displayModal ? (
        <KeyManagementModal
          displayModal={displayModal}
          setDisplayModal={setDisplayModal}
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
