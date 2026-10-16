export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: false;
  detail: string | { msg: string; type?: string; loc?: (string | number)[] }[];
  statusCode: number;
}
