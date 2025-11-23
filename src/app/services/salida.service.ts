import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleSalida {
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

export interface Salida {
  id: number;
  numeroDocumento: string;
  usuarioId: number;
  fechaSalida: string;
  tipoSalida: string;
  destinatario?: string;
  observaciones?: string;
  total: number;
  usuario?: {
    id: number;
    nombre: string;
  };
  detalles?: DetalleSalida[];
}

export interface CreateSalidaRequest {
  numeroDocumento: string;
  usuarioId: number;
  tipoSalida: string;
  destinatario?: string;
  observaciones?: string;
  detalles: DetalleSalida[];
}

@Injectable({
  providedIn: 'root'
})
export class SalidaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/salidas';

  getAllSalidas(): Observable<Salida[]> {
    return this.http.get<Salida[]>(this.apiUrl);
  }

  getSalidaById(id: number): Observable<Salida> {
    return this.http.get<Salida>(`${this.apiUrl}/${id}`);
  }

  createSalida(salida: CreateSalidaRequest): Observable<{ message: string; salida: Salida }> {
    return this.http.post<{ message: string; salida: Salida }>(this.apiUrl, salida);
  }
}
