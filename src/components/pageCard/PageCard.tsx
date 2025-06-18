import React from 'react';
import { PaperProps } from '@mui/material';

import { Container } from './PageCard.styled';

interface IPageCardPrps extends PaperProps {}

const PageCard: React.FC<IPageCardPrps> = ({ children, ...rest }) => {
  return <Container elevation={6}>{children}</Container>;
};

export { PageCard };
