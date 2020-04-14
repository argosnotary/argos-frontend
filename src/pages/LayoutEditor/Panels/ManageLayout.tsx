import React, { useContext, useState, useEffect } from "react";
import { StateContext } from "../../../stores/layoutEditorStore";
import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import ContentSeparator from "../../../atoms/ContentSeparator";
import GenericForm, {
  IGenericFormSchema,
} from "../../../organisms/GenericForm";

interface ILayoutFormValues {
  layout: string;
}

const formSchema: IGenericFormSchema = [
  {
    labelValue: "Layout*",
    name: "layout",
    formType: "textArea",
  },
];

const validate = (values: ILayoutFormValues) => {
  const errors = {} as ILayoutFormValues;

  if (!values.layout) {
    errors.layout = "Please fill in a label name.";
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/.test(values.layout)) {
    errors.layout =
      "Invalid label name (only lowercase alphanumeric characters and underscore allowed).";
  }

  return errors;
};

const ManageLayoutPanel = () => {
  const [state, _dispatch] = useContext(StateContext);
  const [initialFormValues, setInitialFormValues] = useState(
    {} as ILayoutFormValues
  );

  useEffect(() => {
    setInitialFormValues({
      layout: "",
    });
  }, []);

  return (
    <>
      {state.selectedNodeName !== "" ? (
        <>
          <NodesBreadCrumb>
            Selected: {state.breadcrumb}
            <LastBreadCrumb>
              {state.breadcrumb.length > 0 ? " / " : ""}
              {state.selectedNodeName}
            </LastBreadCrumb>
          </NodesBreadCrumb>
          <ContentSeparator />
        </>
      ) : null}

      <GenericForm
        schema={formSchema}
        permission={state.panePermission}
        isLoading={false}
        validate={validate}
        onCancel={() => {
          return;
        }}
        onSubmit={(values) => {
          return values;
        }}
        confirmationLabel={"Submit"}
        cancellationLabel={"Cancel"}
        initialValues={initialFormValues}
      />
    </>
  );
};

export default ManageLayoutPanel;
