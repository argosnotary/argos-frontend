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
export interface ApprovalConfig {
  stepName: string;
  segmentName: string;
  artifactCollectorSpecifications: Array<ArtifactCollector>;
}

export enum ArtifactCollectorType {
  XLDEPLOY = "XLDEPLOY",
  GIT = "GIT"
}

export interface ArtifactCollector {
  name: string;
  type: ArtifactCollectorType;
  uri: string;
  context: XLDeployContext | GitContext;
}

export interface XLDeployContext {
  applicationName: string;
}

export interface GitContext {
  repository: string;
}
