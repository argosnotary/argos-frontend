import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";

import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import InputErrorLabel from "../../../atoms/InputErrorLabel";
import { LoaderButton } from "../../../atoms/Button";
import ContentSeparator from "../../../atoms/ContentSeparator";
import useToken from "../../../hooks/useToken";
import DataRequest from "../../../types/DataRequest";
import FormInput from "../../../molecules/FormInput";
import {
  StateContext,
  LayoutEditorDataActionTypes,
  LayoutEditorPaneActionTypes
} from "../../../stores/layoutEditorStore";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import ISupplyChainApiResponse from "../../../interfaces/ISupplyChainApiResponse";

interface ISupplyChainNameFormValues {
  supplychainname: string;
}

const validate = (values: ISupplyChainNameFormValues) => {
  const errors = {} as any;

  if (!values.supplychainname) {
    errors.supplychainname = "Please fill in a supply chain name.";
  } else if (!/^([a-z]{1}[a-z0-9-]*)?$/i.test(values.supplychainname)) {
    errors.supplychainname =
      "Invalid supply chain name (only alphanumeric characters and hyphen is allowed).";
  }

  return errors;
};

const ManageSupplyChain = () => {
  const [localStorageToken] = useToken();
  const [state, dispatch] = useContext(StateContext);
  const [supplyChainApiResponseState, setSupplyChainApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const postSupplyChain = (values: ISupplyChainNameFormValues) => {
    const data: any = {};

    data.name = values.supplychainname;

    if (state.nodeReferenceId !== "") {
      data.parentLabelId = state.nodeReferenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      token: localStorageToken,
      url: "/api/supplychain",
      cbSuccess: (supplyChain: ISupplyChainApiResponse) => {
        dispatch({
          type: LayoutEditorDataActionTypes.POST_SUPPLY_CHAIN,
          supplyChain
        });
        formik.resetForm();
      }
    };

    setSupplyChainApiRequest(dataRequest);
  };

  const updateSupplyChain = (values: ISupplyChainNameFormValues) => {
    const data: any = {};

    data.name = values.supplychainname;

    if (state.nodeReferenceId !== "") {
      data.supplyChainId = state.nodeReferenceId;
    }

    if (state.nodeParentId !== "") {
      data.parentLabelId = state.nodeParentId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      token: localStorageToken,
      url: `/api/supplychain/${state.nodeReferenceId}`,
      cbSuccess: (supplyChain: ISupplyChainApiResponse) => {
        dispatch({
          type: LayoutEditorDataActionTypes.PUT_SUPPLY_CHAIN,
          supplyChain
        });
        formik.resetForm();
      }
    };

    setSupplyChainApiRequest(dataRequest);
  };

  const formik = useFormik({
    initialValues: {
      supplychainname: ""
    },
    onSubmit: values => {
      if (
        state.firstPanelView ===
        LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE
      ) {
        postSupplyChain(values);
      }

      if (
        state.firstPanelView ===
        LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE
      ) {
        updateSupplyChain(values);
      }
    },
    validate
  });

  useEffect(() => {
    if (
      state.firstPanelView ===
      LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE
    ) {
      formik.setValues({ supplychainname: state.selectedNodeName });
    }

    if (
      state.firstPanelView ===
      LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE
    ) {
      formik.setValues({ supplychainname: "" });
    }
  }, [state.selectedNodeName, state.firstPanelView]);

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
      <FormInput
        labelValue="Supply chain name*"
        name="supplychainname"
        formType="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.supplychainname}
      />
      {formik.touched.supplychainname && formik.errors.supplychainname ? (
        <InputErrorLabel>{formik.errors.supplychainname}</InputErrorLabel>
      ) : null}
      <ContentSeparator />
      <LoaderButton
        buttonType="submit"
        loading={supplyChainApiResponseState.isLoading}
      >
        Add supply chain
      </LoaderButton>
    </form>
  );
};

export default ManageSupplyChain;
