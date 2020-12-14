/*
 * Argos Notary - A new way to secure the Software Supply Chain
 *
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 * Copyright (C) 2019 - 2021 Gerard Borst <gerard.borst@argosnotary.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { darken } from "polished";
import styled from "styled-components";

import { FlexColumn } from "./Flex";

const Modal = styled.section`
  background: ${props => props.theme.modal.bgColor};
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
  color: ${props => props.theme.modal.button.default.color};
  font-size: 1rem;
  outline: 0;

  &:hover {
    color: ${props => darken(0.1, props.theme.modal.button.hover.color)};
    text-decoration: underline;
    cursor: pointer;
  }
`;

const ModalFooter = styled.footer`
  width: 100%;
  text-align: center;
`;

export { Modal, ModalBody, ModalButton, ModalFlexColumWrapper, ModalFooter };
