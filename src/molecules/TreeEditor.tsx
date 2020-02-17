import React, { Dispatch, useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";

import ITreeNode from "../interfaces/ITreeNode";
import {
  AltPlusIcon,
  LabelIcon,
  TriangleIcon,
  LoaderIcon
} from "../atoms/Icons";
import { TreeStateContext, TreeReducerAction } from "../stores/TreeEditorStore";
import ITreeContextMenuItem from "../interfaces/ITreeContextMenuItem";
import FlexColumn from "../atoms/FlexColumn";

interface ITreeEditorProps {
  data: Array<ITreeNode>;
  loading: boolean;
}

interface ITreeNodeContainerProps {
  depth: number;
}

interface ITreeHeadLabelProps {
  selected: boolean;
}

interface IParentNodeProps {
  depth: number;
  node: ITreeNode;
}

interface INodeContextContainerProps {
  x: number;
  y: number;
}

interface INodeContextMenu {
  node: ITreeNode;
}

const TreeNodeContainer = styled.li<ITreeNodeContainerProps>`
  margin: 0.2rem 0;
  position: relative;
  left: ${props => 0.5 + props.depth * 0.2}rem;
`;

const TreeIcon = styled(TriangleIcon)``;

const TreeHead = styled.button`
  background: none;
  border: 0;
  outline: none;
  margin: 0 0.2rem;
  padding: 0;

  &:hover {
    cursor: pointer;
  }
`;

const TreeHeadLabel = styled.span<ITreeHeadLabelProps>`
  user-select: none;
  color: #000;
  cursor: pointer;
  padding: 0.1rem 0.4rem;
  border: 1px solid transparent;
  background-color: ${props => (props.selected ? "#e8feff" : "transparent")}

  &:hover {
    background-color: #E8FEFF;
    border-radius: 2px;
  }
`;

const renderTypeIcon = (type: string) => {
  switch (type) {
    case "LABEL":
      return <LabelIcon color={"#8D99AE"} size={14} />;
  }
};

interface ITypeIconContainerProps {
  hasChildren: boolean | undefined;
}

const TypeIconContainer = styled.div<ITypeIconContainerProps>`
  margin: ${props => (props.hasChildren ? "0 0.4rem" : "0 0.4rem 0 1.5rem")};
  display: inline-flex;
`;

const NodeContextMenuContainer = styled.ul<INodeContextContainerProps>`
  display: flex;
  flex-direction: column;
  background: #fff;
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  display: flex;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 10rem;
  z-index: 4;
`;

const NodeContextMenuItem = styled.li`
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #e8feff;
  }
`;

const NodeContextMenuItemSeparator = styled.hr`
  border: 0;
  border-bottom: 1px solid #e5e5e5;
  margin: 0;
`;

const NodeContextMenuClickCatcher = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const renderContextMenu = (
  node: ITreeNode,
  dispatch: Dispatch<TreeReducerAction>,
  menuitems: Array<ITreeContextMenuItem>
) => {
  return menuitems.map((item, index) => (
    <NodeContextMenuItem
      key={index}
      onClick={() => {
        item.callback(node);
        dispatch({ type: "hidecontextmenu" });
      }}
    >
      {item.label}
      {menuitems.length > 1 && index < menuitems.length ? (
        <NodeContextMenuItemSeparator />
      ) : null}
    </NodeContextMenuItem>
  ));
};

const NodeContextMenu: React.FC<INodeContextMenu> = ({ node }) => {
  const [state, dispatch, _stringlist, contextmenu] = useContext(
    TreeStateContext
  );

  return (
    <>
      <NodeContextMenuClickCatcher
        onClick={() => dispatch({ type: "hidecontextmenu" })}
      />
      <NodeContextMenuContainer x={state.contextMenu.x} y={state.contextMenu.y}>
        {contextmenu.map(item =>
          item.type === node.type
            ? renderContextMenu(node, dispatch, item.menuitems)
            : null
        )}
      </NodeContextMenuContainer>
    </>
  );
};

const NodesFlexContainer = styled.ul`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const ParentNode: React.FC<IParentNodeProps> = ({ depth, node }) => {
  const [displayNode, setDisplayNode] = useState(false);
  const theme = useContext(ThemeContext);

  const [
    state,
    dispatch,
    _stringlist,
    _contextmenu,
    _cbCreateRootNode,
    cbGetNodeChildren,
    isFetchingNodesData
  ] = useContext(TreeStateContext);

  useEffect(() => {
    const nodeShouldBeExpanded = state.toggledNodes.find(
      (toggledNode: string) => toggledNode === node.referenceId
    );

    if (nodeShouldBeExpanded) {
      setDisplayNode(true);
    }
  }, [state.toggledNodes, node.referenceId, displayNode]);

  return (
    <TreeNodeContainer depth={depth}>
      {node.hasChildren ? (
        <TreeHead
          onClick={() => {
            setDisplayNode(!displayNode);
            dispatch({
              type: "updatetogglednodes",
              id: node.referenceId
            });

            if (node.children && node.children.length === 0) {
              cbGetNodeChildren(node.referenceId);
            }
          }}
        >
          {isFetchingNodesData &&
          node.referenceId ===
            state.toggledNodes[state.toggledNodes.length - 1] ? (
            <LoaderIcon
              size={12}
              color={theme.treeEditor.loaders.onFetchChildren.color}
            />
          ) : (
            <TreeIcon
              color={"#1779ba"}
              size={12}
              {...(displayNode ? { transform: "rotate(35)" } : "")}
            />
          )}
        </TreeHead>
      ) : null}
      <TypeIconContainer hasChildren={node.hasChildren}>
        {renderTypeIcon(node.type)}
      </TypeIconContainer>
      <TreeHeadLabel
        selected={state.contextMenu.id === node.referenceId}
        onContextMenu={e => {
          const { clientX, clientY } = e;
          e.preventDefault();
          dispatch({
            type: "showcontextmenu",
            id: node.referenceId,
            clientX,
            clientY
          });
        }}
      >
        {node.name}
      </TreeHeadLabel>
      {state.contextMenu.show && state.contextMenu.id === node.referenceId ? (
        <NodeContextMenu node={node} />
      ) : null}
      {node.children && node.children.length > 0 && displayNode
        ? renderChildrenNodes(depth + 1, node.children)
        : null}
    </TreeNodeContainer>
  );
};

const renderChildrenNodes = (depth: number, children: Array<ITreeNode>) => {
  return (
    <NodesFlexContainer>
      {children.map((childNode, index) => (
        <ParentNode key={index} depth={depth + 1} node={childNode} />
      ))}
    </NodesFlexContainer>
  );
};

const IconContainer = styled.div`
  display: inline-flex;
  margin: 0 0.2rem 0;
`;

const AddAdditionalRootNodes = () => {
  const [
    _state,
    _dispatch,
    stringlist,
    _contextmenu,
    cbCreateRootNode
  ] = useContext(TreeStateContext);

  return (
    <TreeNodeContainer depth={1}>
      <IconContainer>
        <AltPlusIcon size={12} color={"#1779ba"} />
      </IconContainer>
      <TreeHeadLabel selected={false} onClick={cbCreateRootNode}>
        {stringlist.createrootnode}
      </TreeHeadLabel>
    </TreeNodeContainer>
  );
};

const TreeEditorContainer = styled.aside`
  border: 1rem solid #e0e0e0;
  background-color: #f1f1f1;
  height: 100vh;
  width: 25vw;
  padding: 1rem;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const OnInitializeLoaderContainer = styled.div`
  display: flex;
  align-self: center;
  margin: 1rem;
`;

const OnInitializeLoaderMessage = styled.p`
  align-self: center;
`;

const TreeEditor: React.FC<ITreeEditorProps> = ({ data, loading }) => {
  const [state, dispatch] = useContext(TreeStateContext);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch({
        type: "storedata",
        data
      });
    }
  }, [data]);

  return (
    <TreeEditorContainer>
      {loading ? (
        <FlexColumn>
          <OnInitializeLoaderContainer>
            <LoaderIcon
              color={theme.treeEditor.loaders.onPageLoad.color}
              size={48}
            />
          </OnInitializeLoaderContainer>

          <OnInitializeLoaderMessage>
            Loading hierarchy...
          </OnInitializeLoaderMessage>
        </FlexColumn>
      ) : (
        <NodesFlexContainer>
          <AddAdditionalRootNodes />
          {state.data.map((rootNode, index) => (
            <ParentNode key={index} depth={1} node={rootNode} />
          ))}
        </NodesFlexContainer>
      )}
    </TreeEditorContainer>
  );
};

export default TreeEditor;
