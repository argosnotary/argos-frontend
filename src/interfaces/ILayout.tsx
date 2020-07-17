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

export interface ILayoutMetaBlock {
  signatures: ISignature[];
  layout: ILayout;
}

export interface ISignature {
  keyId: string;
  signature: string;
  keyAlgorithm: string;
  hashAlgorithm: string;
}

export interface ILayout {
  keys: IPublicKey[];
  authorizedKeyIds: string[];
  expectedEndProducts: IRule[];
  layoutSegments: ILayoutSegment[];
}

export interface IPublicKey {
  keyId: string;
  publicKey: string;
}

export interface ILayoutSegment {
  name: string;
  steps: Array<IStep>;
}

export interface IStep {
  name: string;
  authorizedKeyIds: string[];
  requiredNumberOfLinks: number;
  expectedMaterials: IRule[];
  expectedProducts: IRule[];
}

export interface IRule {
  ruleType?: RuleRuleTypeEnum;
  pattern: string;
  sourcePathPrefix?: string;
  destinationPathPrefix?: string;
  destinationSegmentName?: string;
  destinationType?: RuleDestinationTypeEnum;
  destinationStepName?: string;
}

export enum RuleRuleTypeEnum {
  ALLOW = "ALLOW",
  CREATE = "CREATE",
  CREATE_OR_MODIFY = "CREATE_OR_MODIFY",
  DELETE = "DELETE",
  DISALLOW = "DISALLOW",
  MATCH = "MATCH",
  MODIFY = "MODIFY",
  REQUIRE = "REQUIRE"
}

export enum RuleDestinationTypeEnum {
  PRODUCTS = "PRODUCTS",
  MATERIALS = "MATERIALS"
}

export enum ILayoutValidationMessageTypes {
  DATA_INPUT = "DATA_INPUT",
  MODEL_CONSISTENCY = "MODEL_CONSISTENCY"
}

export interface ILayoutValidationMessage {
  field?: string;
  type: ILayoutValidationMessageTypes;
  message: string;
}
