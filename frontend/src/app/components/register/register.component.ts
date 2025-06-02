import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    try {
      const response = await firstValueFrom(await this.authService.register(this.username, this.password));
      const user = this.authService.getCurrentUser();
      if (user?.role === 'BETTER') {
        this.router.navigate(['/matches']);
      } else {
        this.router.navigate(['/home']);
      }
    } catch (err: any) {
      this.error = err.error.message || 'An error occurred during registration';
    }
  }
} 