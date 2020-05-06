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

import React, { Dispatch, useState } from "react";
import { ILayout, ILayoutSegment } from "../../../../interfaces/ILayout";
import GenericForm, {
  IGenericFormSchema
} from "../../../../organisms/GenericForm";
import { FormPermissions } from "../../../../types/FormPermission";

interface ILayoutEditorProps {
  setLayout: Dispatch<ILayout>;
  layout: ILayout;
}

interface ISegmentFormFormValues {
  segmentName: string;
}

const segmentFormSchema: IGenericFormSchema = [
  {
    labelValue: "SegmentName*",
    name: "segmentName",
    formType: "text"
  }
];

const LayoutEditor: React.FC<ILayoutEditorProps> = ({ layout, setLayout }) => {
  const [activeLayoutSegment, setActiveLayoutSegment] = useState<
    ILayoutSegment | undefined
  >();
  const [editMode, setEditMode] = useState<boolean>(false);

  const onAddSegment = () => {
    setEditMode(false);
    setActiveLayoutSegment({ name: "", steps: [] });
  };

  const onUpdateSegment = (layoutSegment: ILayoutSegment) => {
    setEditMode(true);
    setActiveLayoutSegment(layoutSegment);
  };

  const onDeleteSegment = (layoutSegment: ILayoutSegment) => {
    const index = layout.layoutSegments.indexOf(layoutSegment);
    if (index >= 0) {
      layout.layoutSegments.splice(index, 1);
    }
    setLayout({ ...layout });
  };

  const onAddOrUpdateSegment = (formValues: ISegmentFormFormValues) => {
    if (activeLayoutSegment) {
      activeLayoutSegment.name = formValues.segmentName;
      if (!editMode) {
        if (layout.layoutSegments === undefined) {
          layout.layoutSegments = [];
        }
        layout.layoutSegments.push(activeLayoutSegment);
      }
      setLayout({ ...layout });
      setActiveLayoutSegment(undefined);
    }
  };

  const validateSegmentForm = (values: ISegmentFormFormValues) => {
    const errors = {} as ISegmentFormFormValues;
    if (!values.segmentName) {
      errors.segmentName = "Please fill in a segment name.";
    } else if (!/^([A-Za-z0-9_-]*)?$/.test(values.segmentName)) {
      errors.segmentName =
        "Invalid segment name (only alphanumeric characters, hyphen and underscore allowed).";
    } else if (
      layout.layoutSegments &&
      layout.layoutSegments.findIndex(
        segment => segment.name === values.segmentName
      ) >= 0
    ) {
      errors.segmentName = "Segment name should be unique.";
    }
    return errors;
  };

  return (
    <>
      {activeLayoutSegment ? (
        <GenericForm
          schema={segmentFormSchema}
          permission={FormPermissions.EDIT}
          isLoading={false}
          validate={validateSegmentForm}
          onCancel={() => setActiveLayoutSegment(undefined)}
          onSubmit={onAddOrUpdateSegment}
          confirmationLabel={editMode ? "Update" : "Add"}
          cancellationLabel={"Cancel"}
          initialValues={{ segmentName: activeLayoutSegment.name }}
        />
      ) : (
        <button onClick={onAddSegment}>add segment</button>
      )}
      <ul>
        {layout.layoutSegments
          ? layout.layoutSegments.map((segment, _key) => (
              <li key={segment.name}>
                {segment.name}
                <button onClick={() => onUpdateSegment(segment)}>edit</button>
                <button onClick={() => onDeleteSegment(segment)}>delete</button>
              </li>
            ))
          : null}
      </ul>
    </>
  );
};

export default LayoutEditor;
