export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  errorSources?: { path: string; message: string }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
  errorSources?: { path: string; message: string }[];
}
