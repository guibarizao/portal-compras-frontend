import { TableCell, TableSortLabel } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { HeadTableCell } from './CustomTableSortLabel.styled';

interface CustomTableSortLabelProps {
  field: string;
  label: string;
  orderDirection: 'desc' | 'asc';
  perPage: number;
  currentPage: number;
  orderField: string;
  disableOrder?: boolean;
  handleRequest?: (
    perPage: number,
    currentPage: number,
    orderField: string,
    orderDirection: 'asc' | 'desc',
  ) => Promise<void> | undefined;
  setDirection?: Dispatch<SetStateAction<'asc' | 'desc'>>;
  setField?: Dispatch<SetStateAction<string>>;
}

const CustomTableSortLabel = (props: CustomTableSortLabelProps) => {
  const handleOrderRequest = async (field: string) => {
    let orderDirection: 'asc' | 'desc' =
      props.orderDirection === 'asc' && props.field === props.orderField ? 'desc' : 'asc';
    props.setDirection?.(orderDirection);
    props.setField?.(field);
    await props.handleRequest?.(props.perPage || 5, props.currentPage || 0, field, orderDirection);
  };

  return props.disableOrder ? (
    <TableCell size="small" sx={{ whiteSpace: 'nowrap' }}>
      {props.label}
    </TableCell>
  ) : (
    <HeadTableCell>
      <TableSortLabel
        active={props.field === props.orderField}
        direction={props.field === props.orderField ? props.orderDirection : 'asc'}
        onClick={() => handleOrderRequest(props.field)}
        hideSortIcon={props.field === props.orderField}
      >
        {props.label}
      </TableSortLabel>
    </HeadTableCell>
  );
};

export default CustomTableSortLabel;
