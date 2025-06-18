import React, { FormHTMLAttributes } from "react";

import { Container } from "./Form.styled";

interface IFormProps extends FormHTMLAttributes<HTMLFormElement> {}

const Form: React.FC<IFormProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export { Form };
