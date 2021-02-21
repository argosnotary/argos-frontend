/*
 * Argos Notary - A new way to secure the Software Supply Chain
 *
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 * Copyright (C) 2019 - 2021 Gerard Borst <gerard.borst@argosnotary.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";

import { TreeNode, TreeNodeTypeEnum, Label } from "../../api";
import { TriangleIcon, LoaderIcon, ChainIcon, LabelIcon, RobotIcon } from "../../atoms/Icons";
import { TreeState, updateToggledNodes, getNodeChildren, setCurrentNode } from "./treeSlice";
import { setLabel } from "../label/labelSlice";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { TreeHeadLabelSpan } from "./TreeHeadLabelSpan";
import { ContextMenu, ContextmenuItemsProps } from "../../organisms/ContextMenu";
import { FeatureEnum, FeaturePermissionEnum, getFeaturePermission } from "../../util/authorization";

interface TreeNodeContainerProps {
  depth: number;
}

interface NodeContextContainerProps {
  x: number;
  y: number;
}

const TreeNodeContainer = styled.li<TreeNodeContainerProps>`
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

const renderTypeIcon = (theme: any, type: string) => {
  switch (type) {
    case "LABEL":
      return <LabelIcon color={theme.treeEditor.iconColors.label} size={14} />;
    case "SUPPLY_CHAIN":
      return <ChainIcon color={theme.treeEditor.iconColors.chain} size={14} />;
    case "SERVICE_ACCOUNT":
      return <RobotIcon color={theme.treeEditor.iconColors.robot} size={14} />;
    default:
      return <h1>Missing icon</h1>;
  }
};

interface ITypeIconContainerProps {
  hasChildren: boolean | undefined;
}

const TypeIconContainer = styled.div<ITypeIconContainerProps>`
  margin: ${props => (props.hasChildren ? "0 0.4rem" : "0 0.4rem 0 1.5rem")};
  display: inline-flex;
`;

export const NodeContextMenuContainer = styled.ul<NodeContextContainerProps>`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.treeEditor.nodeContextMenuContainer.bgColor};
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  display: flex;
  border: 1px solid ${props => props.theme.treeEditor.nodeContextMenuContainer.borderColor};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 10rem;
  z-index: 4;
`;

export const LinkItem = styled(Link)`
  text-decoration: none;
`;

interface LabelNodeContextMenuProps {
  node: TreeNode;
  displayMenu: boolean;
  setDisplayMenu: (display: boolean) => void;
}

function LabelNodeContextMenu(props: LabelNodeContextMenuProps) {
  const { node, displayMenu, setDisplayMenu } = props;
  const dispatch = useDispatch();
  const changePermission =
    getFeaturePermission(node.permissions || [], FeatureEnum.TREE_MANAGEMENT) === FeaturePermissionEnum.CHANGE;
  const items: ContextmenuItemsProps[] = [
    {
      linkPath: "/label/overview",
      labelText: "Add child label",
      handleOnClick: () => {
        setDisplayMenu(false);
        dispatch(setLabel({ name: "", parentLabelId: node.referenceId } as Label));
      }
    },
    {
      linkPath: "/supplychain",
      labelText: "Add supply chain",
      handleOnClick: () => {
        setDisplayMenu(false);
        dispatch(
          setCurrentNode({
            type: TreeNodeTypeEnum.LABEL,
            parentLabelId: node.referenceId
          } as TreeNode)
        );
      }
    },
    {
      linkPath: "/serviceaccount",
      labelText: "Add service account",
      handleOnClick: () => {
        setDisplayMenu(false);
        dispatch(
          setCurrentNode({
            type: TreeNodeTypeEnum.LABEL,
            parentLabelId: node.referenceId
          } as TreeNode)
        );
      }
    }
  ];
  return (
    <ContextMenu disabled={!changePermission} displayMenu={displayMenu} setDisplayMenu={setDisplayMenu} items={items} />
  );
}

function ServiceAccountTreeContextMenu(props: any) {
  const { node } = props;
  const dispatch = useDispatch();
  return <></>;
}

function SupplyChainTreeContextMenu(props: any) {
  const { node } = props;
  const dispatch = useDispatch();
  return <></>;
}

interface position {
  x: number;
  y: number;
}

interface nodeContextMenuProps {
  node: TreeNode;
  position: position;
  displayMenu: boolean;
  setDisplayMenu: (e: any) => void;
}

function NodeContextMenu(props: nodeContextMenuProps) {
  const { node, position, displayMenu, setDisplayMenu } = props;
  return (
    <>
      <NodeContextMenuContainer x={position.x} y={position.y}>
        {node.type === TreeNodeTypeEnum.LABEL ? (
          <LabelNodeContextMenu node={node} displayMenu={displayMenu} setDisplayMenu={setDisplayMenu} />
        ) : node.type === TreeNodeTypeEnum.SERVICE_ACCOUNT ? (
          <ServiceAccountTreeContextMenu node={node} />
        ) : node.type === TreeNodeTypeEnum.SUPPLY_CHAIN ? (
          <SupplyChainTreeContextMenu node={node} />
        ) : (
          <></>
        )}
      </NodeContextMenuContainer>
    </>
  );
}

const NodesFlexContainer = styled.ul`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

export interface ParentNodeProps {
  depth: number;
  node: TreeNode;
  tree: TreeState;
  loading: boolean;
  getNodeChildren: (node: TreeNode) => void;
  setCurrentNode: (node: TreeNode) => void;
}

function ParentNode(props: any) {
  const { depth, node, tree, loading, getNodeChildren, setCurrentNode } = props;
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [displayNode, setDisplayNode] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 } as position);
  //const [error, setError] = useState({});
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const nodeShouldBeExpanded =
      tree.toggledNodes.find((toggledNode: TreeNode) => toggledNode.referenceId === node.referenceId) !== undefined;
    if (nodeShouldBeExpanded) {
      if (node.hasChildren && (!node.children || !(node.children.length > 0))) {
        getNodeChildren(node);
      }
      setDisplayNode(true);
    } else {
      setDisplayNode(false);
    }
  }, [tree.toggledNodes]);

  return (
    <>
      {loading ? (
        <LoaderIcon size={12} color={theme.treeEditor.loaders.onFetchChildren.color} />
      ) : (
        <TreeNodeContainer depth={depth}>
          {node.hasChildren ? (
            <TreeHead
              onClick={() => {
                dispatch(updateToggledNodes(node));
              }}>
              <TreeIcon
                color={theme.treeEditor.iconColors.expandNode}
                size={12}
                {...(displayNode && node.children && node.children.length > 0 ? { transform: "rotate(35)" } : "")}
              />
            </TreeHead>
          ) : null}
          <TypeIconContainer hasChildren={node.hasChildren}>{renderTypeIcon(theme, node.type)}</TypeIconContainer>
          <TreeHeadLabelSpan
            selected={tree.currentNode.referenceId && tree.currentNode.referenceId === node.referenceId}
            onContextMenu={e => {
              e.preventDefault();
              setShowContextMenu(true);
              setMenuPosition({ x: e.clientX, y: e.clientY });
              setCurrentNode(node);
            }}
            onClick={e => {
              e.preventDefault();
              dispatch(setCurrentNode(node));
            }}>
            {node.type === TreeNodeTypeEnum.LABEL ? (
              <LinkItem to={{ pathname: "/label/overview" }}>{node.name}</LinkItem>
            ) : node.type == TreeNodeTypeEnum.SERVICE_ACCOUNT ? (
              <LinkItem to="/serviceaccount/">{node.name}</LinkItem>
            ) : node.type === TreeNodeTypeEnum.SUPPLY_CHAIN ? (
              <LinkItem to="/supplychain/">{node.name}</LinkItem>
            ) : null}
          </TreeHeadLabelSpan>
          {showContextMenu ? (
            <NodeContextMenu
              node={node}
              position={menuPosition}
              displayMenu={showContextMenu}
              setDisplayMenu={setShowContextMenu}
            />
          ) : null}
          {!loading && displayNode ? (
            <NodesFlexContainer>
              {node.children.map((childNode: TreeNode, index: number) => (
                <ParentNodeContainer key={index} depth={depth + 1} node={childNode} />
              ))}
            </NodesFlexContainer>
          ) : null}
        </TreeNodeContainer>
      )}
    </>
  );
}

function mapStateToProps(state: any) {
  return {
    tree: state.tree as TreeState,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  getNodeChildren,
  updateToggledNodes,
  setCurrentNode
};

export const ParentNodeContainer = connect(mapStateToProps, mapDispatchToProps)(ParentNode);
