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
import DataRequest from "../../../../types/DataRequest";
import IPersonalAccountKeyPair from "../../../../interfaces/IPersonalAccountKeyPair";
import {
  HierarchyEditorPaneActionTypes,
  StateContext
} from "../../../../stores/hierarchyEditorStore";
import { WRONG_PASSWORD } from "../../../../security";
import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import { useUserProfileContext } from "../../../../stores/UserProfile";
import PassphraseDialogBox from "../../../../organisms/PassphraseDialogBox";
import {
  ApprovalExecutionActionType,
  IApprovalExecutionAction,
  useApprovalExecutionStore
} from "../../../../stores/ApprovalExecutionStore";
import { signLink } from "../../LinkSigningService";
import { ILinkMetaBlock } from "../../../../interfaces/ILink";

const LinkSigner: React.FC = () => {
  const approvalContext = useApprovalExecutionStore();
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
        const stepName =
          approvalContext.state.selectedApprovalConfig?.stepName || "";
        const segmentName =
          approvalContext.state.selectedApprovalConfig?.segmentName || "";
        signLink(
          passphrase,
          key.keyId,
          key.encryptedPrivateKey,
          {
            layoutSegmentName: segmentName,
            stepName: stepName,
            runId: "runId",
            command: [],
            products: [],
            materials: approvalContext.state.artifactsToSign
          },
          state.nodeReferenceId
        )
          .then((linkMetaBlock: ILinkMetaBlock) => {
            setRequest({
              data: linkMetaBlock,
              method: "post",
              token,
              url: "/api/supplychain/" + state.nodeReferenceId + "/link",
              cbSuccess: () => {
                dispatch({
                  type: HierarchyEditorPaneActionTypes.RESET_PANE
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
        showDialog={approvalContext.state.artifactsToSign.length > 0}
        passphrase={passphrase}
        onCancel={() => {
          approvalContext.dispatch({
            type: ApprovalExecutionActionType.SIGN_ARTIFACTS,
            artifactsToSign: []
          } as IApprovalExecutionAction);
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

export default LinkSigner;