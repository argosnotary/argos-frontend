import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "styled-components";
import {
  HierarchyEditorActionTypes,
  HierarchyEditorStateContext
} from "../../../stores/hierarchyEditorStore";
import { cryptoAvailable, generateKey } from "../../../security";
import DataRequest from "../../../types/DataRequest";
import { useUserProfileContext } from "../../../stores/UserProfile";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import { IPublicKey } from "../../../interfaces/IPublicKey";
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFlexColumWrapper,
  ModalFooter
} from "../../../atoms/Modal";
import { LoaderIcon } from "../../../atoms/Icons";
import WarningModal from "../../../molecules/WarningModal";
import { NoCryptoWarning } from "../../../molecules/NoCryptoWarning";
import { CryptoExceptionWarning } from "../../../molecules/CryptoExceptionWarning";

enum WizardModes {
  MANUAL,
  AUTOMATIC
}
enum WizardStates {
  KEY_OVERRIDE_WARNING,
  LOADING,
  NO_CRYPTO_SUPPORT,
  CRYPTO_EXCEPTION,
  DEFAULT
}
interface IServiceAccountKeyWizardProps {
  initialWizardMode: WizardModes;
  cbKeyGenerated: (publicKey: IPublicKey, generatedPassWord: string) => void;
}

const ServiceAccountKeyWizard: React.FC<IServiceAccountKeyWizardProps> = ({
  initialWizardMode: initialWizardMode,
  cbKeyGenerated: cbKeyGenerated
}) => {
  const [wizardMode, setWizardMode] = useState(initialWizardMode);
  const determineWizardState = (): WizardStates => {
    if (cryptoAvailable() && wizardMode === WizardModes.MANUAL) {
      return WizardStates.KEY_OVERRIDE_WARNING;
    } else if (cryptoAvailable() && wizardMode === WizardModes.AUTOMATIC) {
      return WizardStates.DEFAULT;
    } else {
      return WizardStates.NO_CRYPTO_SUPPORT;
    }
  };
  const [wizardState, setWizardState] = useState(determineWizardState());

  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );
  const { token } = useUserProfileContext();
  const [
    _serviceAccountDataRequestState,
    setServiceAccountDataRequest
  ] = useDataApi(genericDataFetchReducer);

  useEffect(() => {
    if (wizardMode === WizardModes.AUTOMATIC) {
      generateAndStoreKey();
    }
    determineWizardState();
  }, [wizardMode]);

  const generateAndStoreKey = async () => {
    setWizardState(WizardStates.LOADING);
    try {
      const generatedKeys = await generateKey(true);
      const dataRequest: DataRequest = {
        data: generatedKeys.keys,
        method: "post",
        token,
        url: `/api/serviceaccount/${hierarchyEditorState.editor.node.referenceId}/key`,
        cbSuccess: () => {
          cbKeyGenerated(
            {
              publicKey: generatedKeys.keys.publicKey,
              keyId: generatedKeys.keys.keyId
            },
            generatedKeys.password
          );
          setWizardMode(WizardModes.MANUAL);
        }
      };
      setServiceAccountDataRequest(dataRequest);
    } catch (e) {
      setWizardState(WizardStates.CRYPTO_EXCEPTION);
      throw e;
    }
  };

  const getModalContent = (currentWizardState: number) => {
    const theme = useContext(ThemeContext);

    const cancelHandler = () => {
      hierarchyEditorDispatch.editor({
        type: HierarchyEditorActionTypes.RESET
      });
    };

    const continueHandler = async () => {
      await generateAndStoreKey();
    };

    switch (currentWizardState) {
      case WizardStates.LOADING:
        return (
          <>
            <ModalBody>
              <LoaderIcon color={theme.loaderIcon.color} size={64} />
            </ModalBody>
          </>
        );
      case WizardStates.KEY_OVERRIDE_WARNING:
        return (
          <WarningModal
            message="Existing key will be deactivated. Are you sure you want to continue ?"
            continueHandler={continueHandler}
            cancelHandler={cancelHandler}
          />
        );
      case WizardStates.NO_CRYPTO_SUPPORT:
        return (
          <>
            <ModalBody>
              <NoCryptoWarning />
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={cancelHandler}>Close</ModalButton>
            </ModalFooter>
          </>
        );
      case WizardStates.CRYPTO_EXCEPTION:
        return (
          <>
            <ModalBody>
              <CryptoExceptionWarning />
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={cancelHandler}>Close</ModalButton>
            </ModalFooter>
          </>
        );
    }
  };
  return (
    <Modal>
      <ModalFlexColumWrapper>
        {getModalContent(wizardState)}
      </ModalFlexColumWrapper>
    </Modal>
  );
};

export { ServiceAccountKeyWizard, WizardModes };
