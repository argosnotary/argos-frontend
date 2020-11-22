/*
 * Copyright (C) 2020 Argos Notary
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
import DataRequest from "../../../../types/DataRequest";
import IPersonalAccountKeyPair from "../../../../interfaces/IPersonalAccountKeyPair";
import { signLayout } from "../../LayoutService";
import { WRONG_PASSWORD } from "../../../../security";
import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import PassphraseDialogBox from "../../../../organisms/PassphraseDialogBox";
import {
  HierarchyEditorStateContext,
  HierarchyEditorActionTypes
} from "../../../../stores/hierarchyEditorStore";

const LayoutSigner: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();
  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );
  const [showWarning, setShowWarning] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [cryptoException, setCryptoException] = useState(false);

  const [response, setRequest] = useDataApi(genericDataFetchReducer);

  const postNewLayout = () => {
    const dataRequest: DataRequest = {
      method: "get",
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
              url:
                "/api/supplychain/" +
                hierarchyEditorState.editor.node.referenceId +
                "/layout",
              cbSuccess: () => {
                setRequest({
                  data: editorStoreContext.state.approvalConfigs,
                  url:
                    "/api/supplychain/" +
                    hierarchyEditorState.editor.node.referenceId +
                    "/layout/approvalconfig",
                  method: "post",
                  cbSuccess: () => {
                    setRequest({
                      data: editorStoreContext.state.releaseConfig
                        ? editorStoreContext.state.releaseConfig
                        : { artifactCollectorSpecifications: [] },
                      url:
                        "/api/supplychain/" +
                        hierarchyEditorState.editor.node.referenceId +
                        "/layout/releaseconfig",
                      method: "post",
                      cbSuccess: () => {
                        hierarchyEditorDispatch.editor({
                          type: HierarchyEditorActionTypes.RESET
                        });
                      }
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

  return (
    <>
      <PassphraseDialogBox
        showDialog={editorStoreContext.state.showSigningDialog}
        passphrase={passphrase}
        onCancel={() => {
          editorStoreContext.dispatch({
            type: LayoutEditorActionType.STOP_SIGNING
          });
          setShowWarning(false);
          setPassphrase("");
        }}
        onConfirm={pass => {
          setShowWarning(false);
          setPassphrase(pass);
        }}
        loading={response.isLoading}
        showCryptoExceptionMessage={cryptoException}
        showInvalidPassphraseMessage={showWarning}
      />
    </>
  );
};

export default LayoutSigner;
