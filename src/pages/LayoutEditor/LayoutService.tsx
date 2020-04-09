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
  Layout,
  LayoutMetaBlock,
  LayoutSegment
} from "../../interfaces/ILayout";
import { Domain } from "./argos-domain.layout";

const signLayout = (layoutJson: string) => {
  const layout: Layout = JSON.parse(layoutJson);

  const domainLayout: Domain.Layout = {
    keys: layout.keys.map(key => {
      return { ...key };
    }),
    authorizedKeyIds: layout.authorizedKeyIds,
    expectedEndProducts: layout.expectedEndProducts.map(rule => {
      return { ...rule, ruleType: "MATCH" };
    }),
    layoutSegments: layout.layoutSegments.map(segment => {
      return { name: segment.name, steps: [] };
    })
  };
};

const mapSegment = (segment: LayoutSegment) => {};

export { signLayout };
