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

import { act, renderHook } from "@testing-library/react-hooks";
import axios from "axios";

import MockAdapter from "axios-mock-adapter";

import DataRequest from "../types/DataRequest";
import useDataApi from "./useDataApi";
import { customGenericDataFetchReducer } from "../stores/genericDataFetchReducer";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn()
  })
}));

interface ITestResponse {
  message: string;
}

interface ITestState {
  isLoading: boolean;
  data: ITestResponse;
}

const mock = new MockAdapter(axios);
const mockUrl = "http://mock";

describe("useDataApi hook", () => {
  it("fetches data on mount when url is specified at hook initialization", async () => {
    const dataRequest: DataRequest = {
      method: "get",
      url: mockUrl
    };

    mock.onGet(mockUrl).reply(200, {
      message: "Hello World"
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataApi<ITestState, ITestResponse>(
        customGenericDataFetchReducer,
        dataRequest
      )
    );

    await waitForNextUpdate();

    expect(result.current[0].data).toEqual({
      message: "Hello World"
    });
  });

  it("fetch no data when no url is specified at the time of hook initialization", async () => {
    const { result } = renderHook(() =>
      useDataApi<ITestState, ITestResponse>(customGenericDataFetchReducer)
    );

    expect(result.current[0]).toEqual({});
  });

  it("fetches data when new url is set", async () => {
    const dataRequest: DataRequest = {
      method: "get",
      url: mockUrl
    };

    mock.onGet(mockUrl).reply(200, {
      message: "Hello World"
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataApi<ITestState, ITestResponse>(
        customGenericDataFetchReducer,
        dataRequest
      )
    );

    act(() => {
      result.current[1](dataRequest);
    });
    await waitForNextUpdate();

    expect(result.current[0].data).toEqual({
      message: "Hello World"
    });
  });

  it("posts data when post method is specified", async () => {
    const dataRequest: DataRequest = {
      data: { id: 1 },
      method: "post",
      url: mockUrl
    };

    mock.onPost(mockUrl).reply(200, {
      success: true
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataApi<ITestState, ITestResponse>(
        customGenericDataFetchReducer,
        dataRequest
      )
    );

    act(() => {
      result.current[1](dataRequest);
    });

    await waitForNextUpdate();

    expect(result.current[0].data).toEqual({
      success: true
    });
  });
});
