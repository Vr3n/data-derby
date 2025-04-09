export const BASE_URL = "http://127.0.0.1:8000";

export type PaginationParams = {
  skip?: number;
  limit?: number;
};

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

export async function handleRepsonse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API error: ${response.status} ${response.statusText}`,
      data,
    );
  }

  return data as T;
}
