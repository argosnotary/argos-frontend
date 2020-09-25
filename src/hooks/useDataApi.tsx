/*
 * Copyright (C) 2020 Argos Notary Coöperatie UA
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
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { Reducer, useEffect, useReducer, useState } from "react";

import Action from "../types/Action";
import DataRequest from "../types/DataRequest";
import { useRequestErrorStore } from "../stores/requestErrorStore";
import { TokenActionType, useUserProfileContext } from "../stores/UserProfile";

export const createRequestConfig = (
  token: string,
  source: CancelTokenSource
) => {
  const authorizationHeader = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const requestConfig: AxiosRequestConfig = {
    headers: authorizationHeader,
    cancelToken: source.token
  };
  return requestConfig;
};

function useDataApi<S, T>(
  reducer: Reducer<S, Action<T>>,
  initialDataRequest?: DataRequest
): [S, (initialDataRequest: DataRequest) => void, DataRequest | undefined] {
  const [dataRequest, setDataRequest] = useState<DataRequest | undefined>(
    initialDataRequest
  );
  const [state, dispatch] = useReducer(reducer, {} as S);
  const [_error, setError] = useRequestErrorStore();

  const userProfileContext = useUserProfileContext();

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (dataRequest) {
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT", isLoading: true });
        const requestConfig = createRequestConfig(
          userProfileContext.token,
          source
        );

        if (dataRequest.params) {
          requestConfig["params"] = dataRequest.params;
        }
        requestConfig.method = dataRequest.method;
        switch (dataRequest.method) {
          case "post":
          case "put": {
            requestConfig.data = dataRequest.data;
            break;
          }
        }
        await doCall(dataRequest, requestConfig, source, true);
      };

      fetchData();
    }

    return () => {
      source.cancel();
    };
  }, [dataRequest]);

  const doCall = async (
    request: DataRequest,
    requestConfig: AxiosRequestConfig,
    source: CancelTokenSource,
    refreshTokenIfNeeded: boolean
  ) => {
    try {
      const result = await axios(request.url, requestConfig);

      dispatch({
        isLoading: false,
        results: result.data,
        type: "FETCH_SUCCESS"
      });

      if (request.cbSuccess) {
        request.cbSuccess(result.data);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        if (error.response && error.response.status === 401) {
          if (
            refreshTokenIfNeeded &&
            error.response.data &&
            error.response.data.message &&
            error.response.data.message === "refresh token"
          ) {
            refreshToken(request, source, requestConfig);
          } else {
            userProfileContext.doTokenAction({
              type: TokenActionType.LOGOUT,
              token: null
            });
          }
        } else {
          dispatch({ type: "FETCH_FAILURE", isLoading: false, error });
          if (request.cbFailure) {
            if (!request.cbFailure(error)) {
              setError(error);
            }
          } else {
            setError(error);
          }
        }
      }
    }
  };

  const refreshToken = async (
    request: DataRequest,
    source: CancelTokenSource,
    requestConfig: AxiosRequestConfig
  ) => {
    try {
      const refreshRequestConfig = createRequestConfig(
        userProfileContext.token,
        source
      );
      refreshRequestConfig.method = "get";
      const newTokenResponse = await axios(
        "/api/personalaccount/me/refresh",
        refreshRequestConfig
      );
      userProfileContext.doTokenAction({
        type: TokenActionType.REFRESH,
        token: newTokenResponse.data.token
      });
      const originalDataRequest = createRequestConfig(
        newTokenResponse.data.token,
        source
      );
      originalDataRequest.method = requestConfig.method;
      originalDataRequest.data = requestConfig.data;
      originalDataRequest.params = requestConfig.params;
      doCall(request, originalDataRequest, source, false);
    } catch (e) {
      userProfileContext.doTokenAction({
        type: TokenActionType.LOGOUT,
        token: null
      });
    }
  };

  return [state, setDataRequest, dataRequest];
}

export default useDataApi;
