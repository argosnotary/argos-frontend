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
import GenericForm from "./GenericForm";

export default {
  title: "Forms"
};

const dummyScheme = [
  {
    labelValue: "Label name*",
    name: "labelname",
    formType: "text"
  }
];

const validate = values => {
  const errors = {};

  if (!values.labelname) {
    errors.labelname = "Please fill in a label name.";
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/.test(values.labelname)) {
    errors.labelname =
      "Invalid label name (only lowercase alphanumeric characters and underscore allowed).";
  }

  return errors;
};

const onSubmit = () => {
  alert("submitting form");
};

export const genericForm = () => (
  <GenericForm
    schema={dummyScheme}
    permission={"edit"}
    validate={validate}
    onSubmit={onSubmit}
    confirmationLabel={"Add label"}
    cancellationLabel={"Cancel"}
    initialValues={{
      labelname: ""
    }}
  />
);
