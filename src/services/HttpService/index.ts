import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse
} from 'axios';
import { ApiError } from './ApiError';

class HttpService {

  private http: AxiosInstance;
  private config: AxiosRequestConfig;

  public constructor(config: AxiosRequestConfig) {
    this.config = config;
    // instantiate axios
    this.http = axios.create(this.config);
    // set Authorization header if there is a auth token in storage
    this.http.interceptors.request.use(config => {
      if(localStorage.getItem('token') && config && config.headers)
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
      return config;
    });
  }

  public async get(path: string, query?: string, configg?: AxiosRequestConfig)
    : Promise<AxiosResponse> {
      try {
        const p = `${this.config.baseURL}${path}${query || ''}`;
        return await this.http.get(p, configg || this.config);
      } catch(err) {
        if(err.response) {
          return Promise.reject(new ApiError({
            message: err.response.data.message,
            type: err.response.data.type,
            code: err.response.data.code,
            description: err.response.data.description,
            httpStatusCode: err.response.status,
          }));
        }
        if(err.request) {
          return Promise.reject(new ApiError({
            message: 'خطایی در ارتباط با سرور رخ داده است',
            type: 'ServerConnectionError',
            code: 0,
            description: 'این خطا می تواند دلایل متعددی داشته باشد. در صورت ادامه گزارش اشکال ثبت کنید',
            httpStatusCode: err.request.status,
          }));
        }
        return Promise.reject(new ApiError({
          message: 'خطایی در ارسال درخواست به سرور رخ داده است',
          type: 'ServerConnectionError',
          code: 0,
          description: 'این خطا می تواند دلایل متعددی داشته باشد. در صورت ادامه به مدیر سیستم اطلاع بدهید',
          httpStatusCode: err.request.status,
        }));
      }
  }

  public async post(path: string, formData: FormData)
    : Promise<AxiosResponse> {
      try {
        return await this.http.post(`${this.config.baseURL}${path}`, formData);
      } catch(err) {
        if(err.response) {
          return Promise.reject(new ApiError({
            message: err.response.data.message,
            type: err.response.data.type,
            code: err.response.data.code,
            description: err.response.data.description,
            httpStatusCode: err.response.status,
          }));
        }
        if(err.request) {
          if(err.request.status === 401) {
            return Promise.reject(new ApiError({
              message: 'دسترسی برای شما امکان پذیر نیست',
              type: 'ServerConnectionError',
              code: 0,
              description: 'این خطا زمانی ارسال می شود که شما درخواستی دارید که برای شما مجاز نیست.',
              httpStatusCode: err.request.status,
            }));
          }
          if(err.request.status === 404) {
            return Promise.reject(new ApiError({
              message: 'وجود ندارد',
              type: 'NotFoundError',
              code: 0,
              description: 'این ',
              httpStatusCode: err.request.status,
            }));
          }
          return Promise.reject(new ApiError({
            message: 'خطایی در ارتباط با سرور رخ داده است',
            type: 'ServerConnectionError',
            code: 0,
            description: 'این خطا می تواند دلایل متعددی داشته باشد. در صورت ادامه گزارش اشکال ثبت کنید',
            httpStatusCode: err.request.status,
          }));
        }
        return Promise.reject(new ApiError({
          message: 'خطایی در ارسال درخواست به سرور رخ داده است',
          type: 'ServerConnectionError',
          code: 0,
          description: 'این خطا می تواند دلایل متعددی داشته باشد. در صورت ادامه به مدیر سیستم اطلاع بدهید',
          httpStatusCode: err.request.status,
        }));
      }
  }

  public async put(path: string, formData: FormData)
    : Promise<AxiosResponse> {
      try {
        const { data } = await this.http.put(path, formData);
        return data;
      } catch(err) {
        if(err.response) {
          return Promise.reject(new ApiError({
            message: err.response.data.message,
            type: err.response.data.type,
            code: err.response.data.code,
            description: err.response.data.description,
            httpStatusCode: err.response.status,
          }));
        }
        if(err.request) {
          return Promise.reject(new ApiError({
            message: 'خطایی در ارتباط با سرور رخ داده است',
            type: 'ServerConnectionError',
            code: 0,
            description: 'این خطا می تواند دلایل متعددی داشته باشد. در صورت ادامه گزارش اشکال ثبت کنید',
            httpStatusCode: err.request.status,
          }));
        }
        return Promise.reject(new ApiError({
          message: 'خطایی در ارسال درخواست به سرور رخ داده است',
          type: 'ServerConnectionError',
          code: 0,
          description: 'این خطا می تواند دلایل متعددی داشته باشد. در صورت ادامه به مدیر سیستم اطلاع بدهید',
          httpStatusCode: err.request.status,
        }));
      }
  }

  public async delete(path: string, formData: FormData)
    : Promise<AxiosResponse> {
      try {
        const { data } = await this.http.delete(path, { data: formData });
        return data;
      } catch(err) {
        if(err.response) {
          return Promise.reject(new ApiError({
            message: err.response.data.message,
            type: err.response.data.type,
            code: err.response.data.code,
            description: err.response.data.description,
            httpStatusCode: err.response.status,
          }));
        }
        if(err.request) {
          return Promise.reject(new ApiError({
            message: 'خطایی در ارتباط با سرور رخ داده است',
            type: 'ServerConnectionError',
            code: 0,
            description: 'این خطا می تواند دلایل متعددی داشته باشد. در صورت ادامه گزارش اشکال ثبت کنید',
            httpStatusCode: err.request.status,
          }));
        }
        return Promise.reject(new ApiError({
          message: 'خطایی در ارسال درخواست به سرور رخ داده است',
          type: 'ServerConnectionError',
          code: 0,
          description: 'این خطا می تواند دلایل متعددی داشته باشد. در صورت ادامه به مدیر سیستم اطلاع بدهید',
          httpStatusCode: err.request.status,
        }));
      }
  }

}

const INSTANCE = new HttpService({
  baseURL: 'https://api.jamusicapp.ir/v1',
  timeout: 15000,
  headers: {
    'content-type': 'multipart/form-data',
  },
  responseType: 'json',
});

export {
  INSTANCE as HttpService
}
