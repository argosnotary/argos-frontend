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
import React, { useContext, useEffect } from "react";
import styled, { ThemeContext } from "styled-components";

import { Permission, Role, TreeNode, TreeNodeTypeEnum } from "../../api";
import { AltPlusIcon, LoaderIcon } from "../../atoms/Icons";
import { FlexColumn } from "../../atoms/Flex";
import { TreeHeadLabelSpan } from "./TreeHeadLabelSpan";
import { getRootNodes, setCurrentNode } from "./treeSlice";
import { connect } from "react-redux";
//import { buildNodeTrail } from "./utils";
import { Link } from "react-router-dom";
import { LinkItem, ParentNodeContainer } from "./ParentNode";
import { Panel } from "../../organisms/Panel";

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

export const NodeContextMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.treeEditor.nodeContextMenuItem.bgColor};
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: ${props => props.theme.treeEditor.nodeContextMenuItem.hover.bgColor};
  }
`;

export const NodeContextMenuItemLabel = styled.span``;

const NodesFlexContainer = styled.ul`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const IconContainer = styled.div`
  display: inline-flex;
  margin: 0 0.2rem 0;
`;

const StyledTreeEditor = styled.div`
  border-right: 2px solid rgb(74 74 74 / 54%);
`;

interface AddAdditionalRootNodesProps {
  setCurrentNode: (node: TreeNode) => void;
}

export function AddAdditionalRootNodes(props: AddAdditionalRootNodesProps): React.ReactElement {
  const { setCurrentNode } = props;
  const theme = useContext(ThemeContext);
  return (
    <TreeNodeContainer depth={1}>
      <IconContainer>
        <AltPlusIcon size={12} color={theme.treeEditor.iconColors.addRootNode} />
      </IconContainer>
      <TreeHeadLabelSpan
        selected={false}
        onClick={e => {
          e.preventDefault();
          const node = {} as TreeNode;
          node.type = TreeNodeTypeEnum.LABEL;
          node.permissions = [Permission.TREE_EDIT];
          setCurrentNode(node);
        }}>
        <LinkItem to={{ pathname: "/label/overview" }}>Create base label...</LinkItem>
      </TreeHeadLabelSpan>
    </TreeNodeContainer>
  );
}

const TreeEditorContainer = styled.aside`
  height: 100vh;
  color: ${props => props.theme.treeEditor.textColor};
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${props => props.theme.treeEditor.bgColor};
  padding: 0 1rem 0 0;
`;

const OnInitializeLoaderContainer = styled.div`
  display: flex;
  align-self: center;
  margin: 1rem;
`;

const OnInitializeLoaderMessage = styled.p`
  align-self: center;
`;

function TreeEditor(props: any): React.ReactElement {
  const { nodes, loading, profile, getRootNodes, setCurrentNode } = props;
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (!(nodes.length > 0)) {
      getRootNodes();
    }
  }, [nodes]);

  function canCreateRootNode(): boolean {
    return profile.roles && profile.roles.includes(Role.ADMINISTRATOR);
  }

  return (
    <StyledTreeEditor>
      <Panel title={"Explorer"} disableFlexGrow={true} resizable={true}>
        <TreeEditorContainer>
          {loading ? (
            <FlexColumn>
              <OnInitializeLoaderContainer>
                <LoaderIcon color={theme.treeEditor.loaders.onPageLoad.color} size={48} />
              </OnInitializeLoaderContainer>

              <OnInitializeLoaderMessage>Loading hierarchy...</OnInitializeLoaderMessage>
            </FlexColumn>
          ) : (
            <NodesFlexContainer>
              {canCreateRootNode() ? <AddAdditionalRootNodes setCurrentNode={setCurrentNode} /> : null}
              {nodes.map((rootNode: TreeNode, index: number) => (
                <ParentNodeContainer key={index} depth={1} node={rootNode} />
              ))}
            </NodesFlexContainer>
          )}
        </TreeEditorContainer>
      </Panel>
    </StyledTreeEditor>
  );
}

function mapStateToProps(state: any) {
  return {
    profile: state.profile,
    nodes: state.tree.nodes,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  getRootNodes,
  setCurrentNode
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeEditor);
