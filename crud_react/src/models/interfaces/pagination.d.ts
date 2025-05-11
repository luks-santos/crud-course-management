export interface Pagination<T = any> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  data: T[];
}