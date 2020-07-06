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
import { FormPermissions } from "../../../../types/FormPermission";
import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import useFormBuilder, {
  FormSubmitButtonHandlerTypes,
  IFormBuilderConfig
} from "../../../../hooks/useFormBuilder";
import { IStep } from "../../../../interfaces/ILayout";

const formSchema: IGenericFormSchema = [
  {
    labelValue: "Required Number Of Links*",
    name: "requiredNumberOfLinks",
    formType: "text"
  }
];

interface IFormValues {
  requiredNumberOfLinks: string;
}

const validateForm = (values: IFormValues) => {
  const errors = {} as IFormValues;

  if (!values.requiredNumberOfLinks) {
    errors.requiredNumberOfLinks = "Please fill in required number of links.";
  } else if (!new RegExp("^\\d+$").test(values.requiredNumberOfLinks)) {
    errors.requiredNumberOfLinks = "Please enter a number.";
  }
  return errors;
};

const RequiredNumberOfLinks: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const updateRequiredNumberOfLinks = (values: IFormValues) => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.UPDATE_REQUIRED_NUMBER_OF_LINKS,
      layoutStep: {
        requiredNumberOfLinks: parseInt(values.requiredNumberOfLinks)
      } as IStep
    });
  };

  const formConfig: IFormBuilderConfig = {
    dataTesthookId: "required-number-of-links-form",
    schema: formSchema,
    permission: FormPermissions.EDIT,
    isLoading: false,
    validate: validateForm,
    onSubmit: updateRequiredNumberOfLinks,
    onChange: (valid, values) => {
      if (valid) {
        updateRequiredNumberOfLinks(values);
      }
    },
    buttonHandler: FormSubmitButtonHandlerTypes.CLICK
  };

  const [formJSX, formApi] = useFormBuilder(formConfig);

  useEffect(() => {
    if (
      editorStoreContext.state.selectedLayoutElement &&
      editorStoreContext.state.selectedLayoutElement.step &&
      editorStoreContext.state.selectedLayoutElement.step.requiredNumberOfLinks
    ) {
      formApi.setInitialFormValues({
        requiredNumberOfLinks:
          "" +
          editorStoreContext.state.selectedLayoutElement.step
            .requiredNumberOfLinks
      });
    } else {
      formApi.setInitialFormValues({
        requiredNumberOfLinks: ""
      });
    }
  }, [editorStoreContext.state.selectedLayoutElement?.step?.requiredNumberOfLinks]);

  return <>{formJSX}</>;
};

export default RequiredNumberOfLinks;
