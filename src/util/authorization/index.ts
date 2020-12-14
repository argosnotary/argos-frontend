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
import { Permission, Role } from "./../../api/api";

export function isAdministrator(roles: Role[] | undefined): boolean {
  if (!roles || roles.length === 0) {
    return false;
  } else {
    return roles.filter(role => role === Role.ADMINISTRATOR).length > 0;
  }
}

export enum FeatureEnum {
  TREE_MANAGEMENT = "TREE_MANAGEMENT",
  PERMISSION_MANAGEMENT = "PERMISSION_MANAGEMENT",
  RELEASE = "RELEASE",
  APPROVE = "APPROVE"
}
export enum FeaturePermissionEnum {
  CHANGE = "CHANGE",
  READ = "READ",
  NONE = "NONE"
}

export function getFeaturePermission(permissions: Permission[], feature: FeatureEnum): FeaturePermissionEnum {
  switch (feature) {
    case FeatureEnum.PERMISSION_MANAGEMENT:
      if (permissions.includes(Permission.LOCAL_PERMISSION_EDIT)) {
        return FeaturePermissionEnum.CHANGE;
      } else if (permissions.includes(Permission.TREE_EDIT)) {
        return FeaturePermissionEnum.READ;
      } else {
        return FeaturePermissionEnum.NONE;
      }
    case FeatureEnum.TREE_MANAGEMENT:
      if (permissions.includes(Permission.TREE_EDIT)) {
        return FeaturePermissionEnum.CHANGE;
      } else {
        return FeaturePermissionEnum.READ;
      }
    case FeatureEnum.APPROVE:
      if (permissions.includes(Permission.LINK_ADD)) {
        return FeaturePermissionEnum.CHANGE;
      } else {
        return FeaturePermissionEnum.READ;
      }
    case FeatureEnum.RELEASE:
      if (permissions.includes(Permission.RELEASE)) {
        return FeaturePermissionEnum.CHANGE;
      } else {
        return FeaturePermissionEnum.READ;
      }
  }
}
