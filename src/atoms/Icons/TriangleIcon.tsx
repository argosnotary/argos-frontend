import React from "react";

import IIconProps from "../../interfaces/IIconProps";

const TriangleIcon: React.FC<IIconProps> = ({ color, size, transform }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    transform={transform}
  >
    <path fill={color} d="M6 4l20 12-20 12z" />
  </svg>
);

export default TriangleIcon;
