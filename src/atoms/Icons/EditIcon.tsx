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

import IconProps from "../../model/IconProps";

const EditIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24">
    <path
      fill={color}
      d="M21.561 5.318l-2.879-2.879c-0.293-0.293-0.677-0.439-1.061-0.439-0.385 0-0.768 0.146-1.061 0.439l-3.56 3.561h-9c-0.552 0-1 0.447-1 1v13c0 0.553 0.448 1 1 1h13c0.552 0 1-0.447 1-1v-9l3.561-3.561c0.293-0.293 0.439-0.677 0.439-1.061s-0.146-0.767-0.439-1.060zM11.5 14.672l-2.172-2.172 6.293-6.293 2.172 2.172-6.293 6.293zM8.939 13.333l1.756 1.728-1.695-0.061-0.061-1.667zM16 19h-11v-11h6l-3.18 3.18c-0.293 0.293-0.478 0.812-0.629 1.289-0.16 0.5-0.191 1.056-0.191 1.47v3.061h3.061c0.414 0 1.108-0.1 1.571-0.29 0.464-0.19 0.896-0.347 1.188-0.64l3.18-3.070v6zM18.5 7.672l-2.172-2.172 1.293-1.293 2.171 2.172-1.292 1.293z"></path>
  </svg>
);

export default EditIcon;
