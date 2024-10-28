export class WebResponse<T> {
  message: string;
  success: boolean;
  status_code: number;
  data?: T;
}
