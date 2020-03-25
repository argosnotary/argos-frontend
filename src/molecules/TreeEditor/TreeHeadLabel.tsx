import React, {useContext} from "react";
import ITreeNode from "../../interfaces/ITreeNode";
import styled from "styled-components";
import {TreeReducerActionTypes, TreeStateContext} from "../../stores/treeEditorStore";

interface ITreeHeadLabelProps {
    node: ITreeNode;
}

interface ITreeHeadLabelSpanProps {
    selected: boolean;
}

export const TreeHeadLabelSpan = styled.span<ITreeHeadLabelSpanProps>`
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

const TreeHeadLabel: React.FC<ITreeHeadLabelProps> = ({
                                                          node
                                                      }) => {
    const treeContext = useContext(TreeStateContext);
    const contextMenu = treeContext.treeContextMenu.find(
        entry => entry.type === node.type
    );
    const isEnabled = contextMenu && contextMenu.menuitems.filter(item => item.visible(node)).length > 0;
    return (
        <TreeHeadLabelSpan
            selected={treeContext.treeState.contextMenu.id === node.referenceId ||
            treeContext.selectedNodeReferenceId === node.referenceId}
            onContextMenu={e => {
                if (isEnabled) {
                    const {clientX, clientY} = e;
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
        </TreeHeadLabelSpan>
    );
};

export default TreeHeadLabel;