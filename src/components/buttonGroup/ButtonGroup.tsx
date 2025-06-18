import React, { HtmlHTMLAttributes } from "react";
import { Container } from "./ButtonGroup.styled";

interface IButtonGroupProps extends HtmlHTMLAttributes<HTMLDivElement> {
  justformobilie?: boolean;
}

const ButtonGroup: React.FC<IButtonGroupProps> = ({
  justformobilie,
  children,
}) => {
  return <Container justformobilie={justformobilie}>{children}</Container>;
};

export { ButtonGroup };
