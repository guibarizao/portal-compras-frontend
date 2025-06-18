export interface IPaginationReturn<T> {
  perPage: number;
  currentPage: number;
  totalRows: number;
  data: T;
}
