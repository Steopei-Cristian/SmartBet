import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BetBuilderService, BetSelection } from '../../services/bet-builder.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-bet-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bet-builder.component.html',
  styleUrls: ['./bet-builder.component.css']
})
export class BetBuilderComponent implements OnInit {
  private readonly betBuilderService: BetBuilderService;
  selections$;
  isVisible$;
  totalOdd$;

  constructor(
    betBuilderService: BetBuilderService,
    private router: Router
  ) {
    this.betBuilderService = betBuilderService;
    this.selections$ = this.betBuilderService.getSelections();
    this.isVisible$ = this.betBuilderService.getVisibility();
    this.totalOdd$ = this.selections$.pipe(
      map(selections => selections.reduce((total, selection) => total * selection.oddValue, 1))
    );
  }

  ngOnInit() {}

  removeSelection(index: number) {
    this.betBuilderService.removeSelection(index);
  }

  clearSelections() {
    this.betBuilderService.clearSelections();
  }

  placeBet() {
    this.betBuilderService.hide();
    this.router.navigate(['/bet-confirmation']);
  }
} 