import styled from "styled-components";

export const DashboardContainer = styled.div`
  padding: 0px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin: 24px 0 16px 0;

  img {
    width: 350px;

    @media (max-width: 600px) {
      width: 300px;
    }

    @media (max-width: 400px) {
      width: 200px;
    }

    @media (max-width: 300px) {
      width: 150px;
    }
  }
`;

export const DashboardContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 24px;
`;

export const DashboardCard = styled.div`
  margin: 0 8px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  padding: 8px;
  border-radius: 6px;
  width: 260px;
  height: 130px;
  flex-wrap: wrap;
  position: relative;

  div {
    height: 30px;
    width: 100%;
  }

  > span {
    margin-bottom: 8px;
    color: #3fa110;
  }

  p {
    text-align: center;
    margin: 0;
  }

  h1 {
    color: #5a635a;
    margin: 0;
  }

  > div + div {
    flex: 1;
  }
`;
