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
import {
  ILayout,
  ILayoutMetaBlock,
  ILayoutSegment,
  IRule,
  IMatchRule,
  RuleRuleTypeEnum,
  IStep
} from "../../interfaces/ILayout";
import stringify from "json-stable-stringify";
import { signString } from "../../security";

const signLayout = async (
  password: string,
  keyId: string,
  encryptedPrivateKey: string,
  layout: ILayout
): Promise<ILayoutMetaBlock> => {
  const signature = await signString(
    password,
    encryptedPrivateKey,
    serialize(layout)
  );
  return {
    signatures: [{ signature: signature, keyId: keyId, keyAlgorithm: "EC", hashAlgorithm: "SHA384" }],
    layout: layout
  };
};

const serialize = (layout: ILayout): string => {
  return stringify(mapLayout(layout));
};

const mapLayout = (layout: ILayout): ILayout => {
  return {
    keys: layout.keys.map(key => {
      return { ...key };
    }),
    authorizedKeyIds: layout.authorizedKeyIds,
    expectedEndProducts: layout.expectedEndProducts.map(rule => {
      return { ...rule, ruleType: RuleRuleTypeEnum.MATCH };
    }),
    layoutSegments: layout.layoutSegments.map(mapSegment).sort((n1, n2) => {
      if (n1.name > n2.name) {
        return 1;
      }

      if (n1.name < n2.name) {
        return -1;
      }

      return 0;
    })
  };
};

const mapSegment = (segment: ILayoutSegment): ILayoutSegment => {
  return {
    name: segment.name,
    steps: segment.steps.map(mapStep).sort((n1, n2) => {
      if (n1.name > n2.name) {
        return 1;
      }

      if (n1.name < n2.name) {
        return -1;
      }

      return 0;
    })
  };
};

const mapStep = (step: IStep): IStep => {
  return {
    ...step,
    expectedMaterials: step.expectedMaterials.map(mapRule),
    expectedProducts: step.expectedProducts.map(mapRule)
  };
};

const mapRule = (rule: IRule): IRule | IMatchRule => {
  if (rule.ruleType === RuleRuleTypeEnum.MATCH) {
    return {
      ...rule,
      ruleType: RuleRuleTypeEnum.MATCH
    };
  } else {
    return { ruleType: rule.ruleType || RuleRuleTypeEnum.ALLOW, pattern: rule.pattern };
  }
};

export { serialize, signLayout };
