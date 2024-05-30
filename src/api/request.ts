const request = async <T extends object = Record<string, never>>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(url, options);

  if (response.status === 204) {
    return {} as T;
  }

  if (!response.ok) {
    const error: { message?: string } = await response.json();

    throw new Error(error.message || response.status.toString());
  }

  const data: T = await response.json();

  return data;
};

export default request;
