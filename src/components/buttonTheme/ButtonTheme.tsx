import React from "react";
import { LoadingButtonProps } from "@mui/lab";

import { Container } from "./ButtonTheme.styled";

interface IButtonProps extends LoadingButtonProps {}

const ButtonTheme: React.FC<IButtonProps> = ({ children, ...rest }) => {
  return (
    <Container {...rest} variant="contained">
      {children}
    </Container>
  );
};

export { ButtonTheme };
