import React from "react";
import { ModalBody, ModalButton, ModalFooter } from "../atoms/Modal";
import { Warning } from "../atoms/Alerts";

interface IWarningModalProps {
  message: string;
  continueHandler: () => void;
  cancelHandler: () => void;
}

const WarningModal: React.FC<IWarningModalProps> = ({
  message,
  continueHandler,
  cancelHandler
}) => {
  return (
    <>
      <ModalBody>
        <Warning message={message} />
      </ModalBody>
      <ModalFooter>
        <ModalButton onClick={cancelHandler}>No</ModalButton>
        <ModalButton onClick={continueHandler}>Continue</ModalButton>
      </ModalFooter>
    </>
  );
};

export default WarningModal;
