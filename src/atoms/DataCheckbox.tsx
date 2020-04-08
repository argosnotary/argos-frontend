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
import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { LoaderIcon } from "./Icons";

interface ICheckboxProps {
  disabledCheckbox?: boolean;
}

const Checkbox = styled.input<ICheckboxProps>`
  position: relative;
  top: 1px;
  margin: 0 1rem 0 0;
  pointer-events: ${props => (props.disabledCheckbox ? "none" : "auto")};
  opacity: ${props => (props.disabledCheckbox ? "0.5" : "1")};
`;

const CheckboxLoaderContainer = styled.div`
  position: relative;
  top: 3px;
  margin: 0 0.75rem 0 0;
`;

interface IDataCheckboxComponentProps {
  initialCheckedValue: boolean;
  type: string;
  name: string;
  value: string;
  id: string;
  parentIsLoading: boolean;
  parentPutError: boolean;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DataCheckbox: React.FC<IDataCheckboxComponentProps> = ({
  initialCheckedValue,
  type,
  name,
  value,
  id,
  parentIsLoading,
  parentPutError,
  onChange,
  disabled
}) => {
  const [currentlyPostingData, setCurrentlyPostingData] = useState(false);
  const [checked, setChecked] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    setChecked(initialCheckedValue);
  }, []);

  useEffect(() => {
    if (!parentIsLoading) {
      setCurrentlyPostingData(false);
    }

    if (currentlyPostingData && parentPutError) {
      setChecked(!checked);
    }
  }, [parentIsLoading]);

  if (currentlyPostingData) {
    return (
      <CheckboxLoaderContainer>
        <LoaderIcon color={theme.dataCheckbox.loaderColor} size={16} />
      </CheckboxLoaderContainer>
    );
  }

  return (
    <Checkbox
      disabledCheckbox={disabled}
      checked={checked}
      type={type}
      name={name}
      value={value}
      id={id}
      onChange={event => {
        if (!disabled) {
          setCurrentlyPostingData(true);
          setChecked(!checked);
          onChange(event);
        }
      }}
    />
  );
};

export default DataCheckbox;
