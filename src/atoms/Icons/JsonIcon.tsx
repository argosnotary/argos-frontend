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

import IIconProps from "../../interfaces/IIconProps";

const JsonIcon: React.FC<IIconProps> = ({ color, size }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 8.4667 8.4667">
    <g aria-label="{;}">
      <path
        fill={color}
        d="m7.2453 2.9003h-0.12058q-0.30317 0-0.43925 0.12058-0.13608 0.11886-0.13608 0.42547v0.25321q0 0.32728-0.19982 0.49609-0.19809 0.17053-0.53227 0.17053h-0.47198v-0.38585h0.19637q0.10335 0 0.18603-0.015503 0.084405-0.015503 0.14125-0.058566 0.058566-0.044786 0.08785-0.13091 0.029283-0.084405 0.029283-0.21876v-0.18776q0-0.24116 0.13436-0.40308 0.13608-0.16192 0.38585-0.25666v-0.041341q-0.24977-0.09474-0.38585-0.25666-0.13436-0.16192-0.13436-0.40308v-0.18776q0-0.13436-0.029283-0.21876-0.029284-0.086127-0.08785-0.13091-0.056844-0.043064-0.14125-0.058566-0.082682-0.015503-0.18603-0.015503h-0.19637v-0.38585h0.47198q0.33417 0 0.53227 0.17053 0.19982 0.16881 0.19982 0.49609v0.25321q0 0.30661 0.13608 0.42719 0.13608 0.11886 0.43925 0.11886h0.12058zm-2.6338-0.46681h-0.64423v-0.67696h0.64423zm0.10508 0.5805-0.62012 1.3143h-0.38413l0.33934-1.3143zm-1.4831 1.3522h-0.47198q-0.33417 0-0.53399-0.17053-0.19809-0.16881-0.19809-0.49609v-0.25321q0-0.30661-0.13608-0.42547-0.13608-0.12058-0.43925-0.12058h-0.12058v-0.42375h0.12058q0.30317 0 0.43925-0.11886 0.13608-0.12058 0.13608-0.42719v-0.25321q0-0.32728 0.19809-0.49609 0.19982-0.17053 0.53399-0.17053h0.47198v0.38585h-0.19637q-0.10335 0-0.18776 0.015503-0.082682 0.015503-0.13953 0.058566-0.058566 0.044786-0.08785 0.13091-0.029283 0.084405-0.029283 0.21876v0.18776q0 0.24116-0.13608 0.40308-0.13436 0.16192-0.38413 0.25666v0.041341q0.24977 0.09474 0.38413 0.25666 0.13608 0.16192 0.13608 0.40308v0.18776q0 0.13436 0.029283 0.21876 0.029283 0.086127 0.08785 0.13091 0.055121 0.044786 0.13953 0.058566 0.084405 0.015503 0.18776 0.015503h0.19637z"
      />
    </g>
    <g transform="scale(1.0126 .98752)" aria-label="JSON">
      <path
        fill={color}
        d="m7.6325 7.8697h-0.44741l-0.76423-1.2358v1.2358h-0.42564v-1.8005h0.55503l0.65661 1.0315v-1.0315h0.42564zm-1.9904-0.89966q0 0.43048-0.24668 0.68442-0.24668 0.25273-0.682 0.25273-0.43411 0-0.68079-0.25273-0.24668-0.25394-0.24668-0.68442 0-0.43411 0.24668-0.68563 0.24668-0.25273 0.68079-0.25273 0.4329 0 0.68079 0.25273 0.24789 0.25152 0.24789 0.68563zm-0.61549 0.45588q0.067716-0.082227 0.10037-0.19348 0.032649-0.11246 0.032649-0.26361 0-0.16204-0.037486-0.2757t-0.097947-0.1838q-0.06167-0.072553-0.14269-0.1052-0.079808-0.032649-0.16687-0.032649-0.088273 0-0.16687 0.03144-0.07739 0.03144-0.14269 0.10399-0.060461 0.067716-0.099156 0.18743-0.037486 0.1185-0.037486 0.2757 0 0.16083 0.036277 0.27449 0.037486 0.11246 0.097947 0.1838 0.060461 0.071344 0.14148 0.1052 0.081018 0.033858 0.1705 0.033858 0.089482 0 0.1705-0.033858 0.081018-0.035067 0.14148-0.10762zm-1.4547-0.12213q0 0.26603-0.22612 0.4329-0.22491 0.16566-0.61186 0.16566-0.22371 0-0.39058-0.038695-0.16566-0.039904-0.31077-0.10037v-0.43169h0.050787q0.1439 0.11488 0.32165 0.17655 0.17896 0.06167 0.34342 0.06167 0.042323 0 0.11125-0.00726 0.068926-0.00726 0.11246-0.024184 0.053206-0.021766 0.087064-0.054415 0.035067-0.032649 0.035067-0.096737 0-0.059252-0.050787-0.10157-0.049578-0.043528-0.14632-0.066503-0.10157-0.024184-0.21524-0.044741-0.11246-0.021766-0.21161-0.054415-0.22733-0.073762-0.3277-0.19952-0.099156-0.12697-0.099156-0.3144 0-0.25152 0.22491-0.40993 0.22612-0.15962 0.58042-0.15962 0.17776 0 0.35067 0.035067 0.17413 0.033858 0.3011 0.085854v0.41476h-0.049578q-0.10883-0.087063-0.26724-0.14511-0.1572-0.059252-0.32165-0.059252-0.058042 0-0.11608 0.00846-0.056833 0.00726-0.11004 0.029021-0.047159 0.018138-0.081018 0.055624-0.033858 0.036277-0.033858 0.083436 0 0.071344 0.054415 0.11004 0.054415 0.037486 0.20557 0.068925 0.099156 0.020557 0.18985 0.039904 0.091901 0.019347 0.1971 0.053206 0.20678 0.067716 0.30472 0.18501 0.099156 0.11608 0.099156 0.3023zm-1.8767 0.037486q0 0.1185-0.042323 0.2225-0.042323 0.10278-0.12576 0.17413-0.088273 0.076181-0.21282 0.1185-0.12455 0.041114-0.30835 0.041114-0.12455 0-0.23459-0.00967-0.11004-0.00846-0.19348-0.025394v-0.36519h0.043532q0.058042 0.021766 0.12092 0.041113 0.062879 0.018138 0.16083 0.018138 0.12697 0 0.19468-0.033858 0.068925-0.033858 0.097947-0.094319 0.027812-0.059252 0.03144-0.12939 0.00363-0.071344 0.00363-0.18138v-0.71707h-0.41235v-0.33133h0.87668z"
      />
    </g>
    <path
      d="m0.12976 0.12976h8.2072v8.2072h-8.2072zm-0.12955 5.2942 8.4663 0.013173"
      fill="none"
      stroke={color}
      strokeWidth=".8"
    />
  </svg>
);

export default JsonIcon;
