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
