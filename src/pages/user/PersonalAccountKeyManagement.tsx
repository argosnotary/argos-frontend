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
import React, { Reducer, useEffect, useReducer, useState } from "react";
import styled from "styled-components";

import TransparentButton from "../../atoms/TransparentButton";
import { KeyPair, PersonalAccountApi, PublicKey, Token } from "../../api";
import { getApiConfig } from "../../api/apiConfig";
import KeyManagement from "../key/KeyManagement";
import { Key } from "../../util/security";

export const CreateKeyButton = styled(TransparentButton)`
  margin: 1.3rem 0;
`;

const getAxiosApiCallActiveKey = (token: Token) => {
  const api = new PersonalAccountApi(getApiConfig(token.token));
  return api.getKeyPair();
};

const getAxiosApiCallCreateKey = (token: Token, key: KeyPair) => {
  const api = new PersonalAccountApi(getApiConfig(token.token));
  return api.createKey({
    keyId: key.keyId,
    publicKey: key.publicKey,
    encryptedPrivateKey: key.encryptedPrivateKey
  });
};

function PersonalAccountKeyManagement(props: any) {
  return (
    <KeyManagement axiosApiCallCreateKey={getAxiosApiCallCreateKey} axiosApiCallActiveKey={getAxiosApiCallActiveKey} />
  );
}

export default PersonalAccountKeyManagement;
