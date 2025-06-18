import styled from "styled-components";

interface IContainerProps {
  logged: boolean;
}

export const Container = styled.footer<IContainerProps>`
  visibility: ${(props) => (props.logged ? "visible" : "hidden")};

  position: fixed; // Alterado de absolute para fixed
  bottom: 0;
  right: 0;
  left: 0; // Garante que ocupe toda a largura
  background-color: #fff;
  display: flex;
  width: 100vw;
  justify-content: flex-end;
  font-weight: bold;

  z-index: 1000; // Garante que fique acima do conteúdo

  > p {
    margin: 0;
    padding: 4px 14px;
    font-size: 0.75rem;

    width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    text-align: right;

    cursor: pointer;

    color: #3fa110;
    transition: color 0.3s;

    &:hover {
      color: #33820d;
    }
  }

  @media (max-width: 600px) {
    width: 100vw;
    > p {
      width: 100vw;
      text-align: center;
    }
  }
`;

export const CustomDialogContent = styled.div`
  padding: 0px;
  h1 {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    max-height: 400px;
  }
`;
