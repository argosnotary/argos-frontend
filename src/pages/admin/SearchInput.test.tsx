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
import React from "react";
import { mount } from "enzyme";

import theme from "../theme/base.json";

import SearchInput, {
  SearchResultEntry,
  NoResultsFound,
  CustomCancelButton
} from "./SearchInput";
import { ThemeProvider } from "styled-components";
import SearchResult from "../model/SearchResult";

jest.mock("lodash/debounce", () => jest.fn(fn => fn));

const dummyBackendResults: Array<SearchResult> = [
  {
    id: "1",
    displayLabel: "Skywalker, L (Luke)"
  },
  {
    id: "2",
    displayLabel: "Organa, L (Leah)"
  }
];

const onSelect = jest.fn((selection: SearchResult) =>
  expect(selection).toEqual(dummyBackendResults[1])
);

const onCancel = jest.fn();
const fetchData = jest.fn();
const onChange = jest.fn();

describe("SearchInput", () => {
  const root = mount(
    <ThemeProvider theme={theme}>
      <SearchInput
        results={dummyBackendResults}
        onSelect={onSelect}
        onCancel={onCancel}
        fetchData={fetchData}
        isLoading={false}
        defaultLabel={"Search user"}
        onSelectLabel={"Selected user"}
        placeHolder={"placeholder"}
      />
    </ThemeProvider>
  );

  it("displays search results based on user input", () => {
    root.find("input").simulate("change", { target: { value: "Luke" } });
    root.update();

    expect(root.find(SearchResultEntry).text()).toEqual("Skywalker, L (Luke)");
  });

  it("displays no results found text on failed query", () => {
    root.find("input").simulate("change", { target: { value: "Darth" } });
    root.update();

    expect(root.find(NoResultsFound).length).toBe(0);
  });

  it("calls onSelect callback and passes selection when search entry is clicked", () => {
    root.find("input").simulate("change", { target: { value: "Leah" } });
    root.update();
    root.find(SearchResultEntry).simulate("click");

    expect(onSelect).toHaveBeenCalled();
  });

  it("calls onCancel callback when cancel button is clicked", () => {
    root.find(CustomCancelButton).simulate("click");

    expect(onCancel).toHaveBeenCalled();
  });
});
