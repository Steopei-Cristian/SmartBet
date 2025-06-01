import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetBuilderService } from '../../services/bet-builder.service';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent {
  @Input() match!: Match;
  private selectedOdd: 'home' | 'draw' | 'away' | null = null;

  constructor(private betBuilderService: BetBuilderService) {}

  isSelected(type: 'home' | 'draw' | 'away'): boolean {
    return this.selectedOdd === type;
  }

  selectOdd(type: 'home' | 'draw' | 'away', value: number) {
    if (this.selectedOdd === type) {
      this.selectedOdd = null;
      this.betBuilderService.removeSelectionByMatchId(this.match.matchId);
      return;
    }

    this.selectedOdd = type;
    const matchName = `${this.match.team1} vs ${this.match.team2}`;
    
    this.betBuilderService.addSelection({
      matchId: this.match.matchId,
      matchName,
      oddType: type,
      oddValue: value
    });
  }
} 