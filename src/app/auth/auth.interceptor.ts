import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, finalize, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';

let isRefreshing = false;
let refresh$: Observable<TokenResponse> | null = null;

const refreshAndProceed = (
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {

  if(!refresh$) {
    isRefreshing = true;
    refresh$ = authService.refreshAuthToken().pipe(
      shareReplay(1),
      finalize(() => {
        isRefreshing = false;
        refresh$ = null;
      })
    )

  }

  return refresh$.pipe(
    switchMap((res) => {

      return next(addToken(req, res.access_token));

    }
    )
  )

};


export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req);
  const authService = inject(AuthService);
  const token = authService.token

  if(req.url.includes('refresh')){
    return next(req);
  }

  if (!token) {
    return next(req);
  }

  if (isRefreshing) {
    return refreshAndProceed(authService, req, next);
  }

  return next(addToken(req, token))
    .pipe(
      catchError(error => {

        if (error.status === 403 || error.status === 401) {
          return refreshAndProceed(authService, req, next);
        }

        return throwError(() => error);
        }
      )
    );

}


const addToken = (req: HttpRequest<any>, token:string ) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

