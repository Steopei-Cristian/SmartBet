import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BetBuilderService, BetSelection } from '../../services/bet-builder.service';
import { BalanceService } from '../../services/balance.service';
import { map, take } from 'rxjs/operators';

interface BetResponse {
  betId: number;
  balance: number;
}

@Component({
  selector: 'app-bet-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bet-confirmation.component.html',
  styleUrls: ['./bet-confirmation.component.css']
})
export class BetConfirmationComponent implements OnInit {
  selections$;
  totalOdd$;
  showSuccess$;
  stake: number = 0;
  isPlacingBet: boolean = false;
  errorMessage: string = '';

  constructor(
    private betBuilderService: BetBuilderService,
    private balanceService: BalanceService,
    private router: Router
  ) {
    this.selections$ = this.betBuilderService.getSelections();
    this.totalOdd$ = this.selections$.pipe(
      map(selections => selections.reduce((total, selection) => total * selection.oddValue, 1))
    );
    this.showSuccess$ = this.betBuilderService.getShowSuccess();
  }

  ngOnInit() {
    // Redirect back if there are no selections
    this.selections$.subscribe(selections => {
      if (selections.length === 0) {
        this.router.navigate(['/matches']);
      }
    });
  }

  removeSelection(index: number) {
    this.betBuilderService.removeSelection(index);
  }

  goBack() {  
    this.betBuilderService.show();
    this.router.navigate(['/matches']);
  }

  placeBet() {
    this.errorMessage = '';

    if (this.stake <= 0) {
      this.errorMessage = 'Please enter a valid stake amount';
      return;
    }

    // Check if stake is greater than balance
    this.balanceService.balance$.pipe(take(1)).subscribe(balance => {
      if (this.stake > balance) {
        this.errorMessage = 'Insufficient balance. Please enter a lower stake amount.';
        return;
      }

      this.isPlacingBet = true;
      this.betBuilderService.placeBet(this.stake).subscribe({
        next: (response: BetResponse) => {
          this.balanceService.setBalance(response.balance);
          this.betBuilderService.setShowSuccess(true);
          
          // Navigate after showing success message
          setTimeout(() => {
            this.betBuilderService.clearSelections();
            this.router.navigate(['/matches']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error placing bet:', error);
          this.errorMessage = 'Failed to place bet. Please try again.';
          this.isPlacingBet = false;
        }
      });
    });
  }
} 