import React from "react";

import IIconProps from "../../interfaces/IIconProps";

const EnlargeIcon: React.FC<IIconProps> = ({ color, size, onClick }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    onClick={onClick}
  >
    <path
      fill={color}
      d="M32 0v13l-5-5-6 6-3-3 6-6-5-5zM14 21l-6 6 5 5h-13v-13l5 5 6-6z"
    ></path>
  </svg>
);

export default EnlargeIcon;
