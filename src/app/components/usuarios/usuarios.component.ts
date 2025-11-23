import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario, CreateUsuarioRequest } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null;
  mostrarFormulario = false;
  modoEdicion = false;
  isLoading = false;
  errorMessage = '';

  formulario: CreateUsuarioRequest = {
    nombre: '',
    cargo: '',
    email: '',
    password: '',
    rol: 'Personal'
  };

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getAllUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.errorMessage = 'Error al cargar usuarios';
        this.isLoading = false;
      }
    });
  }

  nuevoUsuario(): void {
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.usuarioSeleccionado = null;
    this.formulario = {
      nombre: '',
      cargo: '',
      email: '',
      password: '',
      rol: 'Personal'
    };
  }

  editarUsuario(usuario: Usuario): void {
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.usuarioSeleccionado = usuario;
    this.formulario = {
      nombre: usuario.nombre,
      cargo: usuario.cargo || '',
      email: usuario.email,
      password: '',
      rol: usuario.rol
    };
  }

  guardarUsuario(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.modoEdicion && this.usuarioSeleccionado) {
      const updateData: any = {
        nombre: this.formulario.nombre,
        cargo: this.formulario.cargo || undefined,
        email: this.formulario.email,
        rol: this.formulario.rol
      };
      
      if (this.formulario.password) {
        updateData.password = this.formulario.password;
      }

      this.usuarioService.updateUsuario(this.usuarioSeleccionado.id, updateData).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          this.errorMessage = error.error?.error || 'Error al actualizar usuario';
          this.isLoading = false;
        }
      });
    } else {
      this.usuarioService.createUsuario(this.formulario).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          this.errorMessage = error.error?.error || 'Error al crear usuario';
          this.isLoading = false;
        }
      });
    }
  }

  eliminarUsuario(usuario: Usuario): void {
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre}?`)) {
      this.usuarioService.deleteUsuario(usuario.id).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.errorMessage = error.error?.error || 'Error al eliminar usuario';
        }
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.usuarioSeleccionado = null;
    this.modoEdicion = false;
    this.errorMessage = '';
    this.isLoading = false;
  }
}
