import styled from "styled-components";

const NodesBreadCrumb = styled.p`
  font-style: italic;
  font-size: 0.8rem;
  margin: 0.2rem;
  color: ${props => props.theme.treeEditor.breadCrumb.textColor};
`;

const LastBreadCrumb = styled.span`
  color: ${props => props.theme.treeEditor.lastBreadCrumb.textColor};
`;

export { NodesBreadCrumb, LastBreadCrumb };
