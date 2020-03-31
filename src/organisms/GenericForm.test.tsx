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
import theme from "../theme/base.json";

import GenericForm from "./GenericForm";
import { ThemeProvider } from "styled-components";
import { FormPermissions } from "../types/FormPermission";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import FormInput from "../molecules/FormInput";

const dummySchema = [
  {
    labelValue: "Name*",
    name: "name",
    formType: "text"
  },
  {
    labelValue: "Email*",
    name: "email",
    formType: "text"
  }
];

interface IDummySchemaFormValues {
  name: string;
  email: string;
}

const validate = (values: IDummySchemaFormValues) => {
  const errors = {} as IDummySchemaFormValues;

  if (!values.name) {
    errors.name = "Please fill in a name.";
  }

  if (!values.email) {
    errors.email = "Please fill in an email.";
  }

  return errors;
};

const onSubmit = jest.fn();

const onCancel = jest.fn();

describe("GenericForm", () => {
  let formWithEditPermission: any;
  let onlyReadForm: any;

  beforeAll(async () => {
    formWithEditPermission = mount(
      <ThemeProvider theme={theme}>
        <GenericForm
          schema={dummySchema}
          isLoading={false}
          permission={FormPermissions.EDIT}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={onCancel}
          confirmationLabel={"Submit"}
          cancellationLabel={"Cancel"}
          initialValues={{
            name: "luke",
            email: "luke@jedi.com"
          }}
        />
      </ThemeProvider>
    );

    onlyReadForm = mount(
      <ThemeProvider theme={theme}>
        <GenericForm
          schema={dummySchema}
          isLoading={false}
          permission={FormPermissions.READ}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={onCancel}
          confirmationLabel={"Submit"}
          cancellationLabel={"Cancel"}
          initialValues={{
            name: "",
            email: "luke@jedi.com"
          }}
        />
      </ThemeProvider>
    );

    await act(() =>
      new Promise(resolve => setImmediate(resolve)).then(() => {
        formWithEditPermission.update();
        onlyReadForm.update();
      })
    );
  });

  it("renders inputs specified in the form schema", () => {
    expect(formWithEditPermission.find(FormInput).length).toBe(2);
    expect(
      formWithEditPermission
        .find(FormInput)
        .at(0)
        .prop("name")
    ).toEqual("name");

    expect(
      formWithEditPermission
        .find(FormInput)
        .at(1)
        .prop("name")
    ).toEqual("email");
  });

  it("renders inputs with specified initial values as specified in the form schema", () => {
    expect(formWithEditPermission.find(FormInput).length).toBe(2);
    expect(
      formWithEditPermission
        .find(FormInput)
        .at(0)
        .prop("value")
    ).toEqual("luke");

    expect(
      formWithEditPermission
        .find(FormInput)
        .at(1)
        .prop("value")
    ).toEqual("luke@jedi.com");
  });

  it("sets disabled to false on inputs when there are edit permissions ", () => {
    expect(
      formWithEditPermission
        .find(FormInput)
        .at(0)
        .prop("disabled")
    ).toEqual(false);

    expect(
      formWithEditPermission
        .find(FormInput)
        .at(1)
        .prop("disabled")
    ).toEqual(false);
  });

  it("calls onSubmit handler when form is valid and submitted", async () => {
    const form = formWithEditPermission.find("form");

    await act(() =>
      new Promise(resolve => setImmediate(resolve)).then(() => {
        form.simulate("submit");

        formWithEditPermission.update();
      })
    );

    expect(onSubmit).toHaveBeenCalled();
  });

  it("calls onCancel handler when cancel button is clicked", async () => {
    const button = formWithEditPermission
      .find('[data-testhook="cancel-button"]')
      .at(0);

    await act(() =>
      new Promise(resolve => setImmediate(resolve)).then(() => {
        button.simulate("click");

        formWithEditPermission.update();
      })
    );

    expect(onSubmit).toHaveBeenCalled();
  });

  it("cannot edit form when permissions are set to read", async () => {
    expect(
      onlyReadForm
        .find(FormInput)
        .at(0)
        .prop("disabled")
    ).toEqual(true);

    expect(
      onlyReadForm
        .find(FormInput)
        .at(1)
        .prop("disabled")
    ).toEqual(true);
  });
});
