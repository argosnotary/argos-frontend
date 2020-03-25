import React from "react";
import { mount } from "enzyme";

import theme from "../theme/base.json";

import SearchInput, {
  SearchResultEntry,
  NoResultsFound,
  CustomCancelButton
} from "./SearchInput";
import { ThemeProvider } from "styled-components";
import ISearchResult from "../interfaces/ISearchResult";

jest.mock("lodash/debounce", () => jest.fn(fn => fn));

const dummyBackendResults: Array<ISearchResult> = [
  {
    id: "1",
    displayLabel: "Skywalker, L (Luke)"
  },
  {
    id: "2",
    displayLabel: "Organa, L (Leah)"
  }
];

const onSelect = jest.fn((selection: ISearchResult) =>
  expect(selection).toEqual(dummyBackendResults[1])
);

const onCancel = jest.fn();
const fetchData = jest.fn();

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

    expect(root.find(NoResultsFound).length).toBe(1);
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
