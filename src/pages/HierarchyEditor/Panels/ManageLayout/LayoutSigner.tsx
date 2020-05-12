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
import { Warning } from "../../../../atoms/Alerts";
import {
  Modal,
  ModalBody,
  ModalFlexColumWrapper,
  ModalFooter
} from "../../../../atoms/Modal";
import GenericForm, {
  IGenericFormSchema
} from "../../../../organisms/GenericForm";
import { FormPermissions } from "../../../../types/FormPermission";
import DataRequest from "../../../../types/DataRequest";
import IPersonalAccountKeyPair from "../../../../interfaces/IPersonalAccountKeyPair";
import { signLayout } from "../../LayoutService";
import {
  HierarchyEditorPaneActionTypes,
  StateContext
} from "../../../../stores/hierarchyEditorStore";
import { WRONG_PASSWORD } from "../../../../security";
import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "./LayoutEditorStore";
import { CryptoExceptionWarning } from "../../../../molecules/CryptoExceptionWarning";
import { useUserProfileContext } from "../../../../stores/UserProfile";

interface IPasswordFormValues {
  passphrase: string;
}

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
          dataTesthookId={"passphrase-form"}
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

const LayoutSigner: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();
  const [state, dispatch] = useContext(StateContext);
  const [showWarning, setShowWarning] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const { token } = useUserProfileContext();
  const [cryptoException, setCryptoException] = useState(false);

  const [response, setRequest] = useDataApi(genericDataFetchReducer);

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
          editorStoreContext.state.layout
        )
          .then(layoutMetaBlock => {
            setRequest({
              data: layoutMetaBlock,
              method: "post",
              token,
              url: "/api/supplychain/" + state.nodeReferenceId + "/layout",
              cbSuccess: () => {
                setRequest({
                  data: editorStoreContext.state.approvalConfigs,
                  url:
                    "/api/supplychain/" +
                    state.nodeReferenceId +
                    "/layout/approvalconfig",
                  method: "post",
                  token,
                  cbSuccess: () => {
                    dispatch({
                      type: HierarchyEditorPaneActionTypes.RESET_PANE
                    });
                  }
                });
              }
            });
          })
          .catch(e => {
            setPassphrase("");
            if (e === WRONG_PASSWORD) {
              setShowWarning(true);
            } else {
              setCryptoException(true);
              throw e;
            }
          });
      }
    };
    setRequest(dataRequest);
  };

  useEffect(() => {
    if (passphrase.length > 0) {
      postNewLayout();
    }
  }, [passphrase]);

  if (editorStoreContext.state.showSigningDialog) {
    return (
      <>
        <Modal>
          <ModalFlexColumWrapper>
            {cryptoException ? <CryptoExceptionWarning /> : null}
            {getModalContent(
              value => {
                setShowWarning(false);
                setPassphrase(value.passphrase);
              },
              () => {
                editorStoreContext.dispatch({
                  type: LayoutEditorActionType.STOP_SIGNING
                });
                setShowWarning(false);
                setPassphrase("");
              },
              response.isLoading,
              showWarning,
              passphrase
            )}
          </ModalFlexColumWrapper>
        </Modal>
      </>
    );
  } else {
    return null;
  }
};

export default LayoutSigner;
