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

export interface LayoutMetaBlock {
  signatures: Signature[];
  layout: Layout;
}

export interface Signature {
  keyId: string;
  signature: string;
}

export interface Layout {
  keys: PublicKey[];
  authorizedKeyIds: string[];
  expectedEndProducts: MatchRule[];
  layoutSegments: LayoutSegment[];
}

export interface PublicKey {
  id: string;
  key: string;
}

export interface MatchRule {
  pattern: string;
  sourcePathPrefix?: string;
  destinationType: MatchRuleDestinationTypeEnum;
  destinationPathPrefix?: string;
  destinationSegmentName: string;
  destinationStepName: string;
}

export enum MatchRuleDestinationTypeEnum {
  PRODUCTS = "PRODUCTS",
  MATERIALS = "MATERIALS"
}

export interface LayoutSegment {
  name: string;
  steps: Array<Step>;
}

export interface Step {
  name: string;
  authorizedKeyIds: string[];
  requiredNumberOfLinks: number;
  expectedCommand: string[];
  expectedMaterials: Rule[];
  expectedProducts: Rule[];
}

export interface Rule {
  ruleType: RuleRuleTypeEnum;
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
