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
import React from "react";

import styled, { css } from "styled-components";
import CopyInput from "./CopyInput";
import FlexRow from "./FlexRow";
import FormInput from "../molecules/FormInput";
import InputErrorLabel from "./InputErrorLabel";
import FlexColumn from "./FlexColumn";
import SearchInput from "./SearchInput";
import TextArea from "./TextArea";

export default {
  title: "Inputs",
};

const inputCss = css`
  margin: 0.75rem 1rem;
  color: ${(props) => props.theme.keyManagementPage.passwordColor};
  font-size: 1.2rem;
  border: none;
  outline: none;
  max-width: 14rem;
  text-align: center;
`;

const clipboardWrapperCss = css`
  padding: 0.4rem 0.5rem 0.3rem;
`;

const CopyInputContainer = styled(FlexRow)`
  display: inline-flex;
  width: 20.625rem;
  padding: 0.5rem 1rem;
  border: 1px solid gray;
  justify-content: space-evenly;
`;

export const copyInput = () => (
  <CopyInputContainer>
    <CopyInput
      value={"This value will be copied"}
      inputCss={inputCss}
      clipboardWrapperCss={clipboardWrapperCss}
      clipboardIconSize={24}
    />
  </CopyInputContainer>
);

const FormInputContainer = styled(FlexRow)``;

export const formInput = () => (
  <>
    <FormInputContainer>
      <FormInput
        labelValue="Input label*"
        name="label"
        formType="text"
        defaultValue={"defaultValue"}
      />
    </FormInputContainer>
    <FormInputContainer>
      <FlexColumn>
        <FormInput
          labelValue="Input label*"
          name="label"
          formType="text"
          defaultValue={"defaultValue"}
        />
        <InputErrorLabel>Please fill in a value.</InputErrorLabel>
      </FlexColumn>
    </FormInputContainer>
  </>
);

const dummySearchData = [
  {
    id: 1,
    displayLabel: "Luke Skywalker",
  },
  {
    id: 2,
    displayLabel: "Leah Organa",
  },
  {
    id: 3,
    displayLabel: "Han Solo",
  },
];

export const searchInput = () => (
  <FormInputContainer>
    <SearchInput
      results={dummySearchData}
      onSelect={(selectedSearchResult) => {
        alert(selectedSearchResult.displayLabel);
      }}
      onCancel={() => alert("cancelled")}
      fetchData={(_searchQuery) => {
        return dummySearchData;
      }}
      isLoading={false}
      defaultLabel={"Search user"}
      onSelectLabel={"Selected user"}
    />
  </FormInputContainer>
);

export const textArea = () => <TextArea />;
