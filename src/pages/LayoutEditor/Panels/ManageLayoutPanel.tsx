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
import { serialize, signLayout } from "../LayoutService";
import IPersonalAccountKeyPair from "../../../interfaces/IPersonalAccountKeyPair";
import { ILayoutMetaBlock } from "../../../interfaces/ILayout";
import { Warning } from "../../../atoms/Alerts";
import { cryptoAvailable, WRONG_PASSWORD } from "../../../security";
import { CryptoExceptionWarning } from "../../../molecules/CryptoExceptionWarning";
import { NoCryptoWarning } from "../../../molecules/NoCryptoWarning";
import { Panel } from "../../../molecules/Panel";
import NotificationsList, {
  INotification,
  NotificationTypes
} from "../../../molecules/NotificationsList";
import { ThemeContext } from "styled-components";
import AlternateLoader from "../../../atoms/Icons/AlternateLoader";

enum ILayoutValidationMessageTypes {
  DATA_INPUT = "DATA_INPUT",
  MODEL_CONSISTENCY = "MODEL_CONSISTENCY"
}

interface ILayoutValidationMessage {
  field?: string;
  type: ILayoutValidationMessageTypes;
  message: string;
}

interface ILayoutValidationErrorResponse {
  messages: Array<ILayoutValidationMessage>;
}

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
      serialize(JSON.parse(values.layout));
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
          confirmationLabel={"Confirm"}
          cancellationLabel={"Cancel"}
          initialValues={{ passphrase: passphrase }}
        />
      </ModalBody>
      <ModalFooter />
    </>
  );
};

const ManageLayoutPanel = () => {
  const [state, dispatch] = useContext(StateContext);
  const [displayModal, setDisplayModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [layout, setLayout] = useState({} as ILayoutFormValues);
  const [cryptoException, setCryptoException] = useState(false);

  const [passphrase, setPassphrase] = useState("");

  const [responseRequestKey, setDataRequestKey] = useDataApi(
    genericDataFetchReducer
  );
  const [responsePostLayout, setDataRequestPostLayout] = useDataApi(
    genericDataFetchReducer
  );

  const [responseLayoutValidation, setLayoutValidationDataRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [layoutValidationErrors, setLayoutValidationErrors] = useState(
    [] as Array<INotification>
  );

  const [token] = useToken();
  const theme = useContext(ThemeContext);

  const getLayoutRequest: DataRequest = {
    method: "get",
    token,
    url: "/api/supplychain/" + state.nodeReferenceId + "/layout",
    cbSuccess: (layoutMetaBlock: ILayoutMetaBlock) => {
      setLayout({ layout: JSON.stringify(layoutMetaBlock.layout, null, 2) });
    },
    cbFailure: (error): boolean => {
      return error.response && error.response.status === 404;
    }
  };

  interface ILayoutApiResponse {
    isLoading: boolean;
    data: ILayoutMetaBlock;
  }

  const [profileApiResponse] = useDataApi<ILayoutApiResponse, ILayoutMetaBlock>(
    customGenericDataFetchReducer,
    getLayoutRequest
  );

  const requestLayoutValidation = (values: ILayoutFormValues) => {
    const dataRequest: DataRequest = {
      data: values.layout,
      method: "post",
      token: token,
      url: "/api/supplychain/" + state.nodeReferenceId + "/layout/validate",
      cbSuccess: () => {
        setLayout(values);
        setDisplayModal(true);
      },
      cbFailure: (error: any): boolean => {
        const response: ILayoutValidationErrorResponse = error.response.data;
        const notifications: Array<INotification> = convertValidationMessagesToNotifications(
          response
        );

        setLayoutValidationErrors(notifications);
        return true;
      }
    };

    setLayoutValidationDataRequest(dataRequest);
  };

  const convertValidationMessagesToNotifications = (
    response: ILayoutValidationErrorResponse
  ) => {
    if (!response) {
      return [] as Array<INotification>;
    }

    const notifications: Array<INotification> = response.messages.map(
      (message: ILayoutValidationMessage) => {
        const notification: INotification = {} as INotification;

        notification.body = `${message.field ? message.field : ""} ${
          message.message
        }`;
        notification.type = NotificationTypes.ERROR;

        return notification;
      }
    );

    return notifications;
  };

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
          .catch(e => {
            setPassphrase("");
            if (e === WRONG_PASSWORD) {
              setShowWarning(true);
            } else {
              setDisplayModal(false);
              setCryptoException(true);
              throw e;
            }
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
      <Panel width={"37.5vw"} resizable={true} title={"Manage layout"}>
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
          permission={
            cryptoAvailable() ? state.panePermission : FormPermissions.READ
          }
          isLoading={profileApiResponse.isLoading}
          validate={validateLayout}
          onCancel={() => {
            dispatch({
              type: LayoutEditorPaneActionTypes.RESET_PANE
            });
          }}
          onSubmit={values => {
            requestLayoutValidation(values);
          }}
          confirmationLabel={"Sign and Submit"}
          cancellationLabel={"Cancel"}
          initialValues={layout}
        />
        {!cryptoAvailable() ? <NoCryptoWarning /> : null}
        {cryptoException ? <CryptoExceptionWarning /> : null}
      </Panel>
      <Panel
        width={"37.5vw"}
        last={true}
        title={layoutValidationErrors.length ? "Validation errors" : ""}
      >
        {responseLayoutValidation.isLoading ? (
          <AlternateLoader size={32} color={theme.alternateLoader.color} />
        ) : (
          <NotificationsList notifications={layoutValidationErrors} />
        )}
      </Panel>
    </>
  );
};

export default ManageLayoutPanel;
