import React from "react";
import { LoadingButtonProps } from "@mui/lab";

import { Container } from "./ButtonInherit.styled";

interface IButtonProps extends LoadingButtonProps {}

const ButtonInherit: React.FC<IButtonProps> = ({ children, ...rest }) => {
  return (
    <Container variant="contained" color="inherit" {...rest}>
      {children}
    </Container>
  );
};

export { ButtonInherit };
