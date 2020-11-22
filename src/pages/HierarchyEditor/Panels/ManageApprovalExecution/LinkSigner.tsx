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
import React, { useEffect, useState, useContext } from "react";
import DataRequest from "../../../../types/DataRequest";
import IPersonalAccountKeyPair from "../../../../interfaces/IPersonalAccountKeyPair";
import { WRONG_PASSWORD } from "../../../../security";
import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import PassphraseDialogBox from "../../../../organisms/PassphraseDialogBox";
import {
  ApprovalExecutionActionType,
  IApprovalExecutionAction,
  IApprovalSigningContext,
  useApprovalExecutionStore
} from "../../../../stores/ApprovalExecutionStore";
import { signLink } from "../../LinkSigningService";
import { ILinkMetaBlock } from "../../../../interfaces/ILink";
import {
  HierarchyEditorStateContext,
  HierarchyEditorActionTypes
} from "../../../../stores/hierarchyEditorStore";

const LinkSigner: React.FC = () => {
  const approvalContext = useApprovalExecutionStore();
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
        const signingContext = approvalContext.state
          .approvalSigningContext as IApprovalSigningContext;
        signLink(passphrase, key.keyId, key.encryptedPrivateKey, {
          layoutSegmentName: signingContext.segmentName,
          stepName: signingContext.stepName,
          runId: signingContext.runId,
          products: signingContext.artifactsToSign,
          materials: []
        })
          .then((linkMetaBlock: ILinkMetaBlock) => {
            setRequest({
              data: linkMetaBlock,
              method: "post",
              url:
                "/api/supplychain/" +
                hierarchyEditorState.editor.node.referenceId +
                "/link",
              cbSuccess: () => {
                hierarchyEditorDispatch.editor({
                  type: HierarchyEditorActionTypes.RESET
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
        showDialog={approvalContext.state.approvalSigningContext !== undefined}
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
