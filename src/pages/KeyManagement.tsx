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

/* tslint:disable */
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { generateKey } from "../security";

import { Warning } from "../atoms/Alerts";
import PageHeader from "../atoms/PageHeader";
import { KeyIcon, LoaderIcon, PlusIcon } from "../atoms/Icons";
import FlexColumn from "../atoms/FlexColumn";
import FlexRow from "../atoms/FlexRow";
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFlexColumWrapper,
  ModalFooter
} from "../atoms/Modal";
import TransparentButton from "../atoms/TransparentButton";

import IState from "../interfaces/IState";
import Action from "../types/Action";
import DataRequest from "../types/DataRequest";
import useDataApi from "../hooks/useDataApi";

const dataFetchReducer = (state: IState, action: Action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.results,
        isLoading: false
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
  }
};

const CreateKeyButton = styled(TransparentButton)`
  margin: 2rem 0;
`;

const PasswordDisplay = styled.section`
  display: flex;
  align-items: center;
  border: 1px solid orange;
  margin: 1rem 0;
  padding: 1.25rem 1.5rem;
  width: 100%;
`;

const PasswordCopy = styled.p`
  color: orange;
`;

const Password = styled.input`
  margin: 0.75rem 1rem;
  color: orange;
  font-size: 2rem;
  border: none;
  outline: none;
`;

const PasswordContainer = styled(FlexRow)`
  margin: 1rem 0;
  align-items: center;
`;

const PasswordIconWrapper = styled.div`
  position: relative;
  top: 3px;
  margin: 0 0 0 1rem;
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
  const [response, setDataRequest] = useDataApi(dataFetchReducer);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (response.hasOwnProperty("data") && !response.isLoading) {
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
      token: "my_token",
      url: "/api/key"
    };

    setGeneratedPassword(generatedKeys.password);
    setDataRequest(dataRequest);
  };

  const getModalContent = (wizardState: number) => {
    switch (wizardState) {
      case WizardStates.Loading:
        return (
          <>
            <ModalBody>
              <LoaderIcon color={"#1779ba"} size={64} />
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
              <ModalButton
                onClick={() => {
                  setDisplayModal(false);
                }}
              >
                No
              </ModalButton>
              <ModalButton
                onClick={() => {
                  postKeyData();
                }}
              >
                Continue
              </ModalButton>
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
              <ModalButton
                onClick={() => {
                  setDisplayModal(false);
                  setWizardState(WizardStates.KeyOverrideWarning);
                }}
              >
                Close
              </ModalButton>
            </ModalFooter>
          </>
        );
      case WizardStates.CopyKey:
        return (
          <>
            <ModalBody>
              <PasswordDisplay>
                <FlexColumn>
                  <PasswordCopy>
                    Your key has been generated with the following passphrase:
                  </PasswordCopy>
                  <PasswordContainer>
                    <PasswordIconWrapper>
                      <KeyIcon color={"orange"} size={40} />
                    </PasswordIconWrapper>
                    <Password
                      readOnly
                      value={generatedPassword}
                      ref={passwordInputRef}
                    />
                  </PasswordContainer>
                  <PasswordCopy>
                    Do not forget to copy your passphrase before closing this
                    window.
                  </PasswordCopy>
                </FlexColumn>
              </PasswordDisplay>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                onClick={() => {
                  if (passwordInputRef.current) {
                    passwordInputRef.current.select();
                    passwordInputRef.current.setSelectionRange(0, 99999);
                    document.execCommand("copy");
                    document.getSelection()!.removeAllRanges();
                  }
                }}
              >
                Copy to clipboard
              </ModalButton>
              <ModalButton
                onClick={() => {
                  setDisplayModal(false);
                  setWizardState(WizardStates.KeyOverrideWarning);
                }}
              >
                Close
              </ModalButton>
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
  return (
    <>
      <PageHeader>Key management</PageHeader>
      {displayModal ? (
        <KeyManagementModal
          displayModal={displayModal}
          setDisplayModal={setDisplayModal}
        />
      ) : (
        <CreateKeyButton onClick={() => setDisplayModal(true)}>
          <PlusIcon size={32} color={"#1779ba"} />
          Create new key
        </CreateKeyButton>
      )}
    </>
  );
};

export default KeyManagement;
