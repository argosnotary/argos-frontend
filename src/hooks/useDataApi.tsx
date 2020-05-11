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

import axios, { AxiosRequestConfig } from "axios";
import { Reducer, useEffect, useReducer, useState } from "react";

import Action from "../types/Action";
import DataRequest from "../types/DataRequest";
import { useRequestErrorStore } from "../stores/requestErrorStore";
import { useHistory } from "react-router-dom";

function useDataApi<S, T>(
  reducer: Reducer<S, Action<T>>,
  initialDataRequest?: DataRequest
): [S, (initialDataRequest: DataRequest) => void, DataRequest | undefined] {
  const [dataRequest, setDataRequest] = useState<DataRequest | undefined>(
    initialDataRequest
  );
  const [state, dispatch] = useReducer(reducer, {} as S);
  const history = useHistory();
  const [_error, setError] = useRequestErrorStore();

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (dataRequest) {
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT", isLoading: true });
        const authorizationHeader = {
          Authorization: `Bearer ${dataRequest.token}`,
          "Content-Type": "application/json",
        };

        const requestConfig: AxiosRequestConfig = {
          headers: authorizationHeader,
          cancelToken: source.token,
        };

        if (dataRequest.params) {
          requestConfig["params"] = dataRequest.params;
        }

        switch (dataRequest.method) {
          case "get": {
            const methodKey = "method";
            requestConfig[methodKey] = "get";
            break;
          }
          case "post": {
            const methodKey = "method";
            const dataKey = "data";
            requestConfig[methodKey] = "post";
            requestConfig[dataKey] = dataRequest.data;
            break;
          }

          case "put": {
            const methodKey = "method";
            const dataKey = "data";
            requestConfig[methodKey] = "put";
            requestConfig[dataKey] = dataRequest.data;
            break;
          }
        }

        try {
          const result = await axios(dataRequest.url, requestConfig);

          dispatch({
            isLoading: false,
            results: result.data,
            type: "FETCH_SUCCESS",
          });

          if (dataRequest.cbSuccess) {
            dataRequest.cbSuccess(result.data);
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            if (error.response && error.response.status === 401) {
              history.push("/login");
            }
            dispatch({ type: "FETCH_FAILURE", isLoading: false, error });
            if (dataRequest.cbFailure) {
              if (!dataRequest.cbFailure(error)) {
                setError(error);
              }
            } else {
              setError(error);
            }
          }
        }
      };

      fetchData();
    }

    return () => {
      source.cancel();
    };
  }, [dataRequest]);

  return [state, setDataRequest, dataRequest];
}

export default useDataApi;
