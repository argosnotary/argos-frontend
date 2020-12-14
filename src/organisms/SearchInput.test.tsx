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
import React from "react";
import { mount } from "enzyme";

import theme from "../theme/base.json";

import SearchInput, { SearchResultEntry, CustomCancelButton, NoentriesFound } from "./SearchInput";
import { ThemeProvider } from "styled-components";
import SearchResult from "../model/SearchResult";
import { PersonalAccount } from "../api";

jest.mock("lodash/debounce", () => jest.fn(fn => fn));

const dummyBackendResults: Array<PersonalAccount> = [
  {
    id: "2",
    name: "Organa, L (Leah)"
  }
];

const onSelect = jest.fn((selection: PersonalAccount) => expect(selection).toEqual(dummyBackendResults[1]));

const onCancel = jest.fn();
const fetchData = jest.fn();

describe("SearchInput", () => {
  const root = mount(
    <ThemeProvider theme={theme}>
      <SearchInput
        entries={dummyBackendResults}
        onSelect={onSelect}
        onCancel={onCancel}
        fetchData={fetchData}
        loading={false}
        defaultLabel={"Search user"}
        onSelectLabel={"Selected user"}
        placeHolder={"placeholder"}
      />
    </ThemeProvider>
  );

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
