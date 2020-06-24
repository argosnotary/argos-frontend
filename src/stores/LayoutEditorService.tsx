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
import { ILayout, IPublicKey, IRule } from "../interfaces/ILayout";

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

  if (!isPublicKeyDefined(layout, key.id)) {
    layout.keys.push(key);
  }

  if (!isKeyIdDefined(layout, key.id)) {
    layout.authorizedKeyIds = [...layout.authorizedKeyIds, key.id];
  }
  return layout;
};

export const deleteLayoutAuthorizedKey = (
  layout: ILayout,
  keyToRemove: IPublicKey
): ILayout => {
  const authorizedKeyIndex = layout.authorizedKeyIds.indexOf(keyToRemove.id);

  if (authorizedKeyIndex >= 0) {
    layout.authorizedKeyIds.splice(authorizedKeyIndex, 1);
    layout.authorizedKeyIds = [...layout.authorizedKeyIds];
  }

  if (!isKeyIdUsedInSteps(layout, keyToRemove.id)) {
    const keyIndex = layout.keys.findIndex(key => key.id === keyToRemove.id);
    if (keyIndex >= 0) {
      layout.keys.splice(keyIndex, 1);
    }
  }

  return layout;
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

const isPublicKeyDefined = (layout: ILayout, keyId: string): boolean => {
  return layout.keys.flatMap(key => key.id).indexOf(keyId) >= 0;
};

const isKeyIdDefined = (layout: ILayout, keyId: string): boolean => {
  return layout.authorizedKeyIds.indexOf(keyId) >= 0;
};

const isKeyIdUsedInSteps = (layout: ILayout, keyId: string): boolean => {
  if (layout.layoutSegments) {
    return (
      layout.layoutSegments
        .flatMap(segment => segment.steps)
        .filter(step => step.authorizedKeyIds !== undefined)
        .flatMap(step => step.authorizedKeyIds)
        .indexOf(keyId) >= 0
    );
  }
  return false;
};
