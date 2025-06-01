import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private balanceSubject = new BehaviorSubject<number>(0);
  public balance$ = this.balanceSubject.asObservable();

  constructor(private userService: UserService) {}

  setBalance(balance: number) {
    this.balanceSubject.next(balance);
  }

  refreshBalance(username: string) {
    this.userService.getUserBalance(username).subscribe({
      next: (response) => {
        this.balanceSubject.next(response.balance);
      },
      error: (error) => {
        console.error('Error refreshing balance:', error);
      }
    });
  }
} 