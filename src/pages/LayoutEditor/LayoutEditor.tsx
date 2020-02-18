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
import React, { useReducer } from "react";
import styled from "styled-components";
import { useFormik } from "formik";

import Action from "../../types/Action";
import { LoaderButton } from "../../atoms/Button";
import DataRequest from "../../types/DataRequest";
import FlexColumn from "../../atoms/FlexColumn";
import FlexRow from "../../atoms/FlexRow";
import FormInput from "../../molecules/FormInput";
import InputErrorLabel from "../../atoms/InputErrorLabel";
import ITreeNode from "../../interfaces/ITreeNode";
import IState from "../../interfaces/IState";
import TreeEditor from "../../molecules/TreeEditor/TreeEditor";
import useDataApi from "../../hooks/useDataApi";
import useToken from "../../hooks/useToken";
import {
  initialTreeState,
  TreeStateContext,
  treeReducer
} from "../../stores/treeEditorStore";

import { buildNodeTrail } from "../../molecules/TreeEditor/utils";
import ILabelPostResponse from "../../interfaces/ILabelPostResponse";

import { editorReducer, StateContext } from "../../stores/layoutEditorStore";
import { appendNewLabelToTree, appendLabelChildrenToTree } from "./utils";

const PanelsContainer = styled.section`
  width: 75vw;
`;

const Panel = styled.section`
  background-color: ${props => props.theme.layoutPage.panel.bgColor};
  border: 1rem solid ${props => props.theme.layoutPage.panel.borderColor};
  border-left-width: 0;
  padding: 1rem;
  height: 100vh;
  width: 50%;
  display: flex;
  flex-direction: column;
`;

const SecondPanel = styled(Panel)`
  height: 100vh;
`;

const dataFetchReducer = (state: IState, action: Action<IState>) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.results,
        isLoading: false
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
  }
};

interface ILabelNameFormValues {
  labelname: string;
}

const validate = (values: ILabelNameFormValues) => {
  const errors = {} as any;

  if (!values.labelname) {
    errors.labelname = "Please fill in a label name.";
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/i.test(values.labelname)) {
    errors.labelname =
      "Invalid label name (only alphanumeric characters and underscore allowed).";
  }

  return errors;
};

const ContentSeparator = styled.hr`
  padding: 0;
  margin: 0 0 1rem;
  border: 0;
  border-bottom: 1px solid
    ${props => props.theme.layoutPage.panel.contentSeparator};
`;

const LayoutEditor = () => {
  const [state, dispatch] = useReducer(editorReducer, {
    firstPanelView: "",
    nodeReferenceId: "",
    breadcrumb: "",
    selectedNodeName: ""
  });
  const [localStorageToken] = useToken();
  const getTreeDataRequest: DataRequest = {
    method: "get",
    token: localStorageToken,
    url: "/api/hierarchy"
  };

  const [treeDataState, _setTreeDataRequest] = useDataApi(
    dataFetchReducer,
    getTreeDataRequest
  );

  const [labelPostState, setLabelPostRequest] = useDataApi(dataFetchReducer);
  const [treeState, treeDispatch] = useReducer(treeReducer, initialTreeState);
  const [treeChildrenFetchState, setTreeChildrenFetchRequest] = useDataApi(
    dataFetchReducer
  );

  const formik = useFormik({
    initialValues: {
      labelname: ""
    },
    onSubmit: values => {
      const data: any = {};

      data.name = values.labelname;

      if (state.nodeReferenceId !== "") {
        data.parentLabelId = state.nodeReferenceId;
      }

      const dataRequest: DataRequest = {
        data,
        method: "post",
        token: localStorageToken,
        url: "/api/label",
        cbSuccess: (label: ILabelPostResponse) => {
          appendNewLabelToTree(treeState, treeDispatch, dispatch, label);
          formik.resetForm();
        }
      };

      setLabelPostRequest(dataRequest);
    },
    validate
  });

  const treeStringList = {
    createrootnode: "Create base label..."
  };

  const treeContextMenu = [
    {
      type: "LABEL",
      menuitems: [
        {
          label: "Add label",
          callback: (node: ITreeNode) => {
            const trail = buildNodeTrail([], treeState.data, node.referenceId);
            const breadcrumb = Array.from(trail.slice(0, -1), t => t.name).join(
              " / "
            );
            const selectedNodeName = Array.from(trail.slice(-1))[0].name;

            dispatch({
              type: "addlabel",
              nodeReferenceId: node.referenceId,
              breadcrumb,
              selectedNodeName
            });
          }
        }
      ]
    }
  ];

  const cbCreateRootNode = () => {
    dispatch({
      type: "addlabel",
      nodeReferenceId: "",
      breadcrumb: "",
      selectedNodeName: ""
    });
  };

  const cbGetNodeChildren = (parentId: string) => {
    const dataRequest: DataRequest = {
      params: {
        HierarchyMode: "MAX_DEPTH"
      },
      method: "get",
      token: localStorageToken,
      url: `/api/hierarchy/${parentId}`,
      cbSuccess: (node: ITreeNode) => {
        appendLabelChildrenToTree(treeState, treeDispatch, node);
      }
    };

    setTreeChildrenFetchRequest(dataRequest);
  };

  const NodesBreadCrumb = styled.p`
    font-style: italic;
    font-size: 0.8rem;
    margin: 0.2rem;
    color: ${props => props.theme.treeEditor.breadCrumb.textColor};
  `;

  const LastBreadCrumb = styled.span`
    color: ${props => props.theme.treeEditor.lastBreadCrumb.textColor};
  `;

  return (
    <FlexColumn>
      <FlexRow>
        <StateContext.Provider value={[state, dispatch]}>
          <TreeStateContext.Provider
            value={[
              treeState,
              treeDispatch,
              treeStringList,
              treeContextMenu,
              cbCreateRootNode,
              cbGetNodeChildren,
              treeChildrenFetchState.isLoading,
              state.nodeReferenceId
            ]}
          >
            <TreeEditor
              data={treeDataState.data}
              loading={treeDataState.isLoading}
            />
          </TreeStateContext.Provider>
          <PanelsContainer>
            <FlexRow>
              <Panel>
                {state.firstPanelView === "addlabel" ? (
                  <form onSubmit={formik.handleSubmit}>
                    {state.selectedNodeName !== "" ? (
                      <>
                        <NodesBreadCrumb>
                          Selected: {state.breadcrumb}
                          <LastBreadCrumb>
                            {state.breadcrumb.length > 0 ? " / " : ""}
                            {state.selectedNodeName}
                          </LastBreadCrumb>
                        </NodesBreadCrumb>
                        <ContentSeparator />
                      </>
                    ) : null}
                    <FormInput
                      labelValue="Label name*"
                      name="labelname"
                      formType="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.labelname}
                    />
                    {formik.touched.labelname && formik.errors.labelname ? (
                      <InputErrorLabel>
                        {formik.errors.labelname}
                      </InputErrorLabel>
                    ) : null}
                    <ContentSeparator />
                    <LoaderButton
                      buttonType="submit"
                      loading={labelPostState.isLoading}
                    >
                      Add label
                    </LoaderButton>
                  </form>
                ) : null}
              </Panel>
              <SecondPanel>&nbsp;</SecondPanel>
            </FlexRow>
          </PanelsContainer>
        </StateContext.Provider>
      </FlexRow>
    </FlexColumn>
  );
};

export default LayoutEditor;
export { StateContext };
