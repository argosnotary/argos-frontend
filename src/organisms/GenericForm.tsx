import React, { useEffect } from "react";
import styled from "styled-components";
import { useFormik } from "formik";

import FormInput from "../molecules/FormInput";
import InputErrorLabel from "../atoms/InputErrorLabel";
import { LoaderButton, CancelButton } from "../atoms/Button";
import ContentSeparator from "../atoms/ContentSeparator";

const CustomCancelButton = styled(CancelButton)`
  margin-left: 1rem;
`;

export interface IGenericFormInput {
  labelValue: string;
  name: string;
  formType: string;
}

export type IGenericFormSchema = Array<IGenericFormInput>;

interface IGenericForm {
  schema: IGenericFormSchema;
  permission: "read" | "edit";
  validate: (values: any) => void;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  confirmationLabel: string;
  cancellationLabel: string;
  initialValues: any;
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
  initialValues
}) => {
  const formik = useFormik({
    initialValues,
    onSubmit: (values: typeof initialValues) => {
      onSubmit(values);
      formik.resetForm();
    },
    validate
  });

  useEffect(() => {
    formik.setValues(initialValues);
  }, [initialValues]);

  const renderFormElements = (formik: any, schema: IGenericFormSchema) => {
    return schema.map((entry: IGenericFormInput, index) => {
      switch (entry.formType) {
        case "text":
          return (
            <>
              <FormInput
                key={`${entry.name}-${index}`}
                labelValue={entry.labelValue}
                name={entry.name}
                formType={entry.formType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[entry.name]}
                disabled={permission === "read" ? true : false}
              />
              {formik.touched[entry.name] && formik.errors[entry.name] ? (
                <InputErrorLabel>{formik.errors[entry.name]}</InputErrorLabel>
              ) : null}
            </>
          );
      }
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {renderFormElements(formik, schema)}
      <ContentSeparator />
      <LoaderButton buttonType="submit" loading={isLoading}>
        {confirmationLabel}
      </LoaderButton>
      <CustomCancelButton buttonType={"button"} onClick={() => onCancel()}>
        {cancellationLabel}
      </CustomCancelButton>
    </form>
  );
};

export default GenericForm;
