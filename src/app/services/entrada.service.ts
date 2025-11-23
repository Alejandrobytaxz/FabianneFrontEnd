import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleEntrada {
  id?: number;
  productoId: number;
  talla: string;
  color: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
  producto?: {
    id: number;
    nombre: string;
    codigo: string;
  };
}

export interface Entrada {
  id: number;
  numeroDocumento: string;
  proveedorId?: number;
  usuarioId: number;
  fechaEntrada: string;
  tipoDocumento: string;
  observaciones?: string;
  total: number;
  proveedor?: {
    id: number;
    nombre: string;
  };
  usuario?: {
    id: number;
    nombre: string;
  };
  detalles?: DetalleEntrada[];
}

export interface CreateEntradaRequest {
  numeroDocumento: string;
  proveedorId?: number;
  usuarioId: number;
  tipoDocumento: string;
  observaciones?: string;
  detalles: DetalleEntrada[];
}

@Injectable({
  providedIn: 'root'
})
export class EntradaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/entradas';

  getAllEntradas(): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl);
  }

  getEntradaById(id: number): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiUrl}/${id}`);
  }

  createEntrada(entrada: CreateEntradaRequest): Observable<{ message: string; entrada: Entrada }> {
    return this.http.post<{ message: string; entrada: Entrada }>(this.apiUrl, entrada);
  }
}
