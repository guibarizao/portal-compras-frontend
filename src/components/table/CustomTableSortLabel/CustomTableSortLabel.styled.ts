import { TableCell } from '@mui/material';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const HeadTableCell = styled(TableCell)`
  && {
    white-space: nowrap;
  }
`;

export { Container, HeadTableCell };
