import React, { useContext } from "react";
import { useFormik } from "formik";

import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import InputErrorLabel from "../../../atoms/InputErrorLabel";
import { LoaderButton } from "../../../atoms/Button";
import ContentSeparator from "../../../atoms/ContentSeparator";
import useToken from "../../../hooks/useToken";
import DataRequest from "../../../types/DataRequest";
import ILabelPostResponse from "../../../interfaces/ILabelPostResponse";
import FormInput from "../../../molecules/FormInput";
import { StateContext } from "../../../stores/layoutEditorStore";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";

interface ILabelNameFormValues {
  labelname: string;
}

const validate = (values: ILabelNameFormValues) => {
  const errors = {} as any;

  if (!values.labelname) {
    errors.labelname = "Please fill in a label name.";
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/i.test(values.labelname)) {
    errors.labelname =
      "Invalid label name (only alphanumeric characters and underscore allowed).";
  }

  return errors;
};

const ManageLabel = () => {
  const [localStorageToken] = useToken();
  const [state, dispatch] = useContext(StateContext);
  const [labelPostState, setLabelPostRequest] = useDataApi(
    genericDataFetchReducer
  );

  const postNewLabel = (values: ILabelNameFormValues) => {
    const data: any = {};

    data.name = values.labelname;

    if (state.nodeReferenceId !== "") {
      data.parentLabelId = state.nodeReferenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      token: localStorageToken,
      url: "/api/label",
      cbSuccess: (label: ILabelPostResponse) => {
        dispatch({
          type: "postnewlabel",
          label
        });
        formik.resetForm();
      }
    };

    setLabelPostRequest(dataRequest);
  };

  const updateLabel = (values: ILabelNameFormValues) => {
    const data: any = {};

    data.name = values.labelname;

    if (state.nodeReferenceId !== "") {
      data.labelId = state.nodeReferenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      token: localStorageToken,
      url: `/api/label/${state.nodeReferenceId}`,
      cbSuccess: (label: ILabelPostResponse) => {
        dispatch({
          type: "putlabel",
          label
        });
        formik.resetForm();
      }
    };

    setLabelPostRequest(dataRequest);
  };

  const formik = useFormik({
    initialValues: {
      labelname: ""
    },
    onSubmit: values => {
      if (state.firstPanelView === "addlabel") {
        postNewLabel(values);
      }

      if (state.firstPanelView === "updatelabel") {
        updateLabel(values);
      }
    },
    validate
  });

  return (
    <form onSubmit={formik.handleSubmit}>
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
      {state.firstPanelView === "updatelabel" ? (
        <>
          <FormInput
            labelValue="Label name*"
            name="labelname"
            formType="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={state.selectedNodeName}
          />
          {formik.touched.labelname && formik.errors.labelname ? (
            <InputErrorLabel>{formik.errors.labelname}</InputErrorLabel>
          ) : null}
          <ContentSeparator />
          <LoaderButton buttonType="submit" loading={labelPostState.isLoading}>
            Update label
          </LoaderButton>
        </>
      ) : null}
      {state.firstPanelView === "addlabel" ? (
        <>
          <FormInput
            labelValue="Label name*"
            name="labelname"
            formType="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={""}
          />
          {formik.touched.labelname && formik.errors.labelname ? (
            <InputErrorLabel>{formik.errors.labelname}</InputErrorLabel>
          ) : null}
          <ContentSeparator />
          <LoaderButton buttonType="submit" loading={labelPostState.isLoading}>
            Add label
          </LoaderButton>
        </>
      ) : null}
    </form>
  );
};

export default ManageLabel;
