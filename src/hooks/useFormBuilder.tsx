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
import { useFormik, FormikValues } from "formik";
import { useRef } from "react";
import IFormik from "../interfaces/IFormik";
import {
  IGenericFormSchema,
  IGenericFormInput
} from "../interfaces/IGenericFormSchema";
import FormInput from "../molecules/FormInput";
import FormTextArea from "../molecules/FormTextArea";
import { FormPermissions, FormPermission } from "../types/FormPermission";
import InputErrorLabel from "../atoms/InputErrorLabel";
import ContentSeparator from "../atoms/ContentSeparator";
import FlexRow from "../atoms/FlexRow";
import { LoaderButton, CancelButton } from "../atoms/Button";
import styled from "styled-components";
import FlexColumn from "../atoms/FlexColumn";

const CustomCancelButton = styled(CancelButton)`
  margin-left: 1rem;
`;

export enum FormSubmitButtonHandlerTypes {
  CLICK = "CLICK",
  MOUSEDOWN = "MOUSEDOWN"
}

type FormSubmitButtonHandlerType =
  | FormSubmitButtonHandlerTypes.CLICK
  | FormSubmitButtonHandlerTypes.MOUSEDOWN;

export const FormContainer = styled(FlexColumn)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

interface IFormApi {
  setInitialFormValues: (fields: { [x: string]: string }) => void;
  submitForm: () => void;
  isValid: boolean;
}

export interface IFormBuilderConfig {
  dataTesthookId?: string;
  schema: IGenericFormSchema;
  permission: FormPermission;
  validate: (values: any) => void;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
  isLoading: boolean;
  confirmationLabel?: string;
  cancellationLabel?: string;
  onChange?: (valid: boolean, values: any) => void;
  autoFocus?: boolean;
  buttonHandler: FormSubmitButtonHandlerType;
}

const useFormBuilder = (
  config: IFormBuilderConfig
): [React.ReactNode, IFormApi] => {
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values: any) => {
      formik.resetForm();
      config.onSubmit(values);
    },
    validate: config.validate
  });

  const firstTextInput: React.RefObject<HTMLInputElement> = useRef(null);
  const firstTextAreaInput: React.RefObject<HTMLTextAreaElement> = useRef(null);

  const api: IFormApi = {} as IFormApi;

  useEffect(() => {
    if (config.autoFocus) {
      if (firstTextInput.current) {
        firstTextInput.current.focus();
      }
      if (firstTextAreaInput.current) {
        firstTextAreaInput.current.focus();
      }
    }
  }, []);

  const disableInput = () => {
    if (config.isLoading) {
      return true;
    }

    return config.permission === FormPermissions.READ;
  };

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
                dataTesthookId={config.dataTesthookId + "-field-" + index}
                labelValue={entry.labelValue}
                name={entry.name}
                formType={entry.formType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[entry.name] || ""}
                disabled={disableInput()}
                {...(index === 0 ? { innerRef: firstTextInput } : null)}
              />
              {!config.isLoading &&
              formik.touched[entry.name] &&
              formik.errors[entry.name] ? (
                <InputErrorLabel>{formik.errors[entry.name]}</InputErrorLabel>
              ) : null}
            </React.Fragment>
          );
        case "textArea":
          return (
            <React.Fragment key={`${entry.name}-${index}`}>
              <FormTextArea
                dataTesthookId={config.dataTesthookId + "-field-" + index}
                labelValue={entry.labelValue}
                name={entry.name}
                formType={entry.formType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[entry.name] || ""}
                disabled={disableInput()}
                height={"25rem"}
                {...(index == 0 ? { innerRef: firstTextAreaInput } : null)}
              />
              {formik.touched[entry.name] && formik.errors[entry.name] ? (
                <InputErrorLabel>{formik.errors[entry.name]}</InputErrorLabel>
              ) : null}
            </React.Fragment>
          );
      }
    });
  };

  api.submitForm = () => {
    if (formik.isValid) {
      formik.submitForm();
    } else {
      const fields: any = {};
      config.schema.map(
        (entry: IGenericFormInput) => (fields[entry.name] = true)
      );

      formik.setTouched(fields);
    }
  };

  api.setInitialFormValues = (fields: { [x: string]: string }) => {
    formik.setValues(fields);
  };

  api.isValid = formik.isValid;

  const getRightSubmitButtonHandler = () => {
    if (config.buttonHandler === FormSubmitButtonHandlerTypes.CLICK) {
      return {
        onClick: () => api.submitForm()
      };
    }

    if (config.buttonHandler === FormSubmitButtonHandlerTypes.MOUSEDOWN) {
      return {
        onMouseDown: () => api.submitForm()
      };
    }
  };

  const form = (
    <FormContainer>
      <form
        data-testhook-id={config.dataTesthookId}
        onSubmit={() => {
          api.submitForm();
        }}
        onBlur={() => {
          if (config.onChange) {
            config.onChange(formik.isValid, formik.values);
          }
        }}>
        {renderFormElements(formik, config.schema)}
        {config.permission === FormPermissions.EDIT &&
        (config.confirmationLabel || config.cancellationLabel) ? (
          <>
            <ContentSeparator />
            <FlexRow>
              {config.confirmationLabel ? (
                <LoaderButton
                  dataTesthookId={config.dataTesthookId + "-submit-button"}
                  buttonType="button"
                  {...getRightSubmitButtonHandler()}
                  loading={config.isLoading}>
                  {config.confirmationLabel}
                </LoaderButton>
              ) : null}
              {config.cancellationLabel ? (
                <CustomCancelButton
                  data-testhook="cancel-button"
                  type="button"
                  onMouseDown={() => {
                    if (config.onCancel) {
                      config.onCancel();
                    }
                  }}>
                  {config.cancellationLabel}
                </CustomCancelButton>
              ) : null}
            </FlexRow>
          </>
        ) : null}
      </form>
    </FormContainer>
  );

  return [form, api];
};

export default useFormBuilder;
