import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StripeService } from '../../services/stripe.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit, OnDestroy {
  @ViewChild('cardElement') cardElement!: ElementRef;
  amount: number = 0;
  error: string = '';
  loading: boolean = false;
  private card: any;

  constructor(
    private router: Router,
    public authService: AuthService,
    private stripeService: StripeService
  ) {}

  async ngOnInit() {
    try {
      const elements = await this.stripeService.createElements();
      this.card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': {
              color: '#aab7c4'
            }
          }
        },
        hidePostalCode: true
      });
      this.card.mount(this.cardElement.nativeElement);
    } catch (error) {
      this.error = 'Failed to initialize payment form';
      console.error('Stripe initialization error:', error);
    }
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }

  async onSubmit() {
    if (this.amount <= 0) {
      this.error = 'Please enter a valid amount';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.stripeService.createPaymentIntent(this.amount, 'deposit');
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Payment failed. Please try again';
      this.loading = false;
    }
  }
} 