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
import React, { Dispatch, useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";

import ITreeNode from "../../interfaces/ITreeNode";
import {
  AltPlusIcon,
  TriangleIcon,
  LoaderIcon,
  ChainIcon,
  LabelIcon,
  RobotIcon
} from "../../atoms/Icons";
import {
  TreeStateContext,
  TreeReducerAction,
  TreeReducerActionTypes,
  ITreeStateContext
} from "../../stores/treeEditorStore";
import ITreeContextMenuItem from "../../interfaces/ITreeContextMenuItem";
import FlexColumn from "../../atoms/FlexColumn";

interface ITreeEditorProps {
  data: Array<ITreeNode>;
  loading: boolean;
  context: ITreeStateContext;
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
  width: 100%;
`;

const TreeIcon = styled(TriangleIcon)``;

export const TreeHead = styled.button`
  background: none;
  border: 0;
  outline: none;
  margin: 0 0.2rem;
  padding: 0;

  &:hover {
    cursor: pointer;
  }
`;

export const TreeHeadLabel = styled.span<ITreeHeadLabelProps>`
  user-select: none;
  cursor: pointer;
  padding: 0.1rem 0.4rem;
  border: 1px solid transparent;
  background-color: ${props =>
    props.selected
      ? props.theme.treeEditor.treeHeadLabel.bgColor
      : "transparent"};

  &:hover {
    background-color: ${props => props.theme.treeEditor.treeHeadLabel.bgColor};
    border-radius: 2px;
  }
`;

const renderTypeIcon = (theme: any, type: string) => {
  switch (type) {
    case "LABEL":
      return <LabelIcon color={theme.treeEditor.iconColors.label} size={14} />;
    case "SUPPLY_CHAIN":
      return <ChainIcon color={theme.treeEditor.iconColors.chain} size={14} />;
    case "NON_PERSONAL_ACCOUNT":
      return <RobotIcon color={theme.treeEditor.iconColors.robot} size={14} />;
  }
};

interface ITypeIconContainerProps {
  hasChildren: boolean | undefined;
}

const TypeIconContainer = styled.div<ITypeIconContainerProps>`
  margin: ${props => (props.hasChildren ? "0 0.4rem" : "0 0.4rem 0 1.5rem")};
  display: inline-flex;
`;

export const NodeContextMenuContainer = styled.ul<INodeContextContainerProps>`
  display: flex;
  flex-direction: column;
  background: ${props =>
    props.theme.treeEditor.nodeContextMenuContainer.bgColor};
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  display: flex;
  border: 1px solid
    ${props => props.theme.treeEditor.nodeContextMenuContainer.borderColor};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 10rem;
  z-index: 4;
`;

export const NodeContextMenuItem = styled.li`
  background-color: ${props =>
    props.theme.treeEditor.nodeContextMenuItem.bgColor};
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: ${props =>
      props.theme.treeEditor.nodeContextMenuItem.hover.bgColor};
  }
`;

const NodeContextMenuItemSeparator = styled.hr`
  border: 0;
  border-bottom: 1px solid
    ${props => props.theme.treeEditor.nodeContextMenuItemSeparator.borderColor};
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
    <React.Fragment key={index}>
      <NodeContextMenuItem
        key={index}
        onClick={() => {
          item.callback(node);
          dispatch({ type: TreeReducerActionTypes.HIDECONTEXTMENU });
        }}
      >
        {item.label}
      </NodeContextMenuItem>
      {menuitems.length > 1 && index < menuitems.length - 1 ? (
        <NodeContextMenuItemSeparator />
      ) : null}
    </React.Fragment>
  ));
};

const NodeContextMenu: React.FC<INodeContextMenu> = ({ node }) => {
  const treeContext = useContext(TreeStateContext);

  return (
    <>
      <NodeContextMenuClickCatcher
        onClick={() =>
          treeContext.treeDispatch({
            type: TreeReducerActionTypes.HIDECONTEXTMENU
          })
        }
      />
      <NodeContextMenuContainer
        x={treeContext.treeState.contextMenu.x}
        y={treeContext.treeState.contextMenu.y}
      >
        {treeContext.treeContextMenu.map(item =>
          item.type === node.type
            ? renderContextMenu(node, treeContext.treeDispatch, item.menuitems)
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

export const ParentNode: React.FC<IParentNodeProps> = ({ depth, node }) => {
  const [displayNode, setDisplayNode] = useState(false);
  const theme = useContext(ThemeContext);

  const treeContext = useContext(TreeStateContext);

  useEffect(() => {
    const nodeShouldBeExpanded = treeContext.treeState.toggledNodes.find(
      (toggledNode: string) => toggledNode === node.referenceId
    );

    if (nodeShouldBeExpanded) {
      setDisplayNode(true);
    }
  }, [treeContext.treeState.toggledNodes, node.referenceId, displayNode]);

  return (
    <TreeNodeContainer depth={depth}>
      {node.hasChildren ? (
        <TreeHead
          onClick={() => {
            setDisplayNode(!displayNode);
            treeContext.treeDispatch({
              type: TreeReducerActionTypes.UPDATETOGGLEDNODES,
              id: node.referenceId
            });

            if (node.children && node.children.length === 0) {
              treeContext.cbGetNodeChildren(node.referenceId);
            }
          }}
        >
          {treeContext.isLoading &&
          node.referenceId ===
            treeContext.treeState.toggledNodes[
              treeContext.treeState.toggledNodes.length - 1
            ] ? (
            <LoaderIcon
              size={12}
              color={theme.treeEditor.loaders.onFetchChildren.color}
            />
          ) : (
            <TreeIcon
              color={theme.treeEditor.iconColors.expandNode}
              size={12}
              {...(displayNode ? { transform: "rotate(35)" } : "")}
            />
          )}
        </TreeHead>
      ) : null}
      <TypeIconContainer hasChildren={node.hasChildren}>
        {renderTypeIcon(theme, node.type)}
      </TypeIconContainer>
      <TreeHeadLabel
        selected={
          treeContext.treeState.contextMenu.id === node.referenceId ||
          treeContext.selectedNodeReferenceId === node.referenceId
        }
        onContextMenu={e => {
          const hasContextMenu = treeContext.treeContextMenu.find(
            entry => entry.type === node.type
          );

          if (hasContextMenu) {
            const { clientX, clientY } = e;
            e.preventDefault();
            treeContext.treeDispatch({
              type: TreeReducerActionTypes.SHOWCONTEXTMENU,
              id: node.referenceId,
              clientX,
              clientY
            });
          }
        }}
        onClick={() => {
          const typeClickHandler = treeContext.treeClickHandlers.find(
            handler => handler.type === node.type
          );

          if (typeClickHandler) {
            typeClickHandler.callback(node);
          }
        }}
      >
        {node.name}
      </TreeHeadLabel>
      {treeContext.treeState.contextMenu.show &&
      treeContext.treeState.contextMenu.id === node.referenceId ? (
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

export const AddAdditionalRootNodes = () => {
  const treeContext = useContext(TreeStateContext);
  const theme = useContext(ThemeContext);

  return (
    <TreeNodeContainer depth={1}>
      <IconContainer>
        <AltPlusIcon
          size={12}
          color={theme.treeEditor.iconColors.addRootNode}
        />
      </IconContainer>
      <TreeHeadLabel selected={false} onClick={treeContext.cbCreateRootNode}>
        {treeContext.treeStringList.createrootnode}
      </TreeHeadLabel>
    </TreeNodeContainer>
  );
};

const TreeEditorContainer = styled.aside`
  height: 100vh;
  color: ${props => props.theme.treeEditor.textColor};
  overflow: auto;
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

const TreeEditor: React.FC<ITreeEditorProps> = ({ data, loading, context }) => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (data && data.length > 0) {
      context.treeDispatch({
        type: TreeReducerActionTypes.STOREDATA,
        data
      });
    }
  }, [data]);

  return (
    <TreeStateContext.Provider value={context}>
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
            {context.treeState.data.map((rootNode, index) => (
              <ParentNode key={index} depth={1} node={rootNode} />
            ))}
          </NodesFlexContainer>
        )}
      </TreeEditorContainer>
    </TreeStateContext.Provider>
  );
};

export default TreeEditor;
