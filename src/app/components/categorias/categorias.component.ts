import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriaService, Categoria, CreateCategoriaRequest } from '../../services/categoria.service';

@Component({
  selector: 'app-categorias',
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);

  categorias: Categoria[] = [];
  categoriaSeleccionada: Categoria | null = null;
  mostrarFormulario = false;
  modoEdicion = false;
  isLoading = false;
  errorMessage = '';

  formulario: CreateCategoriaRequest = {
    nombre: '',
    descripcion: ''
  };

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.isLoading = true;
    this.categoriaService.getAllCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.errorMessage = 'Error al cargar categorías';
        this.isLoading = false;
      }
    });
  }

  nuevaCategoria(): void {
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.categoriaSeleccionada = null;
    this.formulario = {
      nombre: '',
      descripcion: ''
    };
  }

  editarCategoria(categoria: Categoria): void {
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.categoriaSeleccionada = categoria;
    this.formulario = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    };
  }

  guardarCategoria(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.modoEdicion && this.categoriaSeleccionada) {
      this.categoriaService.updateCategoria(this.categoriaSeleccionada.id, this.formulario).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          this.errorMessage = error.error?.error || 'Error al actualizar categoría';
          this.isLoading = false;
        }
      });
    } else {
      this.categoriaService.createCategoria(this.formulario).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          this.errorMessage = error.error?.error || 'Error al crear categoría';
          this.isLoading = false;
        }
      });
    }
  }

  eliminarCategoria(categoria: Categoria): void {
    if (confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      this.categoriaService.deleteCategoria(categoria.id).subscribe({
        next: () => {
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          this.errorMessage = error.error?.error || 'Error al eliminar categoría';
        }
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.categoriaSeleccionada = null;
    this.modoEdicion = false;
    this.errorMessage = '';
    this.isLoading = false;
  }

  volverAlHome(): void {
    this.router.navigate(['/home']);
  }
}
