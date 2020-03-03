import React from "react";

import IIconProps from "../../interfaces/IIconProps";

const LabelIcon: React.FC<IIconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
  >
    <path
      fill={color}
      d="M29 3h-11.3l-14.9 14.8 11.3 11.3 14.9-14.8v-11.3zM20 12v-4h4v4h-4z"
    />{" "}
  </svg>
);

export default LabelIcon;
