import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match.service';
import { Match } from '../../models/match.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from '../game-card/game-card.component';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css'],
  standalone: true,
  imports: [CommonModule, GameCardComponent]
})
export class MatchesComponent implements OnInit {
  matches: Match[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private matchService: MatchService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.getCurrentUser()?.role === 'BETTER') {
      this.loadMatches();
    }
  }

  private loadMatches(): void {
    this.loading = true;
    this.error = null;

    this.matchService.getTodayMatches().subscribe({
      next: (matches) => {
        this.matches = matches;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load matches. Please try again later.';
        this.loading = false;
        console.error('Error loading matches:', error);
      }
    });
  }
} 