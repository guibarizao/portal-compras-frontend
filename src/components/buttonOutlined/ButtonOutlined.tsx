import React from "react";
import { LoadingButtonProps } from "@mui/lab";

import { Container } from "./ButtonOutlined.styled";

interface IButtonProps extends LoadingButtonProps {}

const ButtonOutlined: React.FC<IButtonProps> = ({ children, ...rest }) => {
  return (
    <Container variant="outlined" {...rest}>
      {children}
    </Container>
  );
};

export { ButtonOutlined };
