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
import React, { useState } from "react";
import { connect } from "react-redux";

import { Panel } from "../../organisms/Panel";
//import PanelBreadCrumb from "../../molecules/PanelBreadCrumb";
import { getRootNodes, getNode } from "../explorer/treeSlice";
import { createLabel, updateLabel, setLabel, clearLabel } from "./labelSlice";
import LabelForm from "./LabelForm";
import { FeaturePermissionEnum } from "../../util/authorization";
import { Redirect } from "react-router";

function LabelOverview(props: any) {
  const { setLabel, createLabel, updateLabel, clearLabel, label, featurePermission } = props;
  const [disableSave, setDisableSave] = useState(true);
  const [redirect, setRedirect] = useState<boolean>(false);
  const initialValue = { ...label };

  const handleChange = (e: any) => {
    setLabel({ ...label, name: e.currentTarget.value });
    if (e.currentTarget.value !== initialValue.name) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    if (label.id) {
      updateLabel(label);
    } else {
      createLabel(label);
    }
    setDisableSave(true);
  };

  const handleCancel = (e: any) => {
    e.preventDefault();
    clearLabel();
    setRedirect(true);
  };

  return (
    <>
      {redirect ? (
        <Redirect to="/explorer" />
      ) : (
        <Panel
          maxWidth={"37.5vw"}
          resizable={false}
          last={true}
          title={
            label.id
              ? "Update selected label"
              : label.parentLabelId
              ? "Add child label to selected label"
              : "Create new root label"
          }>
          <LabelForm
            label={label}
            disabled={featurePermission !== FeaturePermissionEnum.CHANGE}
            onSave={handleSave}
            onChange={handleChange}
            onCancel={handleCancel}
            disableSave={disableSave}
          />
        </Panel>
      )}
    </>
  );
}

function mapStateToProps(state: any) {
  return {
    label: state.label,
    tree: state.tree
  };
}

const mapDispatchToProps = {
  getRootNodes,
  getNode,
  setLabel,
  clearLabel,
  updateLabel,
  createLabel
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelOverview);
