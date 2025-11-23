import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.getCurrentUser();

  // Verificación de roles
  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isPersonal(): boolean {
    return this.authService.isPersonal();
  }

  logout(): void {
    this.authService.logout();
  }
}
