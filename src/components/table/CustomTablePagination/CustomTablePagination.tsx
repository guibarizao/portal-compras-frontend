import React, { Dispatch, SetStateAction } from 'react';
import { TablePagination } from '@mui/material';

interface CustomTablePaginationProps {
  totalRows: number;
  currentPage: number;
  perPage: number;
  handleRequest?: (
    perPage: number,
    currentPage: number,
    orderField: string,
    orderDirection: 'asc' | 'desc',
  ) => Promise<void> | undefined;
  setPerPage: Dispatch<SetStateAction<number>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  orderField: string;
  orderDirection: 'asc' | 'desc';
  perPageOptions?: {
    value: number;
    label: string;
  }[];
}

const CustomTablePagination = (props: CustomTablePaginationProps) => {
  const perPageOptions = [
    {
      value: 5,
      label: '5',
    },
    {
      value: 10,
      label: '10',
    },
    {
      value: 25,
      label: '25',
    },
    {
      value: 9999,
      label: 'Todos',
    },
  ];

  const handleChangeCurrentPage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    props.setCurrentPage(newPage);
    await props.handleRequest?.(props.perPage, newPage, props.orderField, props.orderDirection);
  };

  const handleChangePerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let pageSize = props.perPage;

    if (parseInt(event.target.value, 10) === 9999) {
      pageSize = props.totalRows;
    } else {
      pageSize = parseInt(event.target.value, 10);
    }
    props.setPerPage(parseInt(event.target.value, 10));
    props.setCurrentPage(0);
    await props.handleRequest?.(pageSize, 0, props.orderField, props.orderDirection);
  };

  return (
    <TablePagination
      labelRowsPerPage="Linhas"
      component="div"
      count={props.totalRows}
      page={props.currentPage}
      onPageChange={handleChangeCurrentPage}
      rowsPerPage={props.perPage}
      onRowsPerPageChange={handleChangePerPage}
      rowsPerPageOptions={props.perPageOptions || perPageOptions}
    />
  );
};

export default CustomTablePagination;
