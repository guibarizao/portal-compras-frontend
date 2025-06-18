import React, { HtmlHTMLAttributes } from 'react';
import { Container } from './TitleContainer.styled';

interface ITitleContainerProps extends HtmlHTMLAttributes<HTMLDivElement> {}

const TitleContainer: React.FC<ITitleContainerProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export { TitleContainer };
