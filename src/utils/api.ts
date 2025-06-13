import axios from 'axios';

export function createAPIClient(accessToken?: string) {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  console.log('API Base URL:', accessToken);

  if (accessToken) {
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    });
  }

  return instance;
}
