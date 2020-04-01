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
import styled from "styled-components";

import GenericForm from "./GenericForm";
import FlexRow from "../atoms/FlexRow";

const Container = styled(FlexRow)`
  padding: 1rem;
  border: 1px solid #e0e0e0;
  width: 50%;
`;

export default {
  title: "Forms"
};

const dummyScheme = [
  {
    labelValue: "Name*",
    name: "name",
    formType: "text"
  },
  {
    labelValue: "Email*",
    name: "email",
    formType: "text"
  },
  {
    labelValue: "Phonenumber*",
    name: "phonenumber",
    formType: "text"
  }
];

const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.name = "Please fill in a name.";
  }

  if (!values.email) {
    errors.email = "Please fill in an email.";
  }

  if (!values.phonenumber) {
    errors.phonenumber = "Please fill in an phonenumber.";
  }

  return errors;
};

const onSubmit = () => {
  alert("submitting form");
};

export const genericForm = () => (
  <Container>
    <GenericForm
      schema={dummyScheme}
      permission={"EDIT"}
      validate={validate}
      onSubmit={onSubmit}
      onCancel={() => alert("Cancelled")}
      confirmationLabel={"Submit"}
      cancellationLabel={"Cancel"}
      initialValues={{
        name: "Luke",
        email: ""
      }}
    />
  </Container>
);
