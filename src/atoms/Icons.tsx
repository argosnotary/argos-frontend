/*
 * Copyright (C) 2019 - 2020 Rabobank Nederland
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

interface IIconProps {
  color: string;
  size: number;
  transform?: string;
}

const KeyIcon: React.FC<IIconProps> = ({ color, size }) => (
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

const AltPlusIcon: React.FC<IIconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
  >
    <path
      fill={color}
      d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM24 18h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z"
    />
  </svg>
);

const PlusIcon: React.FC<IIconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
  >
    <title>plus</title>
    <path
      fill={color}
      d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"
    />
  </svg>
);

const WarningIcon: React.FC<IIconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
  >
    <title>warning</title>
    <path
      fill={color}
      d="M16 2.899l13.409 26.726h-26.819l13.409-26.726zM16 0c-0.69 0-1.379 0.465-1.903 1.395l-13.659 27.222c-1.046 1.86-0.156 3.383 1.978 3.383h27.166c2.134 0 3.025-1.522 1.978-3.383h0l-13.659-27.222c-0.523-0.93-1.213-1.395-1.903-1.395v0z"
    />{" "}
    <path
      fill={color}
      d="M18 26c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"
    />{" "}
    <path
      fill={color}
      d="M16 22c-1.105 0-2-0.895-2-2v-6c0-1.105 0.895-2 2-2s2 0.895 2 2v6c0 1.105-0.895 2-2 2z"
    />
  </svg>
);

const LoaderIcon: React.FC<IIconProps> = ({ color, size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke={color}
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
);

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

const ChainIcon: React.FC<IIconProps> = ({ color, size }) => (
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

export {
  AltPlusIcon,
  KeyIcon,
  LabelIcon,
  LoaderIcon,
  PlusIcon,
  TriangleIcon,
  WarningIcon,
  ChainIcon
};
