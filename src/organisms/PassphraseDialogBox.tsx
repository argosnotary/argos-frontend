/*
 * Copyright (C) 2020 Argos Notary Coöperatie UA
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
import React, { useEffect } from "react";
import { Warning } from "../atoms/Alerts";
import {
  Modal,
  ModalBody,
  ModalFlexColumWrapper,
  ModalFooter
} from "../atoms/Modal";
import { IGenericFormSchema } from "../interfaces/IGenericFormSchema";
import { FormPermissions } from "../types/FormPermission";
import { CryptoExceptionWarning } from "../molecules/CryptoExceptionWarning";
import useFormBuilder, {
  IFormBuilderConfig,
  FormSubmitButtonHandlerTypes
} from "../hooks/useFormBuilder";

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

export interface IPassphraseDialogBoxProps {
  showDialog: boolean;
  onCancel: () => void;
  onConfirm: (passphrase: string) => void;
  loading: boolean;
  showCryptoExceptionMessage: boolean;
  showInvalidPassphraseMessage: boolean;
  passphrase: string;
}

const PassphraseDialogBox: React.FC<IPassphraseDialogBoxProps> = ({
  showDialog,
  passphrase,
  onCancel,
  onConfirm,
  loading,
  showCryptoExceptionMessage,
  showInvalidPassphraseMessage
}) => {
  const getModalContent = () => {
    const formConfig: IFormBuilderConfig = {
      dataTesthookId: "passphrase-form",
      schema: passPhraseFormSchema,
      permission: FormPermissions.EDIT,
      isLoading: loading,
      validate: validatePassphrase,
      onCancel,
      onSubmit: values => onConfirm(values.passphrase),
      confirmationLabel: "Confirm",
      cancellationLabel: "Cancel",
      buttonHandler: FormSubmitButtonHandlerTypes.CLICK
    };

    const [formJSX, formAPI] = useFormBuilder(formConfig);

    useEffect(() => {
      formAPI.setInitialFormValues({ passphrase });
    }, [passphrase]);

    return (
      <>
        {showInvalidPassphraseMessage ? (
          <Warning message={"Incorrect passphrase"} />
        ) : null}
        <ModalBody>{formJSX}</ModalBody>
        <ModalFooter />
      </>
    );
  };

  if (showDialog) {
    return (
      <>
        <Modal>
          <ModalFlexColumWrapper>
            {showCryptoExceptionMessage ? <CryptoExceptionWarning /> : null}
            {getModalContent()}
          </ModalFlexColumWrapper>
        </Modal>
      </>
    );
  } else {
    return null;
  }
};

export default PassphraseDialogBox;
