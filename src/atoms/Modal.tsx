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
import { darken } from "polished";
import styled from "styled-components";

import FlexColumn from "../atoms/FlexColumn";

const Modal = styled.section`
  background: white;
  padding: 1rem 2rem;
  width: 30rem;
  position: absolute;
  top: 33%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  min-height: 10rem;
  display: flex;
  align-items: stretch;
  justify-content: center;
  box-shadow: 0 3px 20px 0px rgba(0, 0, 0, 0.1);
`;

const ModalFlexColumWrapper = styled(FlexColumn)`
  display: flex;
  flex: 1;
  align-items: center;
`;

const ModalBody = styled.main`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ModalButton = styled.button`
  margin: 0 2rem 0.5rem;
  background: none;
  border: 0;
  color: #1779ba;
  font-size: 1rem;

  &:hover {
    color: ${darken(0.1, "#1779ba")}
    text-decoration: underline;
    cursor: pointer;
  }
`;

const ModalFooter = styled.footer`
  width: 100%;
  text-align: center;
`;

export { Modal, ModalBody, ModalButton, ModalFlexColumWrapper, ModalFooter };
