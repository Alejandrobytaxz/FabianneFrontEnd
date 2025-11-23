import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntradaService, Entrada, DetalleEntrada } from '../../services/entrada.service';
import { ProductoService, Producto } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-entradas',
  imports: [CommonModule, FormsModule],
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss']
})
export class EntradasComponent implements OnInit {
  private entradaService = inject(EntradaService);
  private productoService = inject(ProductoService);
  private authService = inject(AuthService);

  entradas: Entrada[] = [];
  productos: Producto[] = [];
  entradaSeleccionada: Entrada | null = null;
  mostrarFormulario = false;
  isLoading = false;
  errorMessage = '';

  formulario = {
    numeroDocumento: '',
    proveedorId: undefined as number | undefined,
    tipoDocumento: 'Factura',
    observaciones: ''
  };

  detalles: DetalleEntrada[] = [];
  nuevoDetalle: DetalleEntrada = {
    productoId: 0,
    talla: '',
    color: '',
    cantidad: 1,
    precioUnitario: 0
  };

  get currentUserId(): number {
    return this.authService.getCurrentUser()?.id || 0;
  }

  ngOnInit(): void {
    this.cargarEntradas();
    this.cargarProductos();
  }

  cargarEntradas(): void {
    this.isLoading = true;
    this.entradaService.getAllEntradas().subscribe({
      next: (entradas) => {
        this.entradas = entradas;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar entradas:', error);
        this.errorMessage = 'Error al cargar entradas';
        this.isLoading = false;
      }
    });
  }

  cargarProductos(): void {
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  verDetalle(entrada: Entrada): void {
    this.entradaSeleccionada = entrada;
    this.mostrarFormulario = false;
  }

  nuevaEntrada(): void {
    this.mostrarFormulario = true;
    this.entradaSeleccionada = null;
    this.formulario = {
      numeroDocumento: '',
      proveedorId: undefined,
      tipoDocumento: 'Factura',
      observaciones: ''
    };
    this.detalles = [];
  }

  agregarDetalle(): void {
    if (this.nuevoDetalle.productoId && this.nuevoDetalle.cantidad > 0 && this.nuevoDetalle.precioUnitario > 0) {
      this.detalles.push({ ...this.nuevoDetalle });
      this.nuevoDetalle = {
        productoId: 0,
        talla: '',
        color: '',
        cantidad: 1,
        precioUnitario: 0
      };
    }
  }

  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
  }

  getProductoNombre(productoId: number): string {
    const producto = this.productos.find(p => p.id === productoId);
    return producto?.nombre || '';
  }

  calcularSubtotal(detalle: DetalleEntrada): number {
    return detalle.cantidad * detalle.precioUnitario;
  }

  calcularTotal(): number {
    return this.detalles.reduce((sum, d) => sum + this.calcularSubtotal(d), 0);
  }

  guardarEntrada(): void {
    if (this.detalles.length === 0) {
      this.errorMessage = 'Debe agregar al menos un detalle';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const entrada = {
      ...this.formulario,
      usuarioId: this.currentUserId,
      detalles: this.detalles
    };

    this.entradaService.createEntrada(entrada).subscribe({
      next: () => {
        this.cargarEntradas();
        this.cancelar();
      },
      error: (error) => {
        console.error('Error al crear entrada:', error);
        this.errorMessage = error.error?.error || 'Error al crear entrada';
        this.isLoading = false;
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.entradaSeleccionada = null;
    this.errorMessage = '';
    this.isLoading = false;
    this.detalles = [];
  }
}
