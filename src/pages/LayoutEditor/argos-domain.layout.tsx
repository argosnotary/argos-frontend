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
/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.21.588 on 2020-04-09 14:40:34.

export namespace Domain {
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

  export interface MatchRule extends Rule {
    sourcePathPrefix?: string;
    destinationType: ArtifactType;
    destinationPathPrefix?: string;
    destinationSegmentName: string;
    destinationStepName: string;
  }

  export interface LayoutSegment {
    name: string;
    steps: Step[];
  }

  export interface Rule {
    ruleType: RuleType;
    pattern: string;
  }

  export interface Step {
    name: string;
    authorizedKeyIds: string[];
    requiredNumberOfLinks: number;
    expectedCommand: string[];
    expectedMaterials: Rule[];
    expectedProducts: Rule[];
  }

  export type RuleType =
    | "ALLOW"
    | "CREATE"
    | "DELETE"
    | "DISALLOW"
    | "MATCH"
    | "MODIFY"
    | "REQUIRE";

  export type ArtifactType = "PRODUCTS" | "MATERIALS";
}
