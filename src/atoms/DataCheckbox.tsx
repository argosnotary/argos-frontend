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
import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { LoaderIcon } from "./Icons";

interface CheckboxProps {
  disabledCheckbox?: boolean;
}

const Checkbox = styled.input<CheckboxProps>`
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

interface DataCheckboxComponentProps {
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

const DataCheckbox: React.FC<DataCheckboxComponentProps> = ({
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
