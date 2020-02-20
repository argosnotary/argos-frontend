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
  findNode,
  getNearestParent,
  buildNodeTrail,
  updateSingleNode,
  appendSingleNode
} from "./utils";

import json from "./sampleData.json";

describe("TreeEditor utils", () => {
  describe("findNode", () => {
    it("returns nested node from data tree based on reference id", () => {
      const res = findNode(
        json.sampleData,
        "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1"
      );

      const expectedNode = {
        name: "evensmaller",
        type: "LABEL",
        referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
        hasChildren: false,
        children: []
      };

      expect(res).toEqual(expectedNode);
    });
  });
  describe("appendSingleNode", () => {
    it("append a single node in provided tree state at root level, and returns immutable copy of tree state", () => {
      const newNodeData = {
        name: "neo",
        type: "LABEL",
        referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
        hasChildren: false,
        children: []
      };

      const newStateProducer = appendSingleNode(newNodeData);
      const treeState = {
        data: []
      };

      expect(newStateProducer(treeState).data).toContain(newNodeData);
    });

    it("append a single node in provided tree state to parent, and returns immutable copy of tree state", () => {
      const existingData = {
        name: "neo",
        type: "LABEL",
        referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
        hasChildren: false,
        children: []
      };

      const newNodeData = {
        name: "trinity",
        type: "LABEL",
        referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a22222",
        hasChildren: false,
        children: []
      };

      const newStateProducer = appendSingleNode(
        newNodeData,
        existingData.referenceId
      );

      const treeState = {
        data: [existingData]
      };

      expect(newStateProducer(treeState).data[0].children).toContain(
        newNodeData
      );
    });
  });
  describe("updateSingleNode", () => {
    it("finds, updates a node in provided tree state, and returns immutable copy of tree state", () => {
      const newNodeData = {
        name: "evensmallerx",
        type: "LABEL",
        referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
        hasChildren: false,
        children: []
      };

      const newStateProducer = updateSingleNode(newNodeData);
      const treeState = {
        data: json.sampleData
      };

      const res = findNode(
        newStateProducer(treeState).data,
        "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1"
      );

      expect(res.name).toBe("evensmallerx");
    });
  });
  describe("getNearestParent", () => {
    it("returns parent node from tree as first entry in results array", () => {
      const parent = getNearestParent(
        [],
        json.sampleData,
        "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1"
      )[0];

      const expectedParent = {
        name: "jojogreatgrand",
        type: "LABEL",
        referenceId: "3f316771-211e-446f-a98c-a77c5148e640",
        hasChildren: true,
        children: [
          {
            name: "evensmaller",
            type: "LABEL",
            referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
            hasChildren: false,
            children: []
          }
        ]
      };

      expect(parent).toEqual(expectedParent);
    });

    it("returns empty node when there is no parent to be found (i.e. in case of a root node)", () => {
      const parent = getNearestParent(
        [],
        json.sampleData,
        "ad0e6313-b388-4481-80f4-955b3d1a5a51"
      )[0];

      expect(parent.length).toBe(0);
    });
  });

  describe("buildNodeTrail", () => {
    it("returns a breadcrumb trail of nodes based on selected node", () => {
      const trail = Array.from(
        buildNodeTrail(
          [],
          json.sampleData,
          "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1"
        ),
        t => t.name
      ).join(" / ");

      expect(trail).toEqual(
        "neo / trinity / mimi / jojo / jojokido / jojogreatgrand / evensmaller"
      );
    });
  });
});
