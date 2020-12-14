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

const KeyIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
  >
    <title>key</title>
    <path
      fill={color}
      d="M22 0c-5.523 0-10 4.477-10 10 0 0.626 0.058 1.238 0.168 1.832l-12.168 12.168v6c0 1.105 0.895 2 2 2h2v-2h4v-4h4v-4h4l2.595-2.595c1.063 0.385 2.209 0.595 3.405 0.595 5.523 0 10-4.477 10-10s-4.477-10-10-10zM24.996 10.004c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
    />
  </svg>
);

export default KeyIcon;
