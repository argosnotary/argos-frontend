/*
 * Argos Notary - A new way to secure the Software Supply Chain
 *
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 * Copyright (C) 2019 - 2021 Gerard Borst <gerard.borst@argosnotary.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import styled, { ThemeContext } from "styled-components";

import { Warning } from "../../atoms/Alerts";
import { LoaderIcon } from "../../atoms/Icons";
import { Modal, ModalBody, ModalButton, ModalFlexColumWrapper, ModalFooter } from "../../atoms/Modal";
import TransparentButton from "../../atoms/TransparentButton";

import PasswordView from "../../atoms/PasswordView";
import { CryptoExceptionWarning } from "../../molecules/CryptoExceptionWarning";
import { createKey, removePasswordFromKey } from "./keySlice";

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

function KeyManagementModal(props: any): JSX.Element {
  const { setDisplayModal, createKey, removePasswordFromKey, createFirstKey, keyType, theKey, loading } = props;
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
    createKey(keyType)
      .then(() => {
        setWizardState(WizardStates.CopyKey);
      })
      .catch(() => setWizardState(WizardStates.CryptoError));
  }

  const getModalContent = (currentWizardState: number) => {
    const disableModal = () => {
      setDisplayModal(false);
      removePasswordFromKey();
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
  removePasswordFromKey
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyManagementModal);
