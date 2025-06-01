import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BalanceService } from '../../services/balance.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loading: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    public balanceService: BalanceService
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
      this.balanceService.refreshBalance(username);
      this.loading = false;
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 