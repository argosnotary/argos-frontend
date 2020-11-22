/*
 * Copyright (C) 2020 Argos Notary
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
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useRequestErrorStore } from "../stores/requestErrorStore";

const slideDown = keyframes`
  0% {
    opacity: 0;
  }

  10% {
    opacity: 100;
  }

  90% {
    opacity: 100;
  }

  100% {
    opacity: 0;
  }
`;

const animationSeconds = 8;

export const ConnectionErrorMessage = styled.p`
  text-align: center;
  background-color: ${props => props.theme.connectionError.bgColor};
  color: ${props => props.theme.connectionError.textColor};
  padding: 0.25rem 1rem;

  animation: ${animationSeconds}s ${slideDown} ease-in-out forwards;
`;

interface IConnectionErrorProps {
  error: AxiosError | undefined;
}

const ConnectionError: React.FC<IConnectionErrorProps> = ({ error }) => {
  const [displayError, setDisplayError] = useState(false);
  const [_requestError, setRequestError] = useRequestErrorStore();

  useEffect(() => {
    if (error && !error.response) {
      setDisplayError(true);
    }

    if (error && error.response) {
      if (error.response.status >= 400) {
        setDisplayError(true);
      }
    }

    const timeOutHandle = setTimeout(() => {
      setRequestError(undefined);
      setDisplayError(false);
    }, animationSeconds * 1000);

    return () => {
      clearTimeout(timeOutHandle);
    };
  });

  return displayError ? (
    <>
      <ConnectionErrorMessage>
        Could not connect to server. Try again later.
      </ConnectionErrorMessage>
    </>
  ) : null;
};

export default ConnectionError;
