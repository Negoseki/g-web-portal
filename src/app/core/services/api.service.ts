import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@environment';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, delay, finalize, map, timeout } from 'rxjs/operators';
import { LoadingService } from './loading.service';

interface TaskPooling {
  useTaskPooling: boolean;
  taskPoolingUrl?: string;
}

interface TaskResponse {
  taskId: string;
}

export interface ApiOptions {
  showLoading?: boolean;
  defaultErrorHandling?: boolean;
  taskPooling?: TaskPooling;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = Environment.apiUrl;

  constructor(private http: HttpClient, private loading: LoadingService) {}

  get<T = any>(path: string, params: any = {}, options: ApiOptions = {}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`, { params: this.getHttpParams(params) }).pipe(this.handleDefaultOptions(options));
  }

  post<T = any>(path: string, body: any, options: ApiOptions = {}): Observable<T | TaskResponse> {
    return this.http
      .post<TaskResponse>(`${this.apiUrl}${path}`, body)
      .pipe(this.simulateTaskIdPooling(), this.handleDefaultOptions(options));
  }

  put<T = any>(path: string, body: any, options: ApiOptions = {}): Observable<T | TaskResponse> {
    return this.http
      .put<TaskResponse>(`${this.apiUrl}${path}`, body)
      .pipe(this.simulateTaskIdPooling(), this.handleDefaultOptions(options));
  }

  delete<T = any>(path: string, options: ApiOptions = {}): Observable<T | TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.apiUrl}${path}`).pipe(this.simulateTaskIdPooling(), this.handleDefaultOptions(options));
  }

  patch<T = any>(path: string, body: any, options: ApiOptions = {}): Observable<T | TaskResponse> {
    return this.http
      .patch<TaskResponse>(`${this.apiUrl}${path}`, body)
      .pipe(this.simulateTaskIdPooling(), this.handleDefaultOptions(options));
  }

  getHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value === null || value === undefined) {
          return;
        }
        httpParams = httpParams.append(key, value);
      });
    }
    return httpParams;
  }

  handleDefaultOptions(options: ApiOptions): <T>(source: Observable<T>) => Observable<T> {
    const timeoutTime = 60000; // 60 seconds;

    if (options.showLoading) {
      this.loading.show();
    }

    return <T>(source: Observable<T>) =>
      source.pipe(
        timeout(timeoutTime),
        catchError(error => {
          if (options.defaultErrorHandling) {
            if (error.error.errors && error.error.errors.length > 0) {
              // this.snackBar.showError(error.error.errors[0].message);
            } else {
              // this.snackBar.showError();
            }
          }
          return throwError(error);
        }),
        finalize(() => {
          if (options.showLoading) {
            this.loading.hide();
          }
        })
      );
  }

  // TODO: real task id pooling
  simulateTaskIdPooling(): (source: Observable<TaskResponse>) => Observable<any> {
    const delayTime = 2000; // 2 seconds

    return (source: Observable<TaskResponse>) =>
      source.pipe(
        delay(delayTime),
        map(data => data)
      );
  }
}
