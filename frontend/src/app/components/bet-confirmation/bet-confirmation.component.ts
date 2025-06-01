import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BetBuilderService, BetSelection } from '../../services/bet-builder.service';
import { map } from 'rxjs/operators';

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
  stake: number = 0;

  constructor(
    private betBuilderService: BetBuilderService,
    private router: Router
  ) {
    this.selections$ = this.betBuilderService.getSelections();
    this.totalOdd$ = this.selections$.pipe(
      map(selections => selections.reduce((total, selection) => total * selection.oddValue, 1))
    );
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
    this.router.navigate(['/matches']);
  }

  placeBet() {
    // TODO: Implement bet placement logic
    console.log('Placing bet with stake:', this.stake);
  }
} 