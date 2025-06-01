import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-add-match',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.css']
})
export class AddMatchComponent implements OnInit {
  match = {
    team1: '',
    team2: '',
    competition: '',
    homeOdd: 0,
    awayOdd: 0,
    levelOdd: 0,
    date: ''
  };
  teams: string[] = [];
  competitions: string[] = [];
  error: string = '';
  loading: boolean = false;

  constructor(
    private matchService: MatchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTeams();
    this.loadCompetitions();
  }

  private loadTeams() {
    this.matchService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
      },
      error: (error) => {
        this.error = 'Failed to load teams. Please try again later.';
        console.error('Error loading teams:', error);
      }
    });
  }

  private loadCompetitions() {
    this.matchService.getCompetitions().subscribe({
      next: (competitions) => {
        this.competitions = competitions;
      },
      error: (error) => {
        this.error = 'Failed to load competitions. Please try again later.';
        console.error('Error loading competitions:', error);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.matchService.addMatch(this.match).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to add match. Please try again.';
      }
    });
  }
} 