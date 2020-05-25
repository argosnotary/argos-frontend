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
import React, { useEffect, useRef } from "react";
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
  labelValue?: string;
  name: string;
  formType: string;
}

export type IGenericFormSchema = Array<IGenericFormInput>;

interface IGenericForm {
  dataTesthookId?: string;
  schema: IGenericFormSchema;
  permission: FormPermission;
  validate: (values: any) => void;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
  isLoading: boolean;
  confirmationLabel?: string;
  cancellationLabel?: string;
  initialValues: FormikValues;
  onChange?: (valid: boolean, values: any) => void;
  autoFocus?: boolean;
}

const GenericForm: React.FC<IGenericForm> = ({
  dataTesthookId,
  schema,
  permission,
  validate,
  onSubmit,
  onCancel,
  isLoading,
  confirmationLabel,
  cancellationLabel,
  initialValues,
  autoFocus,
  onChange
}) => {
  const formik = useFormik({
    initialValues,
    onSubmit: (values: any) => {
      formik.resetForm();
      onSubmit(values);
    },
    validate
  });

  const firstTextInput: React.RefObject<HTMLInputElement> = useRef(null);
  const firstTextAreaInput: React.RefObject<HTMLTextAreaElement> = useRef(null);

  useEffect(() => {
    formik.setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (autoFocus) {
      if (firstTextInput.current) {
        firstTextInput.current.focus();
      }
      if (firstTextAreaInput.current) {
        firstTextAreaInput.current.focus();
      }
    }
  }, []);

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
                dataTesthookId={dataTesthookId + "-field-" + index}
                labelValue={entry.labelValue}
                name={entry.name}
                formType={entry.formType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[entry.name] || ""}
                disabled={permission === FormPermissions.READ}
                {...(index === 0 ? { innerRef: firstTextInput } : null)}
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
                dataTesthookId={dataTesthookId + "-field-" + index}
                labelValue={entry.labelValue}
                name={entry.name}
                formType={entry.formType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[entry.name] || ""}
                disabled={permission === FormPermissions.READ}
                height={"25rem"}
                {...(index == 0 ? { innerRef: firstTextAreaInput } : null)}
              />
              {formik.touched[entry.name] ||
              (!formik.dirty && formik.errors[entry.name]) ? (
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
        data-testhook-id={dataTesthookId}
        onSubmit={formik.handleSubmit}
        onBlur={() => {
          if (onChange) {
            onChange(formik.isValid, formik.values);
          }
        }}>
        {renderFormElements(formik, schema)}
        {permission === FormPermissions.EDIT &&
        (confirmationLabel || cancellationLabel) ? (
          <>
            <ContentSeparator />
            <FlexRow>
              {confirmationLabel ? (
                <LoaderButton buttonType="submit" loading={isLoading}>
                  {confirmationLabel}
                </LoaderButton>
              ) : null}
              {cancellationLabel ? (
                <CustomCancelButton
                  data-testhook="cancel-button"
                  type="button"
                  onMouseDown={() => {
                    if (onCancel) {
                      onCancel();
                    }
                  }}>
                  {cancellationLabel}
                </CustomCancelButton>
              ) : null}
            </FlexRow>
          </>
        ) : null}
      </form>
    </FormContainer>
  );
};

export default GenericForm;
