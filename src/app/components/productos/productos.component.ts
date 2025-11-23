import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto, CreateProductoRequest } from '../../services/producto.service';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private authService = inject(AuthService);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productoSeleccionado: Producto | null = null;
  mostrarFormulario = false;
  modoEdicion = false;
  isLoading = false;
  errorMessage = '';

  // Formulario
  formulario: CreateProductoRequest = {
    codigo: '',
    nombre: '',
    descripcion: '',
    categoriaId: 0,
    marca: '',
    precioCompra: 0,
    precioVenta: 0,
    stockMinimo: 0
  };

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.getAllCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        if (categorias.length > 0 && this.formulario.categoriaId === 0) {
          this.formulario.categoriaId = categorias[0].id;
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'Error al cargar productos';
        this.isLoading = false;
      }
    });
  }

  verDetalle(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.mostrarFormulario = false;
  }

  nuevoProducto(): void {
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.productoSeleccionado = null;
    this.formulario = {
      codigo: '',
      nombre: '',
      descripcion: '',
      categoriaId: this.categorias.length > 0 ? this.categorias[0].id : 0,
      marca: '',
      precioCompra: 0,
      precioVenta: 0,
      stockMinimo: 0
    };
  }

  editarProducto(producto: Producto): void {
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.productoSeleccionado = producto;
    this.formulario = {
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoriaId: producto.categoriaId,
      marca: producto.marca,
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      stockMinimo: producto.stockMinimo
    };
  }

  guardarProducto(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.modoEdicion && this.productoSeleccionado) {
      this.productoService.updateProducto(this.productoSeleccionado.id, this.formulario).subscribe({
        next: (response) => {
          console.log('Producto actualizado:', response);
          this.cargarProductos();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
          this.errorMessage = error.error?.error || 'Error al actualizar producto';
          this.isLoading = false;
        }
      });
    } else {
      this.productoService.createProducto(this.formulario).subscribe({
        next: (response) => {
          console.log('Producto creado:', response);
          this.cargarProductos();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error al crear producto:', error);
          this.errorMessage = error.error?.error || 'Error al crear producto';
          this.isLoading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.productoSeleccionado = null;
    this.modoEdicion = false;
    this.errorMessage = '';
    this.isLoading = false;
  }

  calcularStockTotal(producto: Producto): number {
    if (!producto.detalles) return 0;
    return producto.detalles.reduce((sum, detalle) => sum + detalle.stock, 0);
  }
}
