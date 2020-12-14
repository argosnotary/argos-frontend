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
import React, { useState, useEffect, useContext } from "react";
import styled, { ThemeContext } from "styled-components";

import FormInput from "../molecules/FormInput";
import { FlexColumn, FlexRow } from "../atoms/Flex";
import { CancelButton } from "../atoms/Button";
import { LoaderIcon } from "../atoms/Icons";

import debounce from "lodash/debounce";
import InputLabel from "../atoms/InputLabel";
import { PersonalAccount } from "../api";

const SearchEntries = styled.ul`
  border: 1px solid ${props => props.theme.searchInput.searchEntriesBorderColor};
  border-radius: 3px;
  margin: -1rem 0 0;
  max-height: 16rem;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  background: ${props => props.theme.searchInput.searchEntriesBgColor};
  box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.1), inset 0px 2px 3px 0px rgba(10, 10, 10, 0.1);
  z-index: 4;
`;

export const SearchResultEntry = styled.li`
  padding: 1rem;

  &:hover {
    background: ${props => props.theme.searchInput.searchResultEntryHoverBg};
    cursor: pointer;
  }
`;

export const NoentriesFound = styled.li`
  padding: 1rem;
`;

const SelectedEntry = styled.p`
  flex: 1 1 auto;
  margin: 0 0 1rem;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.searchInput.selectedEntryBorderColor};
`;

const SearchFormContainer = styled.div`
  position: relative;
`;

const SelectionContainer = styled(FlexRow)`
  justify-content: space-between;
`;

export const CustomCancelButton = styled(CancelButton)`
  margin-left: 1rem;
`;

interface SearchInputProps {
  entries: Array<PersonalAccount>;
  onSelect: (res: PersonalAccount) => void;
  onCancel: () => void;
  fetchData: (searchQuery: string) => void;
  loading: boolean;
  onSelectLabel: string;
  defaultLabel: string;
  placeHolder: string;
}

function SearchInput(props: SearchInputProps): React.ReactElement {
  const { entries, onSelect, onCancel, fetchData, loading, onSelectLabel, defaultLabel, placeHolder } = props;
  const [displayentries, setDisplayentries] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState(false);
  const [queryFetched, setQueryFetched] = useState("");

  const theme = useContext(ThemeContext);

  useEffect(() => {
    setQueryFetched(inputValue);
  }, [entries]);

  const onChange = debounce((value: string) => {
    setDisplayentries(true);
    setInputValue(value);
    setSelected(false);
    if (value === "") {
      setDisplayentries(false);
      setQueryFetched("");
    } else if (value.length !== queryFetched.length || value !== queryFetched) {
      setQueryFetched(value);
      fetchData(value);
    }
  }, 250);

  return (
    <SearchFormContainer>
      {selected ? (
        <FlexColumn>
          <InputLabel>{onSelectLabel}</InputLabel>
          <SelectionContainer>
            <SelectedEntry>{inputValue}</SelectedEntry>
            <CustomCancelButton
              onClick={() => {
                setSelected(false);
                onCancel();
              }}
              type="button">
              Cancel
            </CustomCancelButton>
          </SelectionContainer>
        </FlexColumn>
      ) : (
        <form autoComplete="off">
          <FormInput
            formType={"text"}
            labelValue={defaultLabel}
            placeHolder={placeHolder}
            name="searchInput"
            onChange={e => {
              onChange(e.target.value);
            }}
          />
          {displayentries ? (
            <SearchEntries>
              {loading ? (
                <SearchResultEntry>
                  <LoaderIcon size={32} color={theme.searchInput.loaderIconColor} />
                </SearchResultEntry>
              ) : (
                <>
                  {!entries || entries.length === 0 ? (
                    <NoentriesFound>No entries found</NoentriesFound>
                  ) : (
                    entries.map(res => (
                      <SearchResultEntry
                        onClick={() => {
                          onSelect(res);
                          setSelected(true);
                          setInputValue(res.name ? res.name : "");
                          setDisplayentries(false);
                        }}
                        key={res.id}>
                        {res.name}
                      </SearchResultEntry>
                    ))
                  )}
                </>
              )}
            </SearchEntries>
          ) : null}
        </form>
      )}
    </SearchFormContainer>
  );
}

export default SearchInput;
