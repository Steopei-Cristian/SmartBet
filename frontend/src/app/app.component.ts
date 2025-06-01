import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BetBuilderComponent } from './components/bet-builder/bet-builder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BetBuilderComponent],
  template: `
    <router-outlet></router-outlet>
    <app-bet-builder></app-bet-builder>
  `,
  styles: [`
    main {
      padding: 1rem;
      padding-bottom: 200px; /* Add space for the bet builder */
    }
  `]
})
export class AppComponent {
  title = 'SmartBet';
}
