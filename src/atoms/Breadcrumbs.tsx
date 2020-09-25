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
import styled from "styled-components";

const NodesBreadCrumb = styled.p`
  font-style: italic;
  font-size: 0.8rem;
  margin: 0.2rem;
  color: ${props => props.theme.treeEditor.breadCrumb.textColor};
`;

const LastBreadCrumb = styled.span`
  color: ${props => props.theme.treeEditor.lastBreadCrumb.textColor};
`;

export { NodesBreadCrumb, LastBreadCrumb };
