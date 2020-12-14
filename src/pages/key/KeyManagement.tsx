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
import axios, { AxiosResponse } from "axios";
import styled, { css, ThemeContext } from "styled-components";

import { cryptoAvailable, generateKey, Key } from "../../util/security";

import { Warning } from "../../atoms/Alerts";
import { LoaderIcon, PlusIcon } from "../../atoms/Icons";
import { Modal, ModalBody, ModalButton, ModalFlexColumWrapper, ModalFooter } from "../../atoms/Modal";
import PageHeader from "../../atoms/PageHeader";
import TransparentButton from "../../atoms/TransparentButton";

//import DataRequest from "../types/DataRequest";
//import useDataApi from "../hooks/useDataApi";
//import genericDataFetchReducer from "../stores/genericDataFetchReducer";
import PasswordView from "../../atoms/PasswordView";
import KeyContainer from "../../atoms/KeyContainer";
import { FlexColumn } from "../../atoms/Flex";
import { NoCryptoWarning } from "../../molecules/NoCryptoWarning";
import { CryptoExceptionWarning } from "../../molecules/CryptoExceptionWarning";
import { Configuration, KeyPair, PersonalAccountApi, PublicKey, Token } from "../../api";
import { getApiConfig } from "../../api/apiConfig";
import { ConnectionErrorMessage } from "../../atoms/ConnectionError";
import { ProxyTypeSet } from "immer/dist/internal";
import { RequiredError } from "../../api/base";
import { getActiveKey } from "../../redux/actions/keyActions";
import KeyManagementModal from "./KeyManagementModal";

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

export type Action<T> =
  | {
      type: "FETCH_INIT";
      isLoading: boolean;
    }
  | { type: "FETCH_SUCCESS"; isLoading: boolean; result: T }
  | { type: "FETCH_FAILURE"; isLoading: boolean; error: string };

export interface KeyManagementProps {
  createKey: any;
  getActiveKey: any;
  axiosApiCallActiveKey: any;
  token: any;
  key: any;
  loading: boolean;
}

function KeyManagement(props: any) {
  const { getActiveKey, axiosApiCallActiveKey, axiosApiCallCreateKey, theKey } = props;
  const publicKey = { keyId: theKey.keyId, publicKey: theKey.publicKey } || {};
  const [showError, setShowError] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const theme = useContext(ThemeContext);
  const createNewKey = () => {
    setDisplayModal(true);
  };

  useEffect(() => {
    if (theKey) {
      getActiveKey(axiosApiCallActiveKey);
    }
  }, []);
  return (
    <>
      <PageHeader>Key management</PageHeader>
      {showError ? <ConnectionErrorMessage>Connection error try again later</ConnectionErrorMessage> : null}
      {publicKey ? (
        <KeyContainer
          clipboardIconSize={16}
          inputCss={copyInputCss}
          clipboardWrapperCss={clipboardWrapperCss}
          copyInputWrapperCss={copyInputWrapperCss}
        />
      ) : null}

      {displayModal ? (
        <KeyManagementModal setDisplayModal={setDisplayModal} axiosApiCallCreateKey={axiosApiCallCreateKey} />
      ) : null}
      {!cryptoAvailable() ? <NoCryptoWarning /> : null}
      {!displayModal && cryptoAvailable() ? (
        !publicKey ? (
          <CreateKeyButton onClick={createNewKey}>
            <PlusIcon size={32} color={theme.keyManagementPage.iconColor} />
            Create new key
          </CreateKeyButton>
        ) : (
          <CreateKeyButton onClick={createNewKey}>
            <PlusIcon size={32} color={theme.keyManagementPage.iconColor} />
            Update key
          </CreateKeyButton>
        )
      ) : null}
    </>
  );
}

function mapStateToProps(state: any) {
  return {
    theKey: state.key,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  getActiveKey
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyManagement);
