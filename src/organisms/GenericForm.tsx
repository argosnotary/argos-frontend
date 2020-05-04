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
import styled from "styled-components";
import { useFormik, FormikValues } from "formik";

import FormInput from "../molecules/FormInput";
import FormTextArea from "../molecules/FormTextArea";
import InputErrorLabel from "../atoms/InputErrorLabel";
import { LoaderButton, CancelButton } from "../atoms/Button";
import ContentSeparator from "../atoms/ContentSeparator";
import { FormPermission, FormPermissions } from "../types/FormPermission";
import IFormik from "../interfaces/IFormik";
import FlexColumn from "../atoms/FlexColumn";
import FlexRow from "../atoms/FlexRow";

const CustomCancelButton = styled(CancelButton)`
  margin-left: 1rem;
`;

const FormContainer = styled(FlexColumn)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export interface IGenericFormInput {
  labelValue: string;
  name: string;
  formType: string;
}

export type IGenericFormSchema = Array<IGenericFormInput>;

interface IGenericForm {
  schema: IGenericFormSchema;
  permission: FormPermission;
  validate: (values: any) => void;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  confirmationLabel: string;
  cancellationLabel: string;
  initialValues: FormikValues;
  onValidChange?: (values: any) => void;
}

const GenericForm: React.FC<IGenericForm> = ({
  schema,
  permission,
  validate,
  onSubmit,
  onCancel,
  isLoading,
  confirmationLabel,
  cancellationLabel,
  initialValues,
  onValidChange
}) => {
  const formik = useFormik({
    initialValues,
    onSubmit: (values: any) => {
      onSubmit(values);
      formik.resetForm();
    },
    validate
  });
  useEffect(() => {
    formik.setValues(initialValues);
  }, [initialValues]);

  const renderFormElements = (
    formik: IFormik<FormikValues>,
    schema: IGenericFormSchema
  ) => {
    return schema.map((entry: IGenericFormInput, index) => {
      switch (entry.formType) {
        case "text":
        case "password":
          return (
            <React.Fragment key={`${entry.name}-${index}`}>
              <FormInput
                labelValue={entry.labelValue}
                name={entry.name}
                formType={entry.formType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[entry.name]}
                disabled={permission === FormPermissions.READ ? true : false}
              />
              {formik.touched[entry.name] && formik.errors[entry.name] ? (
                <InputErrorLabel>{formik.errors[entry.name]}</InputErrorLabel>
              ) : null}
            </React.Fragment>
          );
        case "textArea":
          return (
            <React.Fragment key={`${entry.name}-${index}`}>
              <FormTextArea
                labelValue={entry.labelValue}
                name={entry.name}
                formType={entry.formType}
                onInput={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[entry.name]}
                disabled={permission === FormPermissions.READ ? true : false}
                height={"25rem"}
              />
              {formik.touched[entry.name] && formik.errors[entry.name] ? (
                <InputErrorLabel>{formik.errors[entry.name]}</InputErrorLabel>
              ) : null}
            </React.Fragment>
          );
      }
    });
  };

  return (
    <FormContainer>
      <form
        onSubmit={formik.handleSubmit}
        onBlur={() => {
          if (onValidChange && formik.isValid) {
            onValidChange(formik.values);
          }
        }}
      >
        {renderFormElements(formik, schema)}
        {permission === FormPermissions.EDIT ? (
          <>
            <ContentSeparator />
            <FlexRow>
              <LoaderButton buttonType="submit" loading={isLoading}>
                {confirmationLabel}
              </LoaderButton>
              <CustomCancelButton
                data-testhook="cancel-button"
                type="button"
                onClick={() => onCancel()}
              >
                {cancellationLabel}
              </CustomCancelButton>
            </FlexRow>
          </>
        ) : null}
      </form>
    </FormContainer>
  );
};

export default GenericForm;
