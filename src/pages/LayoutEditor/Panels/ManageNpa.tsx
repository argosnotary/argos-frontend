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
import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import styled from "styled-components";

import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import InputErrorLabel from "../../../atoms/InputErrorLabel";
import { CancelButton, LoaderButton } from "../../../atoms/Button";
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
import INpaApiResponse from "../../../interfaces/INpaApiResponse";
import PasswordView from "../../../atoms/PasswordView";
import FlexRow from "../../../atoms/FlexRow";
import { generateKey } from "../../../security";
import { Warning } from "../../../atoms/Alerts";
import {
  ModalBody,
  ModalFlexColumWrapper,
  ModalFooter,
  ModalButton,
  Modal
} from "../../../atoms/Modal";

interface INpaFormValues {
  npaname: string;
}

enum WizardStates {
  KEY_OVERRIDE_WARNING
}

const CloseButton = styled(CancelButton)`
  margin: 0;
`;

const validate = (values: INpaFormValues) => {
  const errors = {} as any;

  if (!values.npaname) {
    errors.npaname = "Please fill in a npa name.";
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/.test(values.npaname)) {
    errors.npaname =
      "Invalid npa name (only lowercase alphanumeric characters and underscore allowed).";
  }

  return errors;
};

const ManageNpa = () => {
  const [localStorageToken] = useToken();
  const [state, dispatch] = useContext(StateContext);
  const [npaPostState, setNpaPostRequest] = useDataApi(genericDataFetchReducer);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [wizardState, _setWizardState] = useState(
    WizardStates.KEY_OVERRIDE_WARNING
  );

  const [displayModal, setDisplayModal] = useState(false);

  const postNewNpa = (values: INpaFormValues) => {
    const data: any = {};

    data.name = values.npaname;

    if (state.nodeReferenceId !== "") {
      data.parentLabelId = state.nodeReferenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      token: localStorageToken,
      url: "/api/nonpersonalaccount",
      cbSuccess: async (npa: INpaApiResponse) => {
        const generatedKeys = await generateKey(true);

        const dataRequest: DataRequest = {
          data: generatedKeys.keys,
          method: "post",
          token: localStorageToken,
          url: `/api/nonpersonalaccount/${npa.id}/key`,
          cbSuccess: () => {
            setGeneratedPassword(generatedKeys.password);

            dispatch({
              type: LayoutEditorDataActionTypes.POST_NEW_NPA,
              npa
            });
          }
        };

        setNpaPostRequest(dataRequest);
      }
    };

    setNpaPostRequest(dataRequest);
  };

  const updateNpa = (values: INpaFormValues) => {
    const data: any = {};

    data.name = values.npaname;

    if (state.nodeReferenceId !== "") {
      data.nonPersonalAccountId = state.nodeReferenceId;
    }

    if (state.nodeParentId !== "") {
      data.parentLabelId = state.nodeParentId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      token: localStorageToken,
      url: `/api/nonpersonalaccount/${state.nodeReferenceId}`,
      cbSuccess: (npa: INpaApiResponse) => {
        dispatch({
          type: LayoutEditorDataActionTypes.PUT_NPA,
          npa
        });
        formik.resetForm();
      }
    };

    setNpaPostRequest(dataRequest);
  };

  const formik = useFormik({
    initialValues: {
      npaname: ""
    },
    onSubmit: values => {
      if (
        state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE
      ) {
        postNewNpa(values);
      }

      if (
        state.firstPanelView ===
        LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE
      ) {
        updateNpa(values);
      }
    },
    validate
  });

  useEffect(() => {
    console.log("GETTING IN HERE", state.firstPanelView);

    if (
      state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE
    ) {
      formik.setValues({ npaname: state.selectedNodeName });
    }

    if (
      state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE
    ) {
      formik.setValues({ npaname: "" });
    }

    if (
      state.firstPanelView ===
      LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL
    ) {
      setDisplayModal(true);
    }
  }, [state.selectedNodeName, state.firstPanelView]);

  const updateMode =
    state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE;

  if (state.dataAction === LayoutEditorDataActionTypes.DATA_ACTION_COMPLETED) {
    return (
      <>
        <NodesBreadCrumb>
          Selected: {state.breadcrumb}
          <LastBreadCrumb>
            {state.breadcrumb.length > 0 ? " / " : ""}
            {state.selectedNodeName}
          </LastBreadCrumb>
        </NodesBreadCrumb>
        <ContentSeparator />
        <PasswordView password={generatedPassword} margin={"0 0 1rem"} />
        <FlexRow>
          <CloseButton
            onClick={() =>
              dispatch({
                type: LayoutEditorPaneActionTypes.RESET_PANE
              })
            }
          >
            Close
          </CloseButton>
        </FlexRow>
      </>
    );
  }

  const getModalContent = (currentWizardState: number) => {
    const cancelHandler = () => {
      dispatch({ type: LayoutEditorPaneActionTypes.RESET_PANE });
    };

    const continueHandler = async () => {
      const generatedKeys = await generateKey(true);

      const dataRequest: DataRequest = {
        data: generatedKeys.keys,
        method: "post",
        token: localStorageToken,
        url: `/api/nonpersonalaccount/${state.nodeReferenceId}/key`,
        cbSuccess: () => {
          setGeneratedPassword(generatedKeys.password);

          dispatch({
            type: LayoutEditorDataActionTypes.DATA_ACTION_COMPLETED
          });
        }
      };

      setNpaPostRequest(dataRequest);
    };

    switch (currentWizardState) {
      case WizardStates.KEY_OVERRIDE_WARNING:
        return (
          <>
            <ModalBody>
              <Warning
                message={
                  "Existing key will be deactivated. Are you sure you want to continue?"
                }
              />
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={cancelHandler}>No</ModalButton>
              <ModalButton onClick={continueHandler}>Continue</ModalButton>
            </ModalFooter>
          </>
        );
    }
  };

  if (
    state.firstPanelView ===
      LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL &&
    displayModal
  ) {
    return (
      <Modal>
        <ModalFlexColumWrapper>
          {getModalContent(wizardState)}
        </ModalFlexColumWrapper>
      </Modal>
    );
  }

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
        labelValue="Non personal account name*"
        name="npaname"
        formType="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.npaname}
      />
      {formik.touched.npaname && formik.errors.npaname ? (
        <InputErrorLabel>{formik.errors.npaname}</InputErrorLabel>
      ) : null}
      <ContentSeparator />
      <LoaderButton buttonType="submit" loading={npaPostState.isLoading}>
        {updateMode ? "Update NPA" : "Add NPA"}
      </LoaderButton>
    </form>
  );
};

export default ManageNpa;
