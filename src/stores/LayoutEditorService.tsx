import { ILayout, IPublicKey } from "../interfaces/ILayout";

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
    layout.authorizedKeyIds.push(key.id);
  }
  return { ...layout };
};

export const deleteLayoutAuthorizedKey = (
  layout: ILayout,
  keyToRemove: IPublicKey
): ILayout => {
  const authorizedKeyIndex = layout.authorizedKeyIds.indexOf(keyToRemove.id);

  if (authorizedKeyIndex >= 0) {
    layout.authorizedKeyIds.splice(authorizedKeyIndex, 1);
  }

  if (!isKeyIdUsedInSteps(layout, keyToRemove.id)) {
    const keyIndex = layout.keys.findIndex(key => key.id === keyToRemove.id);
    if (keyIndex >= 0) {
      layout.keys.splice(keyIndex, 1);
    }
  }

  return { ...layout };
};

const isPublicKeyDefined = (layout: ILayout, keyId: string): boolean => {
  return layout.keys.flatMap(key => key.id).indexOf(keyId) >= 0;
};

const isKeyIdDefined = (layout: ILayout, keyId: string): boolean => {
  return layout.authorizedKeyIds.indexOf(keyId) >= 0;
};

const isKeyIdUsedInSteps = (layout: ILayout, keyId: string): boolean => {
  return (
    layout.layoutSegments
      .flatMap(segment => segment.steps)
      .filter(step => step.authorizedKeyIds !== undefined)
      .flatMap(step => step.authorizedKeyIds)
      .indexOf(keyId) >= 0
  );
};
