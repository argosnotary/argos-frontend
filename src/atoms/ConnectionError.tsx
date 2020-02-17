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

const ConnectionErrorMessage = styled.p`
  text-align: center;
  background-color: ${props => props.theme.connectionError.bgColor};
  color: ${props => props.theme.connectionError.textColor};
  padding: 0.25rem 1rem;

  animation: ${animationSeconds}s ${slideDown} ease-in-out forwards;
`;

interface IConnectionErrorProps {
  error: AxiosError;
}

const ConnectionError: React.FC<IConnectionErrorProps> = ({ error }) => {
  const [displayError, setDisplayError] = useState(false);
  const [_requestError, setRequestError] = useRequestErrorStore();

  useEffect(() => {
    if (error && error.response) {
      if (error.response.status === 404 || error.response.status === 504) {
        setDisplayError(true);
      }
    }

    const timeOutHandle = setTimeout(() => {
      setRequestError({} as AxiosError);
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
