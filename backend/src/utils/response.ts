export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: {
    code: string;
    details?: unknown;
  };
}

export const sendSuccess = <T>(res: any, statusCode: number, message: string, data?: T): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data: data as T | undefined,
  };

  res.status(statusCode).json(response);
};

export const sendError = (res: any, statusCode: number, message: string, code: string, details?: unknown): void => {
  const response: ApiResponse<never> = {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };

  res.status(statusCode).json(response);
};
