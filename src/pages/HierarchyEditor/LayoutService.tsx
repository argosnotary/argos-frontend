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
import {
  ILayout,
  ILayoutMetaBlock,
  ILayoutSegment,
  IRule,
  RuleRuleTypeEnum,
  IStep
} from "../../interfaces/ILayout";
import { Domain } from "./argos-domain.layout";
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
    signatures: [{ signature: signature, keyId: keyId }],
    layout: layout
  };
};

const serialize = (layout: ILayout): string => {
  return stringify(mapLayout(layout));
};

const mapLayout = (layout: ILayout): Domain.ILayout => {
  return {
    keys: layout.keys.map(key => {
      return { ...key };
    }),
    authorizedKeyIds: layout.authorizedKeyIds,
    expectedEndProducts: layout.expectedEndProducts.map(rule => {
      return { ...rule, ruleType: "MATCH" };
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

const mapSegment = (segment: ILayoutSegment): Domain.ILayoutSegment => {
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

const mapStep = (step: IStep): Domain.IStep => {
  return {
    ...step,
    expectedMaterials: step.expectedMaterials.map(mapRule),
    expectedProducts: step.expectedProducts.map(mapRule)
  };
};

const mapRule = (rule: IRule): Domain.IRule | Domain.IMatchRule => {
  if (rule.ruleType === RuleRuleTypeEnum.MATCH) {
    return {
      ...rule,
      ruleType: "MATCH"
    };
  } else {
    return { ruleType: rule.ruleType, pattern: rule.pattern };
  }
};

export { serialize, signLayout };
