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
import {
  LayoutEditorPaneActionTypes,
  StateContext
} from "../../../stores/layoutEditorStore";
import { LastBreadCrumb, NodesBreadCrumb } from "../../../atoms/Breadcrumbs";
import ContentSeparator from "../../../atoms/ContentSeparator";
import GenericForm, {
  IGenericFormSchema
} from "../../../organisms/GenericForm";
import {
  Modal,
  ModalBody,
  ModalFlexColumWrapper,
  ModalFooter
} from "../../../atoms/Modal";
import { FormPermissions } from "../../../types/FormPermission";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer, {
  customGenericDataFetchReducer
} from "../../../stores/genericDataFetchReducer";
import DataRequest from "../../../types/DataRequest";
import useToken from "../../../hooks/useToken";
import { signLayout } from "../LayoutService";
import IPersonalAccountKeyPair from "../../../interfaces/IPersonalAccountKeyPair";
import { LayoutMetaBlock } from "../../../interfaces/ILayout";
import { Warning } from "../../../atoms/Alerts";

interface ILayoutFormValues {
  layout: string;
}

interface IPasswordFormValues {
  passphrase: string;
}

const formSchema: IGenericFormSchema = [
  {
    labelValue: "Layout*",
    name: "layout",
    formType: "textArea"
  }
];

const validateLayout = (values: ILayoutFormValues) => {
  const errors = {} as ILayoutFormValues;

  if (!values.layout) {
    errors.layout = "Please fill in a layout.";
  } else {
    try {
      JSON.parse(values.layout);
    } catch (e) {
      errors.layout = "Invalid json";
    }
  }
  return errors;
};

const validatePassphrase = (values: IPasswordFormValues) => {
  const errors = {} as IPasswordFormValues;

  if (!values.passphrase) {
    errors.passphrase = "Please fill in a passphrase.";
  }

  return errors;
};

const passPhraseFormSchema: IGenericFormSchema = [
  {
    labelValue: "Passphrase*",
    name: "passphrase",
    formType: "password"
  }
];

const getModalContent = (
  onSubmit: (values: any) => void,
  onCancel: () => void,
  isLoading: boolean,
  showWarning: boolean,
  passphrase: string
) => {
  return (
    <>
      {showWarning ? <Warning message={"Incorrect passphrase"} /> : null}
      <ModalBody>
        <GenericForm
          schema={passPhraseFormSchema}
          permission={FormPermissions.EDIT}
          isLoading={isLoading}
          validate={validatePassphrase}
          onCancel={onCancel}
          onSubmit={onSubmit}
          confirmationLabel={"Sign and Submit"}
          cancellationLabel={"Cancel"}
          initialValues={{ passphrase: passphrase }}
        />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </>
  );
};

const ManageLayoutPanel = () => {
  const [state, dispatch] = useContext(StateContext);
  const [displayModal, setDisplayModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [layout, setLayout] = useState({} as ILayoutFormValues);

  const [passphrase, setPassphrase] = useState("");

  const [responseRequestKey, setDataRequestKey] = useDataApi(
    genericDataFetchReducer
  );
  const [responsePostLayout, setDataRequestPostLayout] = useDataApi(
    genericDataFetchReducer
  );

  const [token] = useToken();

  const getLayoutRequest: DataRequest = {
    method: "get",
    token,
    url: "/api/supplychain/" + state.nodeReferenceId + "/layout",
    cbSuccess: (layoutMetaBlock: LayoutMetaBlock) => {
      setLayout({ layout: JSON.stringify(layoutMetaBlock.layout, null, 2) });
    }
  };

  interface ILayoutApiResponse {
    isLoading: boolean;
    data: LayoutMetaBlock;
  }

  const [profileApiResponse] = useDataApi<ILayoutApiResponse, LayoutMetaBlock>(
    customGenericDataFetchReducer,
    getLayoutRequest
  );

  const postNewLayout = () => {
    const dataRequest: DataRequest = {
      method: "get",
      token: token,
      url: "/api/personalaccount/me/key",
      cbSuccess: (key: IPersonalAccountKeyPair) => {
        signLayout(
          passphrase,
          key.keyId,
          key.encryptedPrivateKey,
          JSON.parse(layout.layout)
        )
          .then(layoutMetaBlock => {
            setDataRequestPostLayout({
              data: layoutMetaBlock,
              method: "post",
              token: token,
              url: "/api/supplychain/" + state.nodeReferenceId + "/layout",
              cbSuccess: () => {
                dispatch({
                  type: LayoutEditorPaneActionTypes.RESET_PANE
                });
              }
            });
          })
          .catch(() => {
            setPassphrase("");
            setShowWarning(true);
          });
      }
    };

    setDataRequestKey(dataRequest);
  };

  useEffect(() => {
    if (passphrase.length > 0) {
      postNewLayout();
    }
  }, [passphrase]);

  return (
    <>
      {displayModal ? (
        <Modal>
          <ModalFlexColumWrapper>
            {getModalContent(
              value => {
                setShowWarning(false);
                setPassphrase(value.passphrase);
              },
              () => {
                setDisplayModal(false);
                setShowWarning(false);
                setPassphrase("");
              },
              responseRequestKey.isLoading || responsePostLayout.isLoading,
              showWarning,
              passphrase
            )}
          </ModalFlexColumWrapper>
        </Modal>
      ) : null}
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
        isLoading={profileApiResponse.isLoading}
        validate={validateLayout}
        onCancel={() => {
          dispatch({
            type: LayoutEditorPaneActionTypes.RESET_PANE
          });
        }}
        onSubmit={values => {
          setLayout(values);
          setDisplayModal(true);
        }}
        confirmationLabel={"Sign and Submit"}
        cancellationLabel={"Cancel"}
        initialValues={layout}
      />
    </>
  );
};

export default ManageLayoutPanel;
