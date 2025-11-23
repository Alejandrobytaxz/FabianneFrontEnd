import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  cargo?: string;
  email: string;
  rol: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUsuarioRequest {
  nombre: string;
  cargo?: string;
  email: string;
  password: string;
  rol?: string;
}

export interface UpdateUsuarioRequest {
  nombre?: string;
  cargo?: string;
  email?: string;
  password?: string;
  rol?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/usuarios';

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: CreateUsuarioRequest): Observable<{ message: string; usuario: Usuario }> {
    return this.http.post<{ message: string; usuario: Usuario }>(this.apiUrl, usuario);
  }

  updateUsuario(id: number, usuario: UpdateUsuarioRequest): Observable<{ message: string; usuario: Usuario }> {
    return this.http.put<{ message: string; usuario: Usuario }>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
