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

const ChainIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
  >
    <path
      fill={color}
      d="M31.414 0.586c-0.781-0.781-2.059-0.781-2.84 0l-4.070 4.074c-1.668-1.109-3.582-1.66-5.504-1.66-2.559 0-5.117 0.977-7.070 2.93l-6 6c-3.422 3.418-3.844 8.703-1.273 12.582l-4.070 4.074c-0.781 0.781-0.781 2.047 0 2.828 0.39 0.391 0.901 0.586 1.413 0.586s1.023-0.195 1.414-0.586l4.070-4.074c1.668 1.109 3.594 1.66 5.516 1.66 2.559 0 5.117-0.977 7.070-2.93l5.988-6c3.422-3.418 3.844-8.703 1.273-12.582l4.082-4.074c0.782-0.781 0.782-2.047 0.001-2.828zM24.988 13c0 1.602-0.625 3.109-1.758 4.242l-5.988 6c-1.133 1.133-2.64 1.758-4.242 1.758-0.906 0-1.773-0.223-2.57-0.602l2.984-2.984c0.781-0.781 0.781-2.047 0-2.828s-2.047-0.781-2.828 0l-2.984 2.984c-0.383-0.793-0.602-1.66-0.602-2.57 0-1.602 0.625-3.109 1.758-4.242l6-6c1.133-1.133 2.64-1.758 4.242-1.758 0.906 0 1.77 0.223 2.566 0.602l-3.043 3.047c-0.781 0.781-0.781 2.047 0 2.828 0.391 0.391 0.902 0.586 1.414 0.586 0.508 0 1.020-0.195 1.41-0.586l3.039-3.047c0.384 0.793 0.602 1.66 0.602 2.57z"
    ></path>
  </svg>
);

export default ChainIcon;
