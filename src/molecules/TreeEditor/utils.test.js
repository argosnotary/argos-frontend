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
    appendNodeChildrenToParent,
    appendSingleNode,
    buildNodeTrail,
    findNode,
    getNearestParent,
    removeNode,
    updateSingleNode
} from "./utils";

import json from "./sampleData.json";

describe("TreeEditor utils", () => {
    describe("findNode", () => {
        it("returns nested node from data tree based on reference id", () => {
            const res = findNode(
                json.sampleData,
                "975f93be-3c7b-4b11-a2c1-2fd48e27c7df"
            );

            const expectedNode = {
                name: "label_e",
                type: "LABEL",
                referenceId: "975f93be-3c7b-4b11-a2c1-2fd48e27c7df",
                hasChildren: false,
                children: [],
                permissions: [
                    "ASSIGN_ROLE",
                    "LOCAL_PERMISSION_EDIT",
                    "READ",
                    "TREE_EDIT",
                    "VERIFY"
                ]
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


    describe("removeNode", () => {
        it("delete child should return copy of state with child removed", () => {
            const ID = "1c41baf6-f9e4-4e06-8237-5c6a37a52ff2";
            const existingDataChild1 = {
                name: "neochild",
                type: "LABEL",
                parentLabelId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
                referenceId: ID,
                hasChildren: false,
                children: []
            }

            const existingDataChild2 = {
                name: "neochild",
                type: "LABEL",
                parentLabelId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
                referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff3",
                hasChildren: false,
                children: []
            }

            const existingData = {
                name: "neo",
                type: "LABEL",
                referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
                hasChildren: true,
                children: [existingDataChild1,existingDataChild2]
            };

            const newStateProducer = removeNode(
                existingDataChild2,
                existingData.referenceId
            );

            const treeState = {
                data: [existingData]
            };
            expect(newStateProducer(treeState).data[0].children.length).toBe(1);
            expect(newStateProducer(treeState).data[0].hasChildren).toBe(true);
            expect(newStateProducer(treeState).data[0].children[0].referenceId).toBe(ID);

        });

        it("delete root node should return copy of state with root node removed", () => {
            const existingData1 = {
                name: "neo",
                type: "LABEL",
                referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
                hasChildren: false,
                children: []
            };


            const ID = "1c41baf6-f9e4-4e06-8237-5c6a37a52ff2";
            const existingData2 = {
                name: "neo",
                type: "LABEL",
                referenceId: ID,
                hasChildren: false,
                children: []
            };

            const newStateProducer = removeNode(
                existingData1
            );

            const treeState = {
                data: [existingData1,existingData2]
            };

            expect(newStateProducer(treeState).data.length).toBe(1);
            expect(newStateProducer(treeState).data[0].referenceId).toBe(ID);

        });


    });

    describe("updateSingleNode", () => {
        it("finds, updates a node in provided tree state, and returns immutable copy of tree state", () => {
            const newNodeData = {
                name: "label_eee",
                type: "LABEL",
                referenceId: "975f93be-3c7b-4b11-a2c1-2fd48e27c7df",
                hasChildren: false,
                children: [],
                permissions: [
                    "ASSIGN_ROLE",
                    "LOCAL_PERMISSION_EDIT",
                    "READ",
                    "TREE_EDIT",
                    "VERIFY"
                ]
            };

            const newStateProducer = updateSingleNode(newNodeData);
            const treeState = {
                data: json.sampleData
            };

            const res = findNode(
                newStateProducer(treeState).data,
                "975f93be-3c7b-4b11-a2c1-2fd48e27c7df"
            );

            expect(res.name).toBe("label_eee");
        });
    });
    describe("appendNodeChildrenToParent", () => {
        it("appends child nodes in the parent node of the provided tree state, and returns immutable copy of tree state", () => {
            const existingData = {
                name: "neo",
                type: "LABEL",
                referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a52ff1",
                hasChildren: false,
                children: []
            };

            const newNodeData = [
                {
                    name: "trinity",
                    type: "LABEL",
                    referenceId: "1c41baf6-f9e4-4e06-8237-5c6a37a22222",
                    hasChildren: false,
                    children: []
                }
            ];

            const newStateProducer = appendNodeChildrenToParent(
                existingData,
                newNodeData
            );

            const treeState = {
                data: [existingData]
            };

            expect(newStateProducer(treeState).data[0].children).toEqual(newNodeData);
        });
    });
    describe("getNearestParent", () => {
        it("returns parent node from tree as first entry in results array", () => {
            const parent = getNearestParent(
                [],
                json.sampleData,
                "975f93be-3c7b-4b11-a2c1-2fd48e27c7df"
            )[0];

            expect(parent).toEqual(json.sampleData[1]);
        });

        it("returns empty node when there is no parent to be found (i.e. in case of a root node)", () => {
            const parent = getNearestParent(
                [],
                json.sampleData,
                "c1e7e2ad-6754-40c1-9c83-8e43c3772f18"
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
                    "d3cca05f-3b17-4c7e-8a80-ea2382c55f11"
                ),
                t => t.name
            ).join(" / ");

            expect(trail).toEqual("label_a / label_c / label_d");
        });
    });
});
