import React from "react";
import styled from "styled-components";
import Input from "../atoms/Input";
import InputLabel from "../atoms/InputLabel";

interface IFormInputProps {
  labelValue: string;
  placeHolder: string;
  formType: string;
}

const FormInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormInput: React.FC<IFormInputProps> = ({
  labelValue,
  placeHolder,
  formType
}) => (
  <FormInputContainer>
    <InputLabel>{labelValue}</InputLabel>
    <Input placeholder={placeHolder} type={formType} />
  </FormInputContainer>
);

export default FormInput;
