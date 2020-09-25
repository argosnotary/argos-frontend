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

import IIconProps from "../../interfaces/IIconProps";

const ClipboardIcon: React.FC<IIconProps> = ({ color, size }) => (
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
