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

import React from "react";
import { serialize } from "./LayoutService";
import {
  RuleDestinationTypeEnum,
  RuleRuleTypeEnum
} from "../../interfaces/ILayout";

const PUBLIC_KEY =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoDIw5p3LYjFLr+JFvWOz0KQ22x538O2BoQO4e4EorYYkSMHn00pabqAQ9z6+nA+l43+Jxb5eJrHoroV4YZN8WDMsjY0eB1Q1K6hl3SHgeqTvA2i2GlpDg7zLRnP9YWbUwbWP+UWtRFK0x1lCCkSmxsP2HAom/T11/MMd/kitVt0rGsq8wQH7PLsOZ8zPh4sQ0iyCVLil6+VF6zsT83dKFocdfZWAywkQ6sVZbuzFCe+pLQktwTz1Ir8mMQi6sPh57b5yyFCSVstK1lKf+OQTtuuQzYz2bvpr9zkXr0O80IdTXOnoO1vM1lJuRPT3J0Zcr2nYdbmIskp4ZQyezXMqawIDAQAB";

it("test serialize", () => {
  const seralized = serialize({
    keys: [{ id: "keyId", key: PUBLIC_KEY }],
    expectedEndProducts: [
      {
        destinationSegmentName: "destinationSegmentName",
        destinationType: RuleDestinationTypeEnum.PRODUCTS,
        destinationStepName: "destinationStepName",
        pattern: "MatchFiler",
        destinationPathPrefix: "destinationPathPrefix",
        sourcePathPrefix: "sourcePathPrefix"
      }
    ],
    layoutSegments: [
      {
        name: "segment 1",
        steps: [
          {
            name: "step b",
            requiredNumberOfLinks: 1,
            expectedMaterials: [
              { ruleType: RuleRuleTypeEnum.ALLOW, pattern: "AllowRule" },
              {
                ruleType: RuleRuleTypeEnum.REQUIRE,
                pattern: "RequireRule"
              }
            ],
            expectedProducts: [
              { ruleType: RuleRuleTypeEnum.CREATE, pattern: "CreateRule" },
              {
                ruleType: RuleRuleTypeEnum.MODIFY,
                pattern: "ModifyRule"
              }
            ],
            authorizedKeyIds: ["key2", "key1"]
          },
          {
            name: "step a",
            authorizedKeyIds: ["step a key 2", "step a key 1"],
            requiredNumberOfLinks: 23,
            expectedProducts: [
              {
                ruleType: RuleRuleTypeEnum.DISALLOW,
                pattern: "DisAllowRule"
              },
              {
                destinationPathPrefix: "destinationPathPrefix",
                sourcePathPrefix: "sourcePathPrefix",
                destinationStepName: "destinationStepName",
                destinationSegmentName: "segment 1",
                destinationType: RuleDestinationTypeEnum.MATERIALS,
                pattern: "MatchRule",
                ruleType: RuleRuleTypeEnum.MATCH
              }
            ],
            expectedMaterials: []
          }
        ]
      }
    ],
    authorizedKeyIds: ["key2", "key1"]
  });

  expect(seralized).toMatchSnapshot();
});
