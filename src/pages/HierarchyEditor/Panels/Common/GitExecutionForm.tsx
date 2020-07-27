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
import React, { useEffect, useState } from "react";

import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";
import { FormPermissions } from "../../../../types/FormPermission";
import useFormBuilder, {
  IFormBuilderConfig,
  FormSubmitButtonHandlerTypes
} from "../../../../hooks/useFormBuilder";
import Select, { SelectionContainer } from "../../../../atoms/Select";

export interface IGitFormValues {
  username?: string;
  password?: string;
  branch?: string;
  tag?: string;
  commitHash?: string;
}

const getBaseExecutionFormSchema = (): IGenericFormSchema => {
  return [
    {
      labelValue: "Username",
      name: "username",
      formType: "text"
    },
    {
      labelValue: "Password",
      name: "password",
      formType: "password"
    }
  ];
};

interface IGitExecutionFormProps {
  index: number;
  validateNow: boolean;
  initialValues: IGitFormValues;
  onUpdateExecutionValues: (formValues: IGitFormValues, valid: boolean) => void;
  onSubmit: () => void;
}

enum SearchOptionType {
  BRANCH = "BRANCH",
  TAG = "TAG",
  COMMIT_HASH = "COMMIT_HASH"
}

const determineInitialSearchOption = (
  initialValues: IGitFormValues
): SearchOptionType | "select" => {
  return initialValues.branch
    ? SearchOptionType.BRANCH
    : initialValues.tag
    ? SearchOptionType.TAG
    : initialValues.commitHash
    ? SearchOptionType.COMMIT_HASH
    : "select";
};

const GitExecutionForm: React.FC<IGitExecutionFormProps> = ({
  index,
  initialValues,
  validateNow,
  onUpdateExecutionValues,
  onSubmit
}) => {
  const [selectedSearchOption, setSelectedSearchOption] = useState<
    SearchOptionType | "select"
  >(determineInitialSearchOption(initialValues));

  const getExecutionFormSchema = (): IGenericFormSchema => {
    switch (selectedSearchOption) {
      case SearchOptionType.BRANCH:
        return [
          ...getBaseExecutionFormSchema(),
          {
            labelValue: "Branch*",
            name: "branch",
            formType: "text"
          }
        ];
      case SearchOptionType.TAG:
        return [
          ...getBaseExecutionFormSchema(),
          {
            labelValue: "Tag*",
            name: "tag",
            formType: "text"
          }
        ];
      case SearchOptionType.COMMIT_HASH:
        return [
          ...getBaseExecutionFormSchema(),
          {
            labelValue: "Commit hash*",
            name: "commitHash",
            formType: "text"
          }
        ];
    }

    return [];
  };

  const validateExecutionForm = (values: IGitFormValues) => {
    const errors = {} as IGitFormValues;
    switch (selectedSearchOption) {
      case SearchOptionType.BRANCH:
        if (!values.branch) {
          errors.branch = "Please fill in a branch name.";
        } else if (!new RegExp("^[^\\\\~^:?\\]*]*$").test(values.branch)) {
          errors.branch = "Please enter a valid branch name.";
        }
        break;
      case SearchOptionType.TAG:
        if (!values.tag) {
          errors.tag = "Please fill in a tag name.";
        } else if (!new RegExp("^[^\\\\~^:?\\]*]*$").test(values.tag)) {
          errors.tag = "Please enter a valid tag name.";
        }
        break;
      case SearchOptionType.COMMIT_HASH:
        if (!values.commitHash) {
          errors.commitHash = "Please fill in a commit hash.";
        } else if (
          !new RegExp("\\b[0-9a-f]{5,40}\\b").test(values.commitHash)
        ) {
          errors.commitHash = "Please enter a valid commit hash name.";
        }
        break;
    }

    return errors;
  };

  const selectSearchOptionType = (e: any) => {
    setSelectedSearchOption(e.target.value);
    onUpdateExecutionValues({}, false);
  };

  const formConfig: IFormBuilderConfig = {
    dataTesthookId: "git-collector-execution-form-" + index,
    schema: getExecutionFormSchema(),
    permission: FormPermissions.EDIT,
    isLoading: false,
    validate: values => validateExecutionForm(values),
    onChange: (valid, form) => onUpdateExecutionValues(form, valid),
    onSubmit: form => {
      if (selectedSearchOption !== "select") {
        onUpdateExecutionValues(form, true);
        onSubmit();
      }
    },
    confirmationLabel: "Next",
    autoFocus: true,
    buttonHandler: FormSubmitButtonHandlerTypes.MOUSEDOWN,
    alternateStyling: true
  };

  const [formJSX, formAPI] = useFormBuilder(formConfig);

  useEffect(() => {
    const values = initialValues as {};
    formAPI.setInitialFormValues(values);
  }, [initialValues]);

  useEffect(() => {
    if (validateNow) {
      formAPI.submitForm();
    }
  }, [validateNow]);

  return (
    <>
      <SelectionContainer>
        <label htmlFor={"git-collector-execution-form-select-" + index}>
          Collect based on:
        </label>
        <Select
          id={"git-collector-execution-form-select-" + index}
          onChange={selectSearchOptionType}
          value={selectedSearchOption}
          name="selectSearchOptionType">
          {selectedSearchOption === "select" ? (
            <option value={"select"}>select...</option>
          ) : null}
          <option value={SearchOptionType.BRANCH}>branch</option>
          <option value={SearchOptionType.TAG}>tag</option>
          <option value={SearchOptionType.COMMIT_HASH}>commit hash</option>
        </Select>
      </SelectionContainer>
      {formJSX}
    </>
  );
};

export default GitExecutionForm;
