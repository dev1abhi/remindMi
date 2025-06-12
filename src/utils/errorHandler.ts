import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  error?: string;
  msg?: string;

}

export function isTokenExpiredError(error: unknown): boolean {
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError.response?.data?.message === 'Invalid token' || 
           axiosError.response?.status === 401;
  }
  return false;
}

export function handleApiError(error: unknown, onTokenExpired?: () => void): void {
  if (isTokenExpiredError(error)) {
    toast.error('Session expired. Please login again.');
    
    // Clear token and redirect to login
    localStorage.removeItem('token');
    
    if (onTokenExpired) {
      onTokenExpired();
    }
    
    return;
  }



//   if (error instanceof Error && 'response' in error) {
//   const axiosError = error as AxiosError<{ error: string }>;
//   const message = axiosError.response?.data?.error  || 'An error occurred';
//   toast.error(message);
// } else if (error instanceof Error) {
//   toast.error(error.message);
// } else {
//   toast.error('An unexpected error occurred');
// }

  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError<ApiError>;
    const data = axiosError.response?.data;

    const message = data?.error || data?.msg || data?.message || 'An error occurred';
    toast.error(message);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }


}