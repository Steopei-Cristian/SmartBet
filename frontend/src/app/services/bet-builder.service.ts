import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface BetSelection {
  matchId: number;
  matchName: string;
  oddType: string;
  oddValue: number;
}

export interface BetPlacementDTO {
  matchId: number;
  oddType: string;
}

export interface BetResponse {
  betId: number;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class BetBuilderService {
  private selections = new BehaviorSubject<BetSelection[]>([]);
  private isVisible = new BehaviorSubject<boolean>(false);
  private showSuccess = new BehaviorSubject<boolean>(false);
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSelections(): Observable<BetSelection[]> {
    return this.selections.asObservable();
  }

  getVisibility(): Observable<boolean> {
    return this.isVisible.asObservable();
  }

  getShowSuccess(): Observable<boolean> {
    return this.showSuccess.asObservable();
  }

  addSelection(selection: BetSelection) {
    const currentSelections = this.selections.value;
    const existingIndex = currentSelections.findIndex(s => s.matchId === selection.matchId);
    
    if (existingIndex !== -1) {
      currentSelections[existingIndex] = selection;
      this.selections.next([...currentSelections]);
    } else {
      this.selections.next([...currentSelections, selection]);
    }
    
    this.isVisible.next(true);
  }

  removeSelection(index: number) {
    const currentSelections = this.selections.value;
    currentSelections.splice(index, 1);
    this.selections.next([...currentSelections]);
    
    if (currentSelections.length === 0) {
      this.isVisible.next(false);
    }
  }

  removeSelectionByMatchId(matchId: number) {
    const currentSelections = this.selections.value;
    const updatedSelections = currentSelections.filter(s => s.matchId !== matchId);
    this.selections.next(updatedSelections);
    
    if (updatedSelections.length === 0) {
      this.isVisible.next(false);
    }
  }

  clearSelections() {
    this.selections.next([]);
    this.isVisible.next(false);
  }

  hide() {
    this.isVisible.next(false);
  }

  show() {
    this.isVisible.next(true);
  }

  setShowSuccess(value: boolean) {
    this.showSuccess.next(value);
  }

  placeBet(stake: number): Observable<BetResponse> {
    const selections = this.selections.value;
    const betPlacementDTOs: BetPlacementDTO[] = selections.map(selection => ({
      matchId: selection.matchId,
      oddType: selection.oddType
    }));

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<BetResponse>(`${this.apiUrl}/bets/place`, {
      stake,
      selections: betPlacementDTOs
    }, { headers });
  }
} 