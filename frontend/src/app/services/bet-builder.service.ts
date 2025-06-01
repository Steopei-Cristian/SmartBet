import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BetSelection {
  matchId: number;
  matchName: string;
  oddType: string;
  oddValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class BetBuilderService {
  private selections = new BehaviorSubject<BetSelection[]>([]);
  private isVisible = new BehaviorSubject<boolean>(false);

  constructor() {}

  getSelections(): Observable<BetSelection[]> {
    return this.selections.asObservable();
  }

  getVisibility(): Observable<boolean> {
    return this.isVisible.asObservable();
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
} 