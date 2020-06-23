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
import React, { useEffect } from "react";
import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";
import { FormPermissions } from "../../../../types/FormPermission";
import useFormBuilder, {
  IFormBuilderConfig,
  FormSubmitButtonHandlerTypes
} from "../../../../hooks/useFormBuilder";

export interface IXLDeployFormValues {
  username: string;
  password: string;
  applicationVersion: string;
}

const validateApprovalExecutionForm = (values: IXLDeployFormValues) => {
  const errors = {} as IXLDeployFormValues;

  if (!values.username) {
    errors.username = "Please fill in a username";
  }

  if (!values.password) {
    errors.password = "Please fill in a password";
  }

  if (!values.applicationVersion) {
    errors.applicationVersion = "Please fill in a application version.";
  } else if (
    !new RegExp("^[^\\\\/\\]\\[:|,*]+$").test(values.applicationVersion)
  ) {
    errors.applicationVersion =
      "Please enter only valid characters for the application version (no `/`, `\\`, `:`, `[`, `]`, `|`, `,` or `*`)";
  }

  return errors;
};

const getApprovalExecutionFormSchema = (): IGenericFormSchema => {
  return [
    {
      labelValue: "Username*",
      name: "username",
      formType: "text"
    },
    {
      labelValue: "Password*",
      name: "password",
      formType: "password"
    },
    {
      labelValue: "Application Version*",
      name: "applicationVersion",
      formType: "text"
    }
  ];
};

interface IXLDeployApprovalFormProps {
  index: number;
  validateNow: boolean;
  initialValues: IXLDeployFormValues;
  onUpdateExecutionValues: (
    formValues: IXLDeployFormValues,
    valid: boolean
  ) => void;
  onSubmit: () => void;
}

const XLDeployApprovalForm: React.FC<IXLDeployApprovalFormProps> = ({
  index,
  initialValues,
  validateNow,
  onUpdateExecutionValues,
  onSubmit
}) => {
  const formConfig: IFormBuilderConfig = {
    dataTesthookId: "xl-deploy-collector-execution-form-" + index,
    schema: getApprovalExecutionFormSchema(),
    permission: FormPermissions.EDIT,
    isLoading: false,
    validate: values => validateApprovalExecutionForm(values),
    onChange: (valid, form) => onUpdateExecutionValues(form, valid),
    onSubmit: form => {
      onUpdateExecutionValues(form, true);
      onSubmit();
    },
    confirmationLabel: "Next",
    autoFocus: true,
    buttonHandler: FormSubmitButtonHandlerTypes.MOUSEDOWN
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

  return <>{formJSX}</>;
};

export default XLDeployApprovalForm;
