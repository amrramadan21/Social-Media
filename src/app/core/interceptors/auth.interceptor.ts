import { HttpInterceptorFn } from '@angular/common/http';
import { Stored_Keys } from '../constants/stored-keys';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(Stored_Keys.TOKEN);

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  return next(req);
};
