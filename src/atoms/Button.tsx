import { darken } from "polished";
import styled from "styled-components";

const Button = styled.button`
  margin: 0 0 1rem 0;
  padding: 0.85rem 1rem;
  border: 1px solid transparent;
  text-align: center;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: ${props => props.theme.button.bgColor};
  color: ${props => props.theme.button.textColor};
  outline: 0;
  transition: background-color 0.25s ease-out, color 0.25s ease-out;

  &:hover {
    background-color: ${props => darken(0.1, props.theme.button.bgColor)};
    cursor: pointer;
  }
`;

export default Button;
