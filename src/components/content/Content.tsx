import styled, { css } from "styled-components";
import AppRouter from "../../router/AppRouter";
import { useAuth } from "../../hooks/auth";

interface IContentProps {
  logged: boolean;
}
const ContentStyled = styled.div<IContentProps>`
  flex: 1;
  width: 100%;
  height: 100vh;
  overflow: auto;
  position: relative;

  margin-bottom: 0;

  ${(props) =>
    props.logged &&
    css`
      margin-bottom: 18px;
    `}
`;

const Content = () => {
  const { state } = useAuth();

  return (
    <ContentStyled logged={state.logged}>
      <AppRouter />
    </ContentStyled>
  );
};

export default Content;
