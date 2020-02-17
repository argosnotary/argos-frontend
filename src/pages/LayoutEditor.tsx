import produce from "immer";
import React, { Dispatch, useReducer } from "react";
import styled from "styled-components";
import { useFormik } from "formik";

import Action from "../types/Action";
import { LoaderButton } from "../atoms/Button";
import DataRequest from "../types/DataRequest";
import FlexColumn from "../atoms/FlexColumn";
import FlexRow from "../atoms/FlexRow";
import FormInput from "../molecules/FormInput";
import InputErrorLabel from "../atoms/InputErrorLabel";
import ITreeNode from "../interfaces/ITreeNode";
import IState from "../interfaces/IState";
import TreeEditor from "../molecules/TreeEditor";
import useDataApi from "../hooks/useDataApi";
import useToken from "../hooks/useToken";
import {
  initialTreeState,
  TreeStateContext,
  treeReducer,
  TreeReducerAction,
  ITreeReducerState
} from "../stores/TreeEditorStore";

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

interface IEditorState {
  nodeReferenceId?: string;
  firstPanelView: string;
}

type IEditorAction =
  | { type: "addlabel"; nodeReferenceId: string }
  | { type: "resetpane" };

const editorReducer = (state: IEditorState, action: IEditorAction) => {
  switch (action.type) {
    case "addlabel":
      return {
        ...state,
        firstPanelView: "addlabel",
        nodeReferenceId: action.nodeReferenceId
      };
    case "resetpane":
      return {
        ...state,
        firstPanelView: "",
        nodeReferenceId: ""
      };
  }
};

interface IContextProps {
  state: IEditorState;
  dispatch: Dispatch<IEditorAction>;
}

const StateContext = React.createContext<
  [IEditorState, Dispatch<IEditorAction>]
>([
  {} as IEditorState,
  () => {
    return;
  }
]);

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
    nodeReferenceId: ""
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

  interface ILabelPostResponse {
    id: string;
    name: string;
    parentLabelId?: string;
  }

  const findNode = (
    nodes: Array<ITreeNode>,
    id: string
  ): ITreeNode | undefined => {
    if (nodes.length == 0) return;

    return (
      nodes.find(n => n.referenceId === id) ||
      findNode(
        nodes.flatMap(n => n.children || []),
        id
      )
    );
  };

  const appendSingleNode = (node: ITreeNode, parentLabelId?: string) => {
    return produce((draftState: ITreeReducerState) => {
      if (parentLabelId) {
        const matchNode = findNode(draftState.data, parentLabelId);

        if (matchNode?.hasChildren && matchNode.children) {
          matchNode.children.push(node);
        } else if (matchNode) {
          matchNode.children = [node];
          matchNode.hasChildren = true;
        }
      } else {
        draftState.data.push(node);
      }
    });
  };

  const appendNodeChildrenToParent = (
    parentNode: ITreeNode,
    children: Array<ITreeNode>
  ) => {
    return produce((draftState: ITreeReducerState) => {
      const matchNode = findNode(draftState.data, parentNode.referenceId);

      if (matchNode) {
        matchNode.children = children;
      }
    });
  };

  const appendLabelChildrenToTree = (
    treeState: ITreeReducerState,
    treeDispatch: (msg: TreeReducerAction) => void,
    parentNode: ITreeNode
  ) => {
    if (parentNode && parentNode.children) {
      const newState = appendNodeChildrenToParent(
        parentNode,
        parentNode.children
      );

      treeDispatch({
        type: "storedata",
        data: newState(treeState).data
      });
    }
  };

  const appendNewLabelToTree = (
    treeState: ITreeReducerState,
    treeDispatch: (msg: TreeReducerAction) => void,
    label: ILabelPostResponse
  ) => {
    const parsedNode: ITreeNode = {
      hasChildren: false,
      referenceId: label.id,
      name: label.name,
      type: "LABEL"
    };

    const newState = label.parentLabelId
      ? appendSingleNode(parsedNode, label.parentLabelId)
      : appendSingleNode(parsedNode);

    treeDispatch({
      type: "storedata",
      data: newState(treeState).data
    });

    dispatch({
      type: "resetpane"
    });
  };

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
          appendNewLabelToTree(treeState, treeDispatch, label);
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
          callback: (node: ITreeNode) =>
            dispatch({ type: "addlabel", nodeReferenceId: node.referenceId })
        }
      ]
    }
  ];

  const cbCreateRootNode = () => {
    dispatch({ type: "addlabel", nodeReferenceId: "" });
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
              treeChildrenFetchState.isLoading
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
