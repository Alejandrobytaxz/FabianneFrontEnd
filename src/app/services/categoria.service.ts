import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  _count?: {
    productos: number;
  };
}

export interface CreateCategoriaRequest {
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/categorias';

  getAllCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  createCategoria(categoria: CreateCategoriaRequest): Observable<{ message: string; categoria: Categoria }> {
    return this.http.post<{ message: string; categoria: Categoria }>(this.apiUrl, categoria);
  }

  updateCategoria(id: number, categoria: CreateCategoriaRequest): Observable<{ message: string; categoria: Categoria }> {
    return this.http.put<{ message: string; categoria: Categoria }>(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
