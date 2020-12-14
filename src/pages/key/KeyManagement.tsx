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
import styled, { css, ThemeContext } from "styled-components";

import { cryptoAvailable } from "../../util/security";

import { LoaderIcon, PlusIcon } from "../../atoms/Icons";
import TransparentButton from "../../atoms/TransparentButton";

import KeyContainer from "./KeyContainer";
import { NoCryptoWarning } from "../../molecules/NoCryptoWarning";
import { ConnectionErrorMessage } from "../../atoms/ConnectionError";
import { getActiveKey } from "./keySlice";
import KeyManagementModal from "./KeyManagementModal";
import { Panel } from "../../organisms/Panel";
import { FlexColumn } from "../../atoms/Flex";

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

const LoaderContainer = styled(FlexColumn)`
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export interface KeyManagementProps {
  createKey: any;
  getActiveKey: any;
  token: any;
  key: any;
  loading: boolean;
}

function KeyManagement(props: any) {
  const { getActiveKey, keyType, theKey, loading } = props;
  const [showError, setShowError] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const theme = useContext(ThemeContext);
  const createNewKey = () => {
    setDisplayModal(true);
  };

  useEffect(() => {
    getActiveKey(keyType);
  }, []);

  return (
    <Panel title={"Key management"}>
      {showError ? <ConnectionErrorMessage>Connection error try again later</ConnectionErrorMessage> : null}
      {loading ? (
        <LoaderContainer>
          <LoaderIcon size={32} color={theme.loaderIcon.color} />
        </LoaderContainer>
      ) : theKey ? (
        <KeyContainer
          theKey={theKey}
          clipboardIconSize={16}
          inputCss={copyInputCss}
          clipboardWrapperCss={clipboardWrapperCss}
          copyInputWrapperCss={copyInputWrapperCss}
        />
      ) : null}

      {displayModal ? <KeyManagementModal setDisplayModal={setDisplayModal} keyType={keyType} /> : null}
      {!cryptoAvailable() ? <NoCryptoWarning /> : null}
      {!displayModal && cryptoAvailable() ? (
        !theKey ? (
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
    </Panel>
  );
}

function mapStateToProps(state: any) {
  return {
    theKey: state.key.key,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  getActiveKey
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyManagement);
