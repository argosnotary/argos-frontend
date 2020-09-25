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

const RobotIcon: React.FC<IIconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    stroke={color}
    strokeWidth={2.5}
  >
    <path
      fill="none"
      d="m 12.238659,26.268041 c 2.55244,0 5.104879,0 7.657319,0 m 9.285486,-12.667379 h 2.355863 v 8.779 H 29.181464 Z M 0.64487067,13.672026 H 3.0007341 v 8.779 H 0.64487067 Z M 20.799636,16.99111 c 1.185696,0 2.140245,0.891156 2.140245,1.998108 0,1.106952 -0.954549,1.998109 -2.140245,1.998109 -1.185695,0 -2.140244,-0.891157 -2.140244,-1.998109 0,-1.106952 0.954549,-1.998108 2.140244,-1.998108 z m -9.559758,1.36e-4 c 1.185696,0 2.140245,0.891156 2.140245,1.998108 0,1.106952 -0.954549,1.998108 -2.140245,1.998108 -1.185696,0 -2.1402451,-0.891156 -2.1402451,-1.998108 0,-1.106952 0.9545491,-1.998108 2.1402451,-1.998108 z M 16.019757,0.57807198 c 1.462359,0 2.639635,1.05029142 2.639635,2.35491372 0,1.3046224 -1.177276,2.3549134 -2.639635,2.3549134 -1.462356,0 -2.639634,-1.050291 -2.639634,-2.3549134 0,-1.3046223 1.177278,-2.35491372 2.639634,-2.35491372 z M 7.4665883,6.7103129 H 24.715611 c 1.864577,0 3.365664,1.5282915 3.365664,3.4266631 v 17.847199 c 0,1.898371 -1.501087,3.426664 -3.365664,3.426664 H 7.4665883 c -1.8645771,0 -3.3656633,-1.528293 -3.3656633,-3.426664 V 10.136976 c 0,-1.8983716 1.5010862,-3.4266631 3.3656633,-3.4266631 z"
    />
  </svg>
);

export default RobotIcon;
