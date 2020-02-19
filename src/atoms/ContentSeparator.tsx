import styled from "styled-components";

const ContentSeparator = styled.hr`
  padding: 0;
  margin: 0 0 1rem;
  border: 0;
  border-bottom: 1px solid
    ${props => props.theme.layoutPage.panel.contentSeparator};
`;

export default ContentSeparator;
