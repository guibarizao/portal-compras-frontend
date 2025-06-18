import styled from "styled-components";

interface IAppContainerProps {
  children: any;
}

const AppContainerStyled = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0px !important;
`;

const AppContainer = (props: IAppContainerProps) => {
  return <AppContainerStyled>{props.children}</AppContainerStyled>;
};

export default AppContainer;
