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
export interface IApprovalConfig {
  stepName: string;
  segmentName: string;
  artifactCollectorSpecifications: Array<IArtifactCollector>;
}

export enum ArtifactCollectorType {
  XLDEPLOY = "XLDEPLOY",
  GIT = "GIT"
}

export interface IArtifactCollector {
  name: string;
  type: ArtifactCollectorType;
  uri: string;
  context: IXLDeployContext | IGitContext;
}

export interface IXLDeployContext {
  applicationName: string;
}

export interface IGitContext {
  repository: string;
}
