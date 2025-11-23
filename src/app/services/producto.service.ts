import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface DetalleProducto {
  id?: number;
  talla: string;
  color: string;
  stock: number;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoriaId: number;
  marca?: string;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  activo: boolean;
  categoria?: Categoria;
  detalles?: DetalleProducto[];
}

export interface CreateProductoRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoriaId: number;
  marca?: string;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  detalles?: DetalleProducto[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/productos';

  getAllProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  createProducto(producto: CreateProductoRequest): Observable<{ message: string; producto: Producto }> {
    return this.http.post<{ message: string; producto: Producto }>(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: Partial<Producto>): Observable<{ message: string; producto: Producto }> {
    return this.http.put<{ message: string; producto: Producto }>(`${this.apiUrl}/${id}`, producto);
  }

  getStockProducto(id: number): Observable<{ stockTotal: number; detalles: DetalleProducto[] }> {
    return this.http.get<{ stockTotal: number; detalles: DetalleProducto[] }>(`${this.apiUrl}/${id}/stock`);
  }
}
