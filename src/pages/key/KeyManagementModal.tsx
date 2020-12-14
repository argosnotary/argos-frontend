/*
 * Copyright (C) 2020 Argos Notary
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
import { connect } from "react-redux";
import styled, { css, ThemeContext } from "styled-components";

import { Warning } from "../../atoms/Alerts";
import { LoaderIcon, PlusIcon } from "../../atoms/Icons";
import { Modal, ModalBody, ModalButton, ModalFlexColumWrapper, ModalFooter } from "../../atoms/Modal";
import TransparentButton from "../../atoms/TransparentButton";

import PasswordView from "../../atoms/PasswordView";
import { FlexColumn } from "../../atoms/Flex";
import { CryptoExceptionWarning } from "../../molecules/CryptoExceptionWarning";
import { PublicKey, Token } from "../../api";
import { createKey, removePassword } from "../../redux/actions/keyActions";
import { Key } from "../../util/security";

export const CreateKeyButton = styled(TransparentButton)`
  margin: 1.3rem 0;
`;

enum WizardStates {
  Loading,
  Error,
  KeyOverrideWarning,
  CopyKey,
  CryptoError
}

export type Action<T> =
  | {
      type: "FETCH_INIT";
      isLoading: boolean;
    }
  | { type: "FETCH_SUCCESS"; isLoading: boolean; result: T }
  | { type: "FETCH_FAILURE"; isLoading: boolean; error: string };

export interface State {
  isLoading: boolean;
  key: PublicKey;
}

export type DataRequest = {
  cbSuccess: (arg: any) => void;
  cbFailure: (arg: any) => boolean;
  token?: Token;
  data?: any;
};

export function genericDataFetchReducer(state: State, action: Action<State>) {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        error: ""
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.result,
        error: "",
        isLoading: false
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
  }
}

function KeyManagementModal(props: any): JSX.Element {
  const { setDisplayModal, createKey, removePassword, createFirstKey, axiosApiCallCreateKey, theKey, loading } = props;
  const [wizardState, setWizardState] = useState(WizardStates.KeyOverrideWarning);
  const theme = useContext(ThemeContext);
  useEffect(() => {
    if (createFirstKey) {
      postKeyData();
    }
  }, [createFirstKey]);
  useEffect(() => {
    if (loading) {
      setWizardState(WizardStates.Loading);
    }
  }, [loading]);

  function postKeyData() {
    setWizardState(WizardStates.Loading);
    createKey(axiosApiCallCreateKey)
      .then(() => {
        setWizardState(WizardStates.CopyKey);
      })
      .catch((error: any) => setWizardState(WizardStates.CryptoError));
  }

  const getModalContent = (currentWizardState: number) => {
    const disableModal = () => {
      setDisplayModal(false);
      removePassword();
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
              <Warning message={"Existing key will be deactivated. Are you sure you want to continue?"} />
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
              <Warning message={"Could not connect to server. Please try again later."} />
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
              <PasswordView password={theKey.password} />
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
      default:
        return <h1>error in switch</h1>;
    }
  };
  return (
    <Modal>
      <ModalFlexColumWrapper>{getModalContent(wizardState)}</ModalFlexColumWrapper>
    </Modal>
  );
}

function mapStateToProps(state: any) {
  return {
    profile: state.profile,
    token: state.token,
    theKey: state.key,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  createKey,
  removePassword
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyManagementModal);
