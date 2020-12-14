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
import React, { useEffect } from "react";
import { useFormik, FormikValues } from "formik";
import { useRef } from "react";
import Formik from "../model/Formik";
import { GenericFormSchema, GenericFormInput } from "../model/GenericFormSchema";
import FormInput from "../molecules/FormInput";
import FormTextArea from "../molecules/FormTextArea";
import { FormPermission } from "./FormPermission";
import InputErrorLabel from "../atoms/InputErrorLabel";
import ContentSeparator from "../atoms/ContentSeparator";
import { FlexRow, FlexColumn } from "../atoms/Flex";
import { LoaderButton, CancelButton } from "../atoms/Button";
import styled from "styled-components";
import FormSelect from "../molecules/FormSelect";

const CustomCancelButton = styled(CancelButton)`
  margin-left: 1rem;
`;

export enum FormSubmitButtonHandlerTypes {
  CLICK = "CLICK",
  MOUSEDOWN = "MOUSEDOWN"
}

type FormSubmitButtonHandlerType = FormSubmitButtonHandlerTypes.CLICK | FormSubmitButtonHandlerTypes.MOUSEDOWN;

interface IFormContainerProps {
  alternateStyling: boolean | undefined;
}

export const FormContainer = styled(FlexColumn)<IFormContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${props =>
    props.alternateStyling
      ? `
    background: ${props.theme.forms.alternateBgColor};
    padding: 1rem;
    `
      : null}
`;

interface FormApi {
  setInitialFormValues: (fields: { [x: string]: string }) => void;
  submitForm: () => void;
  isValid: boolean;
  handleChange: any;
}

export interface FormBuilderConfig {
  dataTesthookId?: string;
  schema: GenericFormSchema;
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
  alternateStyling?: boolean | undefined;
}

const useFormBuilder = (config: FormBuilderConfig): [React.ReactNode, FormApi] => {
  const formik = useFormik({
    initialValues: {} as FormikValues,
    onSubmit: (values: any) => {
      formik.resetForm();
      config.onSubmit(values);
    },
    validate: config.validate
  });

  const firstTextInput: React.RefObject<HTMLInputElement> = useRef(null);
  const firstTextAreaInput: React.RefObject<HTMLTextAreaElement> = useRef(null);
  const firstSelectInput: React.RefObject<HTMLSelectElement> = useRef(null);

  const api: FormApi = {} as FormApi;

  useEffect(() => {
    if (config.autoFocus) {
      if (firstTextInput.current) {
        firstTextInput.current.focus();
      }
      if (firstTextAreaInput.current) {
        firstTextAreaInput.current.focus();
      }
      if (firstSelectInput.current) {
        firstSelectInput.current.focus();
      }
    }
  }, []);

  const disableInput = () => {
    if (config.isLoading) {
      return true;
    }

    return config.permission === FormPermission.READ;
  };

  const renderFormElements = (formik: Formik<FormikValues>, schema: GenericFormSchema) => {
    return schema.map((entry: GenericFormInput, index) => {
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
                onChange={api.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[entry.name] || ""}
                disabled={disableInput()}
                {...(index === 0 ? { innerRef: firstTextInput } : null)}
              />
              {!config.isLoading && formik.touched[entry.name] && formik.errors[entry.name] ? (
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
                onChange={api.handleChange}
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
        case "select":
          return (
            <React.Fragment key={`${entry.name}-${index}`}>
              <FormSelect
                dataTesthookId={config.dataTesthookId + "-field-" + index}
                labelValue={entry.labelValue}
                name={entry.name}
                formType={entry.formType}
                onChange={api.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[entry.name] || ""}
                disabled={disableInput()}
                {...(index === 0 ? { innerRef: firstSelectInput } : null)}>
                <option value="" label={`Select ...`} />
                {entry.options
                  ? entry.options.map((selectOption, selectIndex) => {
                      return (
                        <option
                          key={`${config.dataTesthookId}-field-${selectIndex}-option-${selectIndex}`}
                          value={selectOption.value}
                          label={selectOption.name}
                        />
                      );
                    })
                  : null}
              </FormSelect>
              {!config.isLoading && formik.touched[entry.name] && formik.errors[entry.name] ? (
                <InputErrorLabel>{formik.errors[entry.name]}</InputErrorLabel>
              ) : null}
            </React.Fragment>
          );
        default:
          return <div />;
      }
    });
  };

  api.handleChange = formik.handleChange;

  api.submitForm = () => {
    formik.validateForm().then(errors => {
      if (Object.keys(errors).length === 0) {
        formik.submitForm();
      } else {
        const fields: any = {};
        config.schema.forEach((entry: GenericFormInput) => (fields[entry.name] = true));

        formik.setTouched(fields);
      }
    });
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
    return {};
  };

  const form = (
    <FormContainer alternateStyling={config.alternateStyling}>
      <form
        data-testhook-id={config.dataTesthookId}
        onSubmit={(e: React.SyntheticEvent<EventTarget>) => {
          e.preventDefault();
          api.submitForm();
        }}
        onBlur={() => {
          if (config.onChange) {
            config.onChange(formik.isValid, formik.values);
          }
        }}>
        {renderFormElements(formik, config.schema)}
        {config.permission === FormPermission.EDIT && (config.confirmationLabel || config.cancellationLabel) ? (
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
