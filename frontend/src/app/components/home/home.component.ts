import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  balance: number = 0;
  loading: boolean = false;
  error: string = '';

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.authService.getCurrentUser()?.role === 'BETTER') {
      this.loadBalance();
    }
  }

  private loadBalance() {
    this.loading = true;
    const username = this.authService.getCurrentUser()?.username;
    if (username) {
      this.userService.getUserBalance(username).subscribe({
        next: (balance) => {
          this.balance = balance;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load balance. Please try again later.';
          this.loading = false;
          console.error('Error loading balance:', error);
        }
      });
    }
  }
} 