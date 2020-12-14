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

const ClipboardIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox={`0 0 27.5 27.5`}
  >
    <path
      fill={color}
      d="M12 26h14v-10h-6.5c-0.828 0-1.5-0.672-1.5-1.5v-6.5h-6v18zM16 3.5v-1c0-0.266-0.234-0.5-0.5-0.5h-11c-0.266 0-0.5 0.234-0.5 0.5v1c0 0.266 0.234 0.5 0.5 0.5h11c0.266 0 0.5-0.234 0.5-0.5zM20 14h4.672l-4.672-4.672v4.672zM28 16v10.5c0 0.828-0.672 1.5-1.5 1.5h-15c-0.828 0-1.5-0.672-1.5-1.5v-2.5h-8.5c-0.828 0-1.5-0.672-1.5-1.5v-21c0-0.828 0.672-1.5 1.5-1.5h17c0.828 0 1.5 0.672 1.5 1.5v5.125c0.203 0.125 0.391 0.266 0.562 0.437l6.375 6.375c0.594 0.594 1.062 1.734 1.062 2.562z"
    ></path>
  </svg>
);

export default ClipboardIcon;
