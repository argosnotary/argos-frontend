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
import React, { useEffect, useState } from "react";

import LoginForm from "./LoginForm";
import axios from "axios";
import { OauthProviderApi, OAuthProvider } from "../../api/api";
import { getApiConfigUnauthenticated } from "../../api/apiConfig";

function LoginFormContainer(): JSX.Element {
  const [providers, setProviders] = useState<Array<OAuthProvider>>([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const api = new OauthProviderApi(getApiConfigUnauthenticated());

    api
      .getOAuthProviders()
      .then(response => {
        setProviders(response.data);
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          setShowError(true);
        }
      });

    return () => {
      source.cancel();
    };
  }, []);

  return <LoginForm showError={showError} providers={providers} />;
}

export default LoginFormContainer;
