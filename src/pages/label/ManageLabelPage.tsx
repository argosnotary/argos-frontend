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
import React from "react";

import {
  WithSideColumnPanel,
  WithSideColumnPanelItem,
  SideColumnHeaderProps
} from "../../organisms/WithSideColumnPanel";
import LabelOverview from "./LabelOverview";
import ManageLabelPermissions from "./ManageLabelPermissions";
import { Panels } from "../../organisms/Panels";
import { connect } from "react-redux";
import { FeatureEnum, FeaturePermissionEnum, getFeaturePermission } from "../../util/authorization";
import TreeEditor from "../explorer/TreeEditor";

function ManageLabelPage(props: any) {
  const { tree } = props;
  const permissions = tree.currentNode.permissions || [];
  const items: WithSideColumnPanelItem[] = [];
  if (getFeaturePermission(permissions, FeatureEnum.TREE_MANAGEMENT) != FeaturePermissionEnum.NONE) {
    items.push({
      icon: "/images/profile.svg",
      path: "/label/overview",
      component: <LabelOverview featurePermission={getFeaturePermission(permissions, FeatureEnum.TREE_MANAGEMENT)} />,
      text: "Overview"
    });
  }
  if (getFeaturePermission(permissions, FeatureEnum.PERMISSION_MANAGEMENT) != FeaturePermissionEnum.NONE) {
    items.push({
      icon: "/images/lock-stripes.svg",
      path: "/label/permissions",
      component: (
        <ManageLabelPermissions
          featurePermission={getFeaturePermission(permissions, FeatureEnum.PERMISSION_MANAGEMENT)}
        />
      ),
      text: "Manage Permissions"
    });
  }

  const header: SideColumnHeaderProps = { icon: "/images/cogs.svg", text: "Manage Label" };
  return <Panels panels={[<TreeEditor key={0} />, <WithSideColumnPanel key={1} items={items} header={header} />]} />; //tree={tree} />;
}

function mapStateToProps(state: any) {
  return {
    tree: state.tree
  };
}

export default connect(mapStateToProps)(ManageLabelPage);
