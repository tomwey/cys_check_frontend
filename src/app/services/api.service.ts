import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams, Response } from '@angular/http';
import { ToolsService } from './tools.service';
import { API_HOST, API_KEY } from '../api_configs';
import { Md5 } from 'ts-md5/dist/md5';

export interface ResultData {
  code: number;
  total?: number;
  data: any;
}

export interface ErrorData {
  code: number;
  message: string;
}

export interface UriRequest {
  uri: string;
  params: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  count = 0;
  constructor(private http: Http, private tools: ToolsService) { }

  GET(uri, params, loadingText = '加载中...', showLoading = true) {
    if (showLoading) {
      this.showLoading(loadingText);
    }

    const url = API_HOST + '/' + uri;

    const i = new Date().getTime().toString() + (Math.random() * 1000 + 1000).toString();
    const ak = this.generateAccessKey(i);

    const searchParams = new URLSearchParams();
    searchParams.set('i', i);
    searchParams.set('ak', ak);

    if (localStorage.getItem('token')) {
      searchParams.set('token', localStorage.getItem('token'));
    }

    // 合并传进来的参数
    params = params || {};
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const element = params[key];
        searchParams.set(key, element);
      }
    }

    // 参数签名
    searchParams.set('sign', this.signParams(params));

    return new Promise((resolve, reject) => {
      this.http.get(url, new RequestOptions({ search: searchParams }))
        .toPromise()
        .then(resp => {
          this.hideLoading();

          const result = this.handleSuccess(resp);
          if (result.code === 0) {
            resolve(result);
            // resolve({ data: result.data, total: result.total });
          } else {
            reject(result);
          }
        }).catch(error => {
          this.hideLoading();
          const err = this.handleError(error);
          reject(err);
        });
    });
  }

  // 处理POST请求
  POST(uri, params, loadingText = '加载中...', showLoading = true) {
    if (showLoading) {
      this.showLoading(loadingText);
    }

    const url = API_HOST + '/' + uri;

    const i = new Date().getTime().toString() + (Math.random() * 1000 + 1000).toString();
    const ak = this.generateAccessKey(i);

    // 参数签名
    params = params || {};
    params.sign = this.signParams(params);

    params.i = i;
    params.ak = ak;

    if (localStorage.getItem('token')) {
      params.token = localStorage.getItem('token');
    }

    // 封装请求
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ headers });
    return new Promise((resolve, reject) => {
      this.http.post(url, JSON.stringify(params), requestOptions)
        .toPromise()
        .then(resp => {
          this.hideLoading();
          // console.log('success');
          const result = this.handleSuccess(resp);
          if (result.code === 0) {
            resolve(result);
            // resolve({ data: result.data, total: result.total });
          } else {
            reject(result);
          }
        })
        .catch(error => {
          this.hideLoading();

          const err = this.handleError(error);
          reject(err);
        });
    });
  } // end post


  POST2(uri, body: FormData, loadingText = '正在提交', showLoading = true) {
    if (showLoading) {
      this.showLoading(loadingText);
    }

    const url = API_HOST + '/' + uri;

    const i = new Date().getTime().toString() + (Math.random() * 1000 + 1000).toString();
    const ak = this.generateAccessKey(i);

    // 参数签名
    if (localStorage.getItem('token')) {
      // params.token = localStorage.getItem('token');
      body.append('token', localStorage.getItem('token'));
    }

    body.append('i', i.toString());
    body.append('ak', ak);

    // let headers = new Headers({'Content-Type': 'multipart/form-data'});
    return new Promise((resolve, reject) => {
      this.http.post(url, body, null)
        .toPromise()
        .then(resp => {
          this.hideLoading();
          // console.log('success');
          const result = this.handleSuccess(resp);
          if (result.code === 0) {
            resolve(result);
            // resolve({ data: result.data, total: result.total });
          } else {
            reject(result);
          }
        })
        .catch(error => {
          this.hideLoading();

          const err = this.handleError(error);
          reject(err);
        });
    });
  }

  // 处理请求成功的回调
  private handleSuccess(resp: Response): any {
    const body = resp.json();
    // console.log(`result: ${JSON.stringify(body)}`);
    if (body.code === 0) {
      const rd: ResultData = { code: 0, total: body.total, data: body.data || {} };
      return rd;
    } else {
      this.tools.showToast(body.message);

      const errorData: ErrorData = { code: body.code, message: body.message };
      return errorData;
    }
  } // end handle success

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    this.tools.showToast(errMsg);

    const errorData: ErrorData = { code: 500, message: errMsg };
    return errorData;
  }

  private signParams(params: any): string {
    if (!params) {
      return null;
    }
    // console.log(params);
    const keys = Object.keys(params).sort();
    // console.log(`keys:${keys}`);
    if (keys.length === 0) {
      return null;
    }
    let signStr = '';
    keys.forEach(key => {
      const value = params[key];
      // console.log(value + ':' + JSON.stringify(value));
      signStr += value + ':';
    });

    signStr += API_KEY;

    return Md5.hashStr(signStr, false).toString();
  }

  // 生成MD5
  private generateAccessKey(i): string {
    return Md5.hashStr(API_KEY + i.toString(), false).toString();
  }

  private showLoading(loadingText) {
    // console.log(this.count);
    // if (++this.count === 1) {
    this.tools.showLoading(loadingText, 'lines', 120000);
    // }
  }

  private hideLoading() {
    // console.log(this.count);
    // if (--this.count === 0) {
    this.tools.hideLoading();
    // }
  }
}
