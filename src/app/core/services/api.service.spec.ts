import { HttpClient, HttpParams } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Environment } from '@environment';
import { ApiService } from '@gal/core/services/api.service';
import { LoadingService } from '@gal/core/services/loading.service';
import { Observable, of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

fdescribe('ApiService', () => {
  let service: ApiService;
  let spyService: ApiService;

  let mockHttp: HttpClient;
  let mockLoading: LoadingService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: HttpClient,
            useFactory: () => instance(mockHttp)
          },
          {
            provide: LoadingService,
            useFactory: () => instance(mockLoading)
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    mockHttp = mock(HttpClient);
    mockLoading = mock(LoadingService);

    service = TestBed.get(ApiService);

    spyService = spy(service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get should call HttpClient', () => {
    const path = 'path';
    const params = 'myparams';
    const httpParams = new HttpParams();
    when(spyService.getHttpParams(anything())).thenReturn(httpParams);
    when(mockHttp.get(anything(), anything())).thenReturn(of());
    when(spyService.handleDefaultOptions(anything())).thenReturn((source) => source);

    const observable = service.get(path);

    expect(observable instanceof Observable).toBeTruthy();
    verify(mockHttp.get(`${Environment.apiUrl}${path}`, anything())).called();
    expect(capture(mockHttp.get).last()).toEqual([ [ `${Environment.apiUrl}${path}`, { params: httpParams } ] ]);
    verify(spyService.handleDefaultOptions(anything())).called();
    verify(spyService.simulateTaskIdPooling()).called();
    verify(spyService.getHttpParams(params)).times(1);
  });

  it('post should call HttpClient', () => {
    const path = 'path';
    const body = 'myParams';
    const paramsNew = new HttpParams();
    when(spyService.getHttpParams(anything())).thenReturn(paramsNew);
    when(mockHttp.post(anything(), anything())).thenReturn(of());
    when(spyService.handleDefaultOptions(anything())).thenReturn((source) => source);

    const obs = service.post(path, body);

    expect(obs instanceof Observable).toBeTruthy();

    verify(spyService.handleDefaultOptions(anything())).times(1);
    verify(spyService.simulateTaskIdPooling()).times(1);
    verify(mockHttp.post(`${Environment.apiUrl}${path}`, body)).times(1);
  });

  it('put should call HttpClient', () => {
    const path = 'path';
    const body = 'myParams';
    const paramsNew = new HttpParams();
    when(spyService.getHttpParams(anything())).thenReturn(paramsNew);
    when(mockHttp.put(anything(), anything())).thenReturn(of());
    when(spyService.handleDefaultOptions(anything())).thenReturn((source) => source);

    const obs = service.put(path, body);

    expect(obs instanceof Observable).toBeTruthy();

    verify(spyService.handleDefaultOptions(anything())).times(1);
    verify(spyService.simulateTaskIdPooling()).times(1);
    verify(mockHttp.put(`${Environment.apiUrl}${path}`, body)).times(1);
  });

  it('patch should call HttpClient', () => {
    const path = 'path';
    const body = 'myParams';
    const paramsNew = new HttpParams();
    when(spyService.getHttpParams(anything())).thenReturn(paramsNew);
    when(mockHttp.put(anything(), anything())).thenReturn(of());
    when(spyService.handleDefaultOptions(anything())).thenReturn((source) => source);

    const obs = service.patch(path, body);

    expect(obs instanceof Observable).toBeTruthy();

    verify(spyService.handleDefaultOptions(anything())).times(1);
    verify(spyService.simulateTaskIdPooling()).times(1);
    verify(mockHttp.patch(`${Environment.apiUrl}${path}`, body)).times(1);
  });
});
