import React from "react";
import styled from "styled-components";

import { SelectList, SelectListItem } from "./SelectList";

const StoryContainer = styled.div`
  max-width: 20rem;
`;

export default {
  title: "SelectList"
};

const dummyData = [
  {
    fieldName: "gender",
    fieldValue: "male",
    labelValue: "male"
  },
  {
    fieldName: "gender",
    fieldValue: "female",
    labelValue: "female"
  },
  {
    fieldName: "gender",
    fieldValue: "non",
    labelValue: "non"
  }
];

export const defaultList = () => (
  <StoryContainer>
    <SelectList>
      {dummyData.map((entry, index) => (
        <SelectListItem
          key={index}
          fieldName={entry.fieldName}
          fieldValue={entry.fieldValue}
          onSelect={() => {
            alert(entry.fieldValue);
          }}>
          {entry.labelValue}
        </SelectListItem>
      ))}
    </SelectList>
  </StoryContainer>
);
