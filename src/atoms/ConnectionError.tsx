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
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
//import { useRequestErrorStore } from "../stores/requestErrorStore";

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

interface ConnectionErrorProps {
    error: AxiosError | undefined;
}

const ConnectionError: React.FC<ConnectionErrorProps> = (props: ConnectionErrorProps) => {
    const [displayError, setDisplayError] = useState(false);
    //const [_requestError, setRequestError] = useRequestErrorStore();

    useEffect(() => {
        if (props.error && !props.error.response) {
            setDisplayError(true);
        }

        if (props.error && props.error.response) {
            if (props.error.response.status >= 400) {
                setDisplayError(true);
            }
        }

        const timeOutHandle = setTimeout(() => {
            //setRequestError(undefined);
            setDisplayError(false);
        }, animationSeconds * 1000);

        return () => {
            clearTimeout(timeOutHandle);
        };
    });

    return displayError ? (
        <>
            <ConnectionErrorMessage>Could not connect to server. Try again later.</ConnectionErrorMessage>
        </>
    ) : null;
};

export default ConnectionError;
