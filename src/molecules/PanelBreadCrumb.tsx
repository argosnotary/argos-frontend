import React from "react";
import { NodesBreadCrumb, LastBreadCrumb } from "../atoms/Breadcrumbs";
import ContentSeparator from "../atoms/ContentSeparator";
import ITreeNode from "../interfaces/ITreeNode";

interface IPanelBreadCrumb {
  breadcrumb: string;
  node: ITreeNode;
}

const PanelBreadCrumb: React.FC<IPanelBreadCrumb> = ({ breadcrumb, node }) => {
  if (breadcrumb.length === 0) {
    return null;
  }

  return (
    <>
      <NodesBreadCrumb>
        Selected: {breadcrumb}
        <LastBreadCrumb>
          {breadcrumb.length > 0 ? " / " : ""}
          {node.name}
        </LastBreadCrumb>
      </NodesBreadCrumb>
      <ContentSeparator />
    </>
  );
};
export default PanelBreadCrumb;
