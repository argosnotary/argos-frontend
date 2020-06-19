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
export namespace Domain {
  export interface ILayout {
    keys: IPublicKey[];
    authorizedKeyIds: string[];
    expectedEndProducts: IMatchRule[];
    layoutSegments: ILayoutSegment[];
  }

  export interface IPublicKey {
    id: string;
    key: string;
  }

  export interface IMatchRule extends IRule {
    sourcePathPrefix?: string;
    destinationType?: ArtifactType;
    destinationPathPrefix?: string;
    destinationSegmentName?: string;
    destinationStepName?: string;
  }

  export interface ILayoutSegment {
    name: string;
    steps: IStep[];
  }

  export interface IRule {
    ruleType: RuleType;
    pattern: string;
  }

  export interface IStep {
    name: string;
    authorizedKeyIds: string[];
    requiredNumberOfLinks: number;
    expectedMaterials: IRule[];
    expectedProducts: IRule[];
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
