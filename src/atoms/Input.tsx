import styled from "styled-components";

const Input = styled.input`
  overflow: visible;
  box-sizing: border-box;
  height: 2.4375rem;
  margin: 0 0 1rem;
  padding: 0.5rem;
  border: 1px solid #cacaca;
  border-radius: 0;
  background-color: #fefefe;
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  font-family: inherit;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.5;
  color: #0a0a0a;
  transition: box-shadow 0.5s, border-color 0.25s ease-in-out,
    -webkit-box-shadow 0.5s;

  &:focus {
    outline: none;
    border: 1px solid #8a8a8a;
    box-shadow: 0 0 5px #cacaca;
  }
`;

export default Input;
