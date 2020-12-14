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
import { Signature } from "./Signature"

export interface LayoutMetaBlock {
  signatures: Signature[];
  layout: Layout;
}

export interface Layout {
  keys: PublicKey[];
  authorizedKeyIds: string[];
  expectedEndProducts: Rule[];
  layoutSegments: LayoutSegment[];
}

export interface PublicKey {
  keyId: string;
  publicKey: string;
}

export interface LayoutSegment {
  name: string;
  steps: Array<Step>;
}

export class Step {
  public constructor(public name: string,
    public authorizedKeyIds?: string[],
    public requiredNumberOfLinks?: number,
    public expectedMaterials?: Rule[],
    public expectedProducts?: Rule[]) {}
}

export interface Rule {
  ruleType?: RuleRuleTypeEnum;
  pattern: string;
}

export interface MatchRule extends Rule {
  sourcePathPrefix?: string;
  destinationType?: RuleDestinationTypeEnum;
  destinationPathPrefix?: string;
  destinationSegmentName?: string;
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

export enum LayoutValidationMessageTypes {
  DATA_INPUT = "DATA_INPUT",
  MODEL_CONSISTENCY = "MODEL_CONSISTENCY"
}

export interface LayoutValidationMessage {
  field?: string;
  type: LayoutValidationMessageTypes;
  message: string;
}
