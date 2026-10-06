import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { App_Apis } from '../../../core/constants/app-apis';
import { RegisterRequest, LoginRequest, AuthResponse } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(App_Apis.auth.register, userData);
  }

  login(userData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(App_Apis.auth.login, userData);
  }
}
