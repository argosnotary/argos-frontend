/*
 * Copyright (C) 2020 Argos Notary Coöperatie UA
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
import React from "react";
import { Select } from "./DropDown";

export default {
  title: "DropDown"
};

export const defaultDropdown = () => (
  <Select>
    <option value="select">select...</option>
    <option value="BRANCH">branch</option>
    <option value="TAG">tag</option>
    <option value="COMMIT_HASH">commit hash</option>
  </Select>
);
