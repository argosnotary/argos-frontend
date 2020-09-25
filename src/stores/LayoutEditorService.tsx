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
import { ILayout, IPublicKey, IRule, IStep } from "../interfaces/ILayout";

export const addLayoutAuthorizedKey = (
  layout: ILayout,
  key: IPublicKey
): ILayout => {
  if (layout.keys === undefined) {
    layout.keys = [];
  }

  if (layout.authorizedKeyIds === undefined) {
    layout.authorizedKeyIds = [];
  }

  if (!isPublicKeyDefined(layout, key.keyId)) {
    layout.keys.push(key);
  }

  if (!isKeyIdDefined(layout, key.keyId)) {
    layout.authorizedKeyIds = [...layout.authorizedKeyIds, key.keyId];
  }
  return layout;
};

export const deleteLayoutAuthorizedKey = (
  layout: ILayout,
  keyToRemove: IPublicKey
): ILayout => {
  const authorizedKeyIndex = layout.authorizedKeyIds.indexOf(keyToRemove.keyId);

  if (authorizedKeyIndex >= 0) {
    layout.authorizedKeyIds.splice(authorizedKeyIndex, 1);
    layout.authorizedKeyIds = [...layout.authorizedKeyIds];
  }

  if (!isKeyIdUsedInSteps(layout, keyToRemove.keyId)) {
    const keyIndex = layout.keys.findIndex(key => key.keyId === keyToRemove.keyId);
    if (keyIndex >= 0) {
      layout.keys.splice(keyIndex, 1);
    }
  }

  return layout;
};

export const addStepAuthorizedKey = (
  layout: ILayout,
  key: IPublicKey,
  step: IStep
): ILayout => {
  if (layout.keys === undefined) {
    layout.keys = [];
  }

  if (step.authorizedKeyIds === undefined) {
    step.authorizedKeyIds = [];
  }

  if (!isPublicKeyDefined(layout, key.keyId)) {
    layout.keys.push(key);
  }

  if (step.authorizedKeyIds.indexOf(key.keyId) < 0) {
    step.authorizedKeyIds = [...step.authorizedKeyIds, key.keyId];
  }
  return layout;
};

export const deleteStepAuthorizedKey = (
  layout: ILayout,
  keyToRemove: IPublicKey,
  step: IStep
): ILayout => {
  const stepAuthorizedKeyIndex = step.authorizedKeyIds.indexOf(keyToRemove.keyId);

  if (stepAuthorizedKeyIndex >= 0) {
    step.authorizedKeyIds.splice(stepAuthorizedKeyIndex, 1);
    step.authorizedKeyIds = [...step.authorizedKeyIds];
  }

  if (!isKeyIdUsedInSteps(layout, keyToRemove.keyId)) {
    const keyIndex = layout.keys.findIndex(key => key.keyId === keyToRemove.keyId);
    if (keyIndex >= 0) {
      layout.keys.splice(keyIndex, 1);
    }
  }

  return layout;
};

export const getStepNamesForSegment = (
  layout: ILayout,
  segmentName: string
) => {
  return layout && layout.layoutSegments
    ? layout.layoutSegments
        .filter(segment => segment.name === segmentName)
        .flatMap(segment => segment.steps)
        .map(step => step.name)
    : [];
};

export const getSegmentNames = (layout: ILayout) => {
  return layout && layout.layoutSegments
    ? layout.layoutSegments.map(segment => segment.name)
    : [];
};

export const addExpectedEndProduct = (
  layout: ILayout,
  rule: IRule
): ILayout => {
  if (layout.expectedEndProducts === undefined) {
    layout.expectedEndProducts = [];
  }
  layout.expectedEndProducts = [...layout.expectedEndProducts, rule];
  return layout;
};

export const editExpectedEndProduct = (layout: ILayout): ILayout => {
  layout.expectedEndProducts = [...layout.expectedEndProducts];
  return { ...layout };
};

export const removeExpectedEndProduct = (
  layout: ILayout,
  rule: IRule
): ILayout => {
  const expectedEndProductIndex = layout.expectedEndProducts.indexOf(rule);

  if (expectedEndProductIndex >= 0) {
    layout.expectedEndProducts.splice(expectedEndProductIndex, 1);
  }
  layout.expectedEndProducts = [...layout.expectedEndProducts];
  return layout;
};

export const removeMaterialRule = (
  layout: ILayout,
  rule: IRule,
  step: IStep
): ILayout => {
  const expectedMaterialsIndex = step.expectedMaterials.indexOf(rule);

  if (expectedMaterialsIndex >= 0) {
    step.expectedMaterials.splice(expectedMaterialsIndex, 1);
  }
  step.expectedMaterials = [...step.expectedMaterials];
  return layout;
};

export const removeProductRule = (
  layout: ILayout,
  rule: IRule,
  step: IStep
): ILayout => {
  const expectedProductIndex = step.expectedProducts.indexOf(rule);

  if (expectedProductIndex >= 0) {
    step.expectedProducts.splice(expectedProductIndex, 1);
  }
  step.expectedProducts = [...step.expectedProducts];
  return layout;
};

export const addMaterialRule = (
  layout: ILayout,
  rule: IRule,
  step: IStep
): ILayout => {
  if (step.expectedMaterials === undefined) {
    step.expectedMaterials = [];
  }
  step.expectedMaterials = [...step.expectedMaterials, rule];
  return layout;
};

export const addProductRule = (
  layout: ILayout,
  rule: IRule,
  step: IStep
): ILayout => {
  if (step.expectedProducts === undefined) {
    step.expectedProducts = [];
  }
  step.expectedProducts = [...step.expectedProducts, rule];
  return layout;
};

export const editProductRule = (layout: ILayout, step: IStep): ILayout => {
  step.expectedProducts = [...step.expectedProducts];
  return layout;
};

export const editMaterialRule = (layout: ILayout, step: IStep): ILayout => {
  step.expectedMaterials = [...step.expectedMaterials];
  return layout;
};

export const updateRequiredNumberOfLinks = (
  layout: ILayout,
  step: IStep,
  requiredNumberOfLinks: number
): ILayout => {
  step.requiredNumberOfLinks = requiredNumberOfLinks;
  return layout;
};

const isPublicKeyDefined = (layout: ILayout, keyId: string): boolean => {
  return layout.keys.flatMap(key => key.keyId).indexOf(keyId) >= 0;
};

const isKeyIdDefined = (layout: ILayout, keyId: string): boolean => {
  return layout.authorizedKeyIds.indexOf(keyId) >= 0;
};

const isKeyIdUsedInSteps = (layout: ILayout, keyId: string): boolean => {
  return (
    (layout.authorizedKeyIds && layout.authorizedKeyIds.indexOf(keyId) >= 0) ||
    (layout.layoutSegments &&
      layout.layoutSegments
        .flatMap(segment => segment.steps)
        .filter(step => step.authorizedKeyIds !== undefined)
        .flatMap(step => step.authorizedKeyIds)
        .indexOf(keyId) >= 0)
  );
};
