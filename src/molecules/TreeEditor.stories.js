import React from "react";

import TreeEditor from "./TreeEditor";

const data = [
  {
    name: "string that is very long",
    type: "LABEL",
    referenceId: "string",
    children: [
      {
        name: "a",
        type: "LABEL",
        referenceId: "a",
        children: [
          {
            name: "b",
            type: "LABEL",
            referenceId: "b",
            children: [
              {
                name: "another label that is very very long",
                type: "LABEL",
                referenceId: "1",
                children: []
              },
              {
                name: "ba",
                type: "LABEL",
                referenceId: "2",
                children: []
              }
            ]
          },
          {
            name: "c",
            type: "LABEL",
            referenceId: "c",
            children: []
          }
        ]
      }
    ]
  },
  {
    name: "string 2",
    type: "LABEL",
    referenceId: "string 2",
    children: [
      {
        name: "a",
        type: "LABEL",
        referenceId: "aa",
        children: [
          {
            name: "b",
            type: "LABEL",
            referenceId: "bb",
            children: []
          },
          {
            name: "c",
            type: "LABEL",
            referenceId: "cc",
            children: []
          }
        ]
      }
    ]
  }
];

export default {
  title: "TreeEditor"
};

export const labelEditor = () => <TreeEditor data={data} />;
