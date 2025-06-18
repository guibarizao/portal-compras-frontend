import React, { HtmlHTMLAttributes } from "react";
import { Container } from "./ElementNoContent.styled";

interface IElementNoContentrops extends HtmlHTMLAttributes<HTMLDivElement> {}

const ElementNoContent: React.FC<IElementNoContentrops> = () => {
  return <Container></Container>;
};

export { ElementNoContent };
