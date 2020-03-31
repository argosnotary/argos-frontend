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
export enum PermissionTypes {
  READ = "READ",
  TREE_EDIT = "TREE_EDIT",
  LOCAL_PERMISSION_EDIT = "LOCAL_PERMISSION_EDIT",
  ASSIGN_ROLE = "ASSIGN_ROLE",
  LINK_ADD = "LINK_ADD",
  LAYOUT_ADD = "LAYOUT_ADD",
  VERIFY = "VERIFY",
  NPA_EDIT = "NPA_EDIT"
}

export type PermissionType =
  | PermissionTypes.READ
  | PermissionTypes.TREE_EDIT
  | PermissionTypes.LOCAL_PERMISSION_EDIT
  | PermissionTypes.ASSIGN_ROLE
  | PermissionTypes.LINK_ADD
  | PermissionTypes.LAYOUT_ADD
  | PermissionTypes.VERIFY
  | PermissionTypes.NPA_EDIT;
