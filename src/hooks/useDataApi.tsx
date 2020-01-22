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

import DataRequest from "../types/DataRequest";

const useDataApi = (
  reducer: Reducer<any, any>,
  initialDataRequest?: DataRequest
): [any, (initialDataRequest: DataRequest) => void] => {
  const [dataRequest, setDataRequest] = useState<DataRequest | undefined>(
    initialDataRequest
  );
  const [state, dispatch] = useReducer(reducer, { isLoading: false });

  useEffect(() => {
    if (dataRequest) {
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT", isLoading: true });
        try {
          const authorizationHeader = {
            Authorization: `Bearer ${dataRequest.token}`,
            "Content-Type": "application/json"
          };

          const requestConfig: AxiosRequestConfig = {
            headers: authorizationHeader
          };

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
          }

          const result = await axios(dataRequest.url, requestConfig);
          dispatch({
            isLoading: false,
            results: result.data,
            type: "FETCH_SUCCESS"
          });
        } catch (error) {
          dispatch({ type: "FETCH_FAILURE", isLoading: false, error });
        }
      };

      fetchData();
    }
  }, [dataRequest]);

  return [state, setDataRequest];
};

export default useDataApi;
