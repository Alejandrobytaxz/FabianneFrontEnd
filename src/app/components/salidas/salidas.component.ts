import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalidaService, Salida, DetalleSalida } from '../../services/salida.service';
import { ProductoService, Producto } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-salidas',
  imports: [CommonModule, FormsModule],
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss']
})
export class SalidasComponent implements OnInit {
  private salidaService = inject(SalidaService);
  private productoService = inject(ProductoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  salidas: Salida[] = [];
  productos: Producto[] = [];
  salidaSeleccionada: Salida | null = null;
  mostrarFormulario = false;
  isLoading = false;
  errorMessage = '';

  formulario = {
    numeroDocumento: '',
    tipoSalida: 'Venta',
    destinatario: '',
    observaciones: ''
  };

  detalles: DetalleSalida[] = [];
  nuevoDetalle: DetalleSalida = {
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
    this.cargarSalidas();
    this.cargarProductos();
  }

  cargarSalidas(): void {
    this.isLoading = true;
    this.salidaService.getAllSalidas().subscribe({
      next: (salidas) => {
        this.salidas = salidas;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar salidas:', error);
        this.errorMessage = 'Error al cargar salidas';
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

  verDetalle(salida: Salida): void {
    this.salidaSeleccionada = salida;
    this.mostrarFormulario = false;
  }

  nuevaSalida(): void {
    this.mostrarFormulario = true;
    this.salidaSeleccionada = null;
    this.formulario = {
      numeroDocumento: '',
      tipoSalida: 'Venta',
      destinatario: '',
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

  calcularSubtotal(detalle: DetalleSalida): number {
    return detalle.cantidad * detalle.precioUnitario;
  }

  calcularTotal(): number {
    return this.detalles.reduce((sum, d) => sum + this.calcularSubtotal(d), 0);
  }

  guardarSalida(): void {
    if (this.detalles.length === 0) {
      this.errorMessage = 'Debe agregar al menos un detalle';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const salida = {
      ...this.formulario,
      usuarioId: this.currentUserId,
      detalles: this.detalles
    };

    this.salidaService.createSalida(salida).subscribe({
      next: () => {
        this.cargarSalidas();
        this.cancelar();
      },
      error: (error) => {
        console.error('Error al crear salida:', error);
        this.errorMessage = error.error?.error || 'Error al crear salida';
        this.isLoading = false;
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.salidaSeleccionada = null;
    this.errorMessage = '';
    this.isLoading = false;
    this.detalles = [];
  }

  volverAlHome(): void {
    this.router.navigate(['/home']);
  }
}
