import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse
} from 'axios';

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
        const { data } = await this.http.get(p, configg || this.config);
        return data;
      } catch(err) {
        if(err.response) {
          console.log(err.response.data);
        } else if(err.request) {
          console.log(err.request);
        } else {
          console.log(err);
        }
        return Promise.reject(err);
      }
  }

  public async post(path: string, formData: FormData)
    : Promise<AxiosResponse> {
      try {
        const { data } = await this.http.post(`${this.config.baseURL}${path}`, formData);
        return data;
      } catch(err) {
        if(err.response) {
          console.log(err.response.data);
        } else if(err.request) {
          console.log(err.request);
        } else {
          console.log(err);
        }
        return Promise.reject(err);
      }
  }

  public async put(path: string, formData: FormData)
    : Promise<AxiosResponse> {
      try {
        const { data } = await this.http.put(path, formData);
        return data;
      } catch(err) {
        if(err.response) {
          console.log(err.response.data);
        } else if(err.request) {
          console.log(err.request);
        } else {
          console.log(err);
        }
        return Promise.reject(err);
      }
  }

  public async delete(path: string, formData: FormData)
    : Promise<AxiosResponse> {
      try {
        const { data } = await this.http.delete(path, { data: formData });
        return data;
      } catch(err) {
        if(err.response) {
          console.log(err.response.data);
        } else if(err.request) {
          console.log(err.request);
        } else {
          console.log(err);
        }
        return Promise.reject(err);
      }
  }

}

const INSTANCE = new HttpService({
  baseURL: 'http://localhost:4567/api/v1',
  timeout: 10000,
  headers: {
    'content-type': 'multipart/form-data',
  },
  responseType: 'json',
});

export {
  INSTANCE as HttpService
}
