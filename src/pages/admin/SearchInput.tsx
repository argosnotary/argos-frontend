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
import React, { useState, useEffect, useContext } from "react";
import styled, { ThemeContext } from "styled-components";

import SearchResult from "../../model/SearchResult";
import FormInput from "../../molecules/FormInput";
import { FlexColumn, FlexRow } from "../../atoms/Flex";
import { CancelButton } from "../../atoms/Button";
import { LoaderIcon } from "../../atoms/Icons";

import debounce from "lodash/debounce";
import InputLabel from "../../atoms/InputLabel";

const SearchEntries = styled.ul`
  border: 1px solid ${props => props.theme.searchInput.searchentriesBorderColor};
  border-radius: 3px;
  margin: -1rem 0 0;
  max-height: 16rem;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  background: ${props => props.theme.searchInput.searchentriesBgColor};
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
  entries: Array<SearchResult>;
  onSelect: (res: SearchResult) => void;
  onCancel: () => void;
  fetchData: (searchQuery: string) => void;
  isLoading: boolean;
  onSelectLabel: string;
  defaultLabel: string;
  placeHolder: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  entries,
  onSelect,
  onCancel,
  fetchData,
  isLoading,
  onSelectLabel,
  defaultLabel,
  placeHolder
}) => {
  const [displayentries, setDisplayentries] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState(false);
  const [queryFetched, setQueryFetched] = useState("");

  const theme = useContext(ThemeContext);

  useEffect(() => {
    setQueryFetched(inputValue);
  }, [entries]);

  const onChange = debounce(event => {
    const value = event.target.value;
    setDisplayentries(true);
    setInputValue(value);
    setSelected(false);

    if (value.length < queryFetched.length && value.length > 0) {
      setQueryFetched(value);
      fetchData(value);
    }

    if (value === "") {
      setDisplayentries(false);
      setQueryFetched("");
    }

    if (queryFetched === "") {
      setQueryFetched(value);
      fetchData(value);
    }
  }, 250);

  const entriesFilter = (entry: any) => {
    if (entry.displayLabel.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) {
      return entry;
    }
  };

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
            onChange={onChange}
          />
          {displayentries ? (
            <SearchEntries>
              {isLoading ? (
                <SearchResultEntry>
                  <LoaderIcon size={32} color={theme.searchInput.loaderIconColor} />
                </SearchResultEntry>
              ) : (
                <>
                  {entries && entries.filter(entry => entriesFilter(entry)).length === 0 ? (
                    <NoentriesFound>No entries found</NoentriesFound>
                  ) : null}
                  {entries &&
                    entries
                      .filter(entry => entriesFilter(entry))
                      .map(res => (
                        <SearchResultEntry
                          onClick={() => {
                            onSelect(res);
                            setSelected(true);
                            setInputValue(res.displayLabel);
                            setDisplayentries(false);
                          }}
                          key={res.id}>
                          {res.displayLabel}
                        </SearchResultEntry>
                      ))}
                </>
              )}
            </SearchEntries>
          ) : null}
        </form>
      )}
    </SearchFormContainer>
  );
};

export default SearchInput;
